/*!
 * CLI-parser (in-dev) @07-06-15
 * Simple to use and low-level command line parser
 * http://github.com/afonsomatos/cli-parser
 * 
 * Registered under the MIT License
 */

/**
 * Creates an Interface Object
 * @class
 * @param {Object} [config]
 * @param {string} [config.name]
 * @param {string|integer[]} [config.version]
 * @param {string} [config.desc
 * @param {function} [config.outfn] - Function to be called to output information
 */
var Interface = function(config) {

	config = config || {};

	// Name of the program 
	this.name = config.name || "";
	// Description (used in help default command)
	this.desc = config.desc || "";
	// We use "" as the default so it doesn't pass the @if (this.version)
	this.setVersion(config.version || "");
	
	// Check if config.outfn is a function or isn't declared
	if (typeof config.outfn !== 'function' && config.outfn !== undefined) {
		var error = "Wrong argument-type given as an outfn. " +
					"Expected 'function', got " + typeof config.outfn + ".";
		throw new Error(error);
	} 

	// Functions which will output results
	this.outfnStack = config.outfn ? [config.outfn] : [];
	
	// Array where commands will be stored
	this.commands = [];

	// Format errors
	this.errors   = {
		invalidOption:  "{option}: option invalid",
		badCommand:     "{command}: command was not found"
	};
	
	// Create default help method
	var help = this.command('help', {
		desc: 'Find information about the program',
		options: [{short: 'd', long:'dog', param:'bitch', desc: 'doggie doo'}]
	});
	
	help.callBack(function(/*[opts]*/) {
		var info = '';

		if (this.name)    info += this.name + ' ';
		if (this.version) info += '<version ' + this.version + '>\n\n';
		if (this.desc)    info += this.desc + '\n\n';

		info += "List of available commands <command> [params]\n\n";
		
		var listCommands = [],
			fmt = "{cname} {params}";
		
		for (var i = 1; i <= this.commands.length; i += 2) { 
			listCommands.push([ 
				Interface.format(fmt, this.commands[i-1]),
				Interface.format(fmt, this.commands[i] || {cname: "", params: ""}) 
			]);
		}

		info += Interface.table(listCommands, {cols: 2, padding: 5 });
		
		this.output(info);
	});


	return this;
};

/**
 * Create raw table
 * @param {string[][]} arr - Array of rows
 * @param {Object} [config] - Object to customize the table
 * @param {integer} [config.rows] - Maximum of rows displayed 
 * @param {integer} [config.cols] - Maximum of cols displayed
 * @param {integer} [config.padding=2] - Spaces between cols
 * @param {integer} [config.margin=2] - Spaces before rows
 * @param {integer} [config.lineHeight=0] - \n{x} characters after each row
 */
Interface.table = function(arr, config) {
	
	config = config || {};

	var rows       = config.rows,
		cols 	   = config.cols,
		padding    = config.padding,
		margin     = config.margin,
		lineHeight = config.lineHeight;
 
	if (rows === undefined) 
		rows = arr.length;
	
	if (padding === undefined) 
		padding = 2;
 
	if (margin === undefined) 
		margin = 2;	
 
	lineHeight = lineHeight || 0;
	
	if (cols === undefined) {
		// Find row with most elements
		cols = arr.reduce(function(len, val) {
			return Math.max(len, val.length);
		}, 0);
	}
	
	// Shrink desired rows
	arr = arr.slice(0, rows);
	
	return arr.map(function(row, r) {	
 		
		return " ".repeat(margin) + row.map(function(col, c) {
			// Handle empty/invalid (undefined) cols
			col = col || "";

			// Shrink desired cols
			if (c > cols - 1) return "";
			
			// Find the element with greatest length in column
			var maxLen = arr.reduce(function(max, el) {
				return Math.max(max, (el[c] || "").length);
			}, 0)

			return col + " ".repeat(maxLen - col.length + padding);
 
		}).join('');
 
	}).join('\n'.repeat(lineHeight + 1));
};

/**
 * Format string with {key:value}
 * @example 
 * // returns "John Smith"
 * Interface.format("{name} {sirname}", {name: "John", sirname: "Smith"})
 * @param {string} str 
 * @param {Object} obj
 * @returns {string}
 */
Interface.format = function(str, obj) {
	
	if (typeof obj !== 'object') {
		var error = "Wrong argument-type given. Expected 'object', " +
					"got " + typeof obj + ".";
		throw new Error(error);
	}

	var search;

	for (var key in obj) {
		// Use hasOwnPropety due to the possible prototype extension
		if (obj.hasOwnProperty(key)) {
			search = "{" + key + "}";
			while (str.includes(search)) str = str.replace(search, obj[key]);
		}
	}
	
	return str;
};



/**
 * Output error to the program or calls error's handler
 * @param {string} errName - Key of this.errors
 * @param {Object} obj - Format object
 */
Interface.prototype.sendError = function(errName, obj) {
		
	if (typeof this.errors[errName] === 'function') {
		// Calls the handler
		this.errors[errName]();
	} else {
		// Or formats the error value
		this.output(Interface.format(this.errors[errName], obj));
	}
	
	return this;
};

/** 
 * Write customized error to work with Interface.prototype.sendError
 * @param {string} errName
 * @param {string:function} - Formatting or callBack
 */
Interface.prototype.error = function (errName, format /* or callBack */) {
	
	if (typeof format !== 'function' && typeof format !== 'string') {
		var error = "Invalid argument-type given (" + format + "), " +
					"should be (function|string)."

		throw new Error(error);
	}

	this.errors[errName] = format;		
	
	return this;
};

/**
 * Callback to output data
 * @callback outfn
 * @param {string} data
 */

/**
 * Add output function to be called with Interface.prototype.output
 * @param {outfn:outfn[]} callback - Function(s) to be added to the output stack
 */
Interface.prototype.addOutfn = function(fn) {
	
	if (fn instanceof Array) {

		fn.forEach(function(f) { this.addOutfn(f); }, this);

	} else if(typeof fn !== 'function') {

		throw new Error("Invalid argument-type given. Expected 'function', got " + typeof fn + ".");

	} else if (!this.checkOutfn(fn)) { // Don't double-add the same function
			// Add to the stack
			this.outfnStack.push(fn);

	}

	return this;
};

/**
 * Check if function exists in the output functions stack
 * @param {function} fn
 * @returns {boolean|function} false if function not found or the function itself
 */
Interface.prototype.checkOutfn = function(fn) {
	// Not chainable method
	return this.outfnStack.reduce(function(val, outfn) {
		if (outfn === fn) return outfn;
		return val;
	}, false);
};

/**
 * Remove output function from stack
 * @param {function} fn
 */
Interface.prototype.removeOutfn = function(fn) {
	this.outfnStack = this.outfnStack.filter(function(f) { return f !== fn; });

	return this;
};

/**
 * Output data to output functions on stack
 * @param {string} data
 */
Interface.prototype.output = function(data) {
	// Send to each outfn function the arguments
	this.outfnStack.forEach(function(fn) {
		fn(data);
	});

	return this;
};

/**
 * Change version of the program
 * @param {string|integer[]} version
 */
Interface.prototype.setVersion = function(version) {
	
	if (version instanceof Array) {
		// Extensive format
		this.version = version.join('.');
	} else {
		this.version = String(version);
	}
	
	return this;
};

/**
 * Callback to handle commands
 * @callback commandHandler
 * @param {string} opts - Array of command options
 */

/**
 * Create/overwrite command
 * @param {string} cname - Name of the command
 * @param {Object|commandHandler} [config] - Config object or callBack function
 * @param {string} [config.desc]
 * @param {string} [config.params]
 * @param {commandHandler} [config.callBack]
 *
 * @param {Object[]} [config.options] - Array of option objects
 * @param {string} [config.options.short]
 * @param {string} [config.options.long]
 * @param {string} [config.options.param]
 * @param {string} [config.options.desc]
 *
 * @returns {Object} Interface.Command instance 
 */
Interface.prototype.command = function(cname, config) {
	
	config = config || {};

	if (!(/^(?=.*[a-zA-Z])([\w\d-_]+)$/.test(cname))) {
		var error = 'Invalid command name given (' + cname +')' +
					' - should contain at least one alpha-char and only ' +
					'A-Za-z_-0-9 characters.';

		throw new Error(error);
	}
	
	if (typeof config === "function") {
		config = {callBack: config};
	}

	var params      =  config.params   || "",
		desc        =  config.desc     || "",
		options		=  config.options  || [],
		params      =  config.params   ? [config.params  ] : [],
 		callBack	=  config.callBack ? [config.callBack] : [];
	
	var command = new Interface.Command({
		cname: 	   cname, 
		params:    params, // store params in params ;*
		desc:      desc,
		callStack: callBack, // store callBack in callStack
		options:   options
	}, this);
	
	// Overwrite existing commands
	this.commands = this.commands.filter(function(obj) {
		obj.cname !== cname;
	});

	this.commands.push(command);

	return command;	
};

/**
 * Check if command with given name exists
 * @param {string} cname
 * @returns {boolean|function} false if function not found or the function itself
 */
Interface.prototype.checkCommand = function(cname) {
	// Not chainable method
	return this.commands.reduce(function(val, cmd) {
		if (cmd.cname === cname) return cmd;
		return val;
	}, false);
};

/**
 * Parse input
 * @param {string} input
 */
Interface.prototype.parse = function(input) {
	
	var strings = input.trim().split(/\s+/g),
		args    = [],
		error   = false;

	var options = [];

	var command = this.checkCommand(strings[0]);

	if (!command) {

		this.sendError('badCommand', {command: strings[0]});

		return this;

	} else {

		for (var i = 0; i < strings.length; i++) {
			var str = strings[i], parts;

			if (str[0] === '-') {
				// Option path
				parts = str.split('=');
				str   = parts[0].slice(1);
		
				if (str[0] === '-') {

					str = str.slice(1);

				} else {

					if (str.length > 1 && !command.checkOption(str)) {

						for (var e = 0, optList = str.split(''), chr;
								 e < optList.length; e++) {

							chr = optList[e];

							if (!/[A-Za-z]/.test(chr)) {

								this.sendError('invalidOption', {option: chr});
								break;

							}

							options[chr] = null;
						}
			
						continue;
					}

				}

				options[str] = parts[1] || null;

			} else {
				// Valid argument
				args.push(str);
			}
		}

	}
	
	/** @function options.hasOption
	 *  @param {string} opt
	 *  @returns {boolean}
     */
	var hasOption = function (opt) {
			
			return getOption(opt) !== undefined; 
		},
		
		/** @function options.getOption
         *  @param {string} opt
         *  @param {function} wrapper - Wraps the returned value
         *  @returns {string|null} Null if the option has no value set
         */
		getOption = function (opt, fn) {
			
			var value;
			
			command.options.forEach(function(o) {
				// Search both short and long type		
				if (o.short === opt || o.long === opt) {
					value = options[o.long];
					if (value === undefined) {
						value = options[o.short];
					}
				}

			});
			
			if (value === undefined) {
				value = options[opt];
			}

			if (typeof fn === "function") {
				return fn.call(this, value);
			}
			
			return value;

		};
		
	Object.defineProperties(options, {
		'has': { value: hasOption },
		'get': { value: getOption }
	});
	
	command.callStack.forEach(function(clbck) {
		clbck.apply(command, [options].concat(args.slice(1)));
	});
	
	return this;
};

/**
 * Creates an Interface.Command object
 * @class
 * @param {Object} config
 * @param {string} config.cname
 * @param {string} config.params
 * @param {string} config.desc
 * @param {Object[]} config.options
 * @param {function[]} [config.callStack]
 * @param {function} [config.callBack]
 */
Interface.Command = function(config, _interface) {
	// _interface is a reference to the Interface instance that
	// initiated this call Interface.Command({}, cli)

	this.cname       = config.cname;
	this.params		 = config.params;
	this.desc        = config.desc;
	this.options 	 = config.options;

	this.callStack  = [];

	if (config.callStack) {
		this.callStack = config.callStack;
	}

	if (config.callBack) {
		this.callStack.push(config.callBack);
	}

	// Default help option
	this
		.option('h', 'help', '', 'Show options taken by the command')
		.callBack(function help(opts) {
		
			if (!opts.has('help')) return;

			var info = "";
			
			
			this.params.forEach(function(p, i) {
				info += (!i ? 'Usage: ' : '  or:  ') +
						this.cname                  +
						(this.options.length ? ' [OPTION]... ' : '') +
						(p || "") + '\n';
			}, this);

			if (this.desc) info += '\n' + this.desc + '\n';

			var opts = this.options.map(function(o) {
				return [
					'-'  + o.short + ',',
					'--' + o.long  + (o.param ? '=' + o.param : ''),
					o.desc
				];
			}); 	
				
			info += '\n' + Interface.table(opts, {cols: 3, padding: 1})

			_interface.output(info);
		});

	return this;
};

/**
 * Check if command has the option
 * @param {string} optName
 * @returns {boolean|Object} false if not found or option Object
 */
Interface.Command.prototype.checkOption = function (optName) {

	// Check if option exists in the current command
	return this.options.reduce(function(p, c) {
		if (c.long === optName || c.short === optName) return c;
		return p;
	}, false);

};

/**
 * Remove option from the command object
 * @param {string|string[]|Object|Object[]}
 */
Interface.Command.prototype.removeOption = function (opt) {
	
	// Remove multiple options
	if (opt instanceof Array) {

		opt.forEach(function(o) { this.removeOption(o); }, this);

	} else {

		optObj = typeof opt === 'object' ? opt : this.checkOption(opt);
		
		var i = this.options.indexOf(optObj);

		if (i !== -1) {
			// If it actually exists
			this.options.splice(i, i + 1);
		}

	}
	
	return this;
};

/**
 * Create / Overwrite option for a command object
 * @param {string|Object} short - Alternative: {short, long, param, desc}
 * @param {string} long
 * @param {string} param
 * @param {string} desc
 */
Interface.Command.prototype.option = function(short, long, param, desc) {

	if (typeof short === 'object') {
		var obj = short;

		short  = obj.short || '';
		long   = obj.long  || '';
		param  = obj.param || '';
		desc   = obj.desc  || '';
	}
	
	if (!short && !long) {
		throw new Error("Option has to contain at least a short-type of long-type.")
	}

	if (long.length < 2) {
		throw new Error("Long-type option should have more than one character");
	}

	if (short.length > 1) {
		throw new Error("Short-type option should only have one character");
	}

	if (short && !/[a-zA-Z]/.test(short)) {
		throw new Error("Short-type option (" + short + ") shouldn't contain non-alpha characters.");
	}

	if (long && !/^[\w]+[\w\d-]*$/.test(long)) {
		var error = "Long-type option (" + long + ") should only contain " + 
					"-_A-Za-z0-9 characters and start with a word character";
		throw new Error(error); 
	}

	// Delete existing options that have same short / long chars
	this.removeOption([short, long])

	this.options.push({ 
		short: short,
		long: long,
		param: param,
		desc: desc
	});
	
	return this;
};

/**
 * Clear call stack of command
 * @param {function[]} callStack - Reset callStack
 */
Interface.Command.prototype.resetCallStack = function(callStack) {

	this.callStack = callStack ? callStack : [];

	return this;
};

/**
 * Remove callBack from callStack from command
 * @param {function[]|function} fn - Array of callBacks or a callBack
 */
Interface.Command.prototype.removeCallBack = function(fn) {

	if (fn instanceof Array) {
		// Remove every callBack in the array
		fn.forEach(function(clbck) { 
			this.removeCallBack(clbck);
		}, this);

	} else if (fn === undefined) {
		// remove last callBack added		
		this.callStack.pop();

	} else {

		this.callStack.filter(function(clbck) {
			return clbck !== fn;
		});	
		
	}

	return this;
};

/**
 * Add a callBack to the callStack
 * @param {function} fn
 */
Interface.Command.prototype.callBack = function(fn) {

	if (typeof fn !== 'function') {
		var error = "Wrong argument-type given as a callBack. Expected 'function', " +
					"got " + typeof fn + ".";
		throw new Error(error);
	}

	this.callStack.push(fn);

	return this;
};

/**
 * Change description of the command
 */
Interface.Command.prototype.setDesc = function(desc) {
	this.desc = desc;

	return this;
};

/**
 * Change params of the command
 */
Interface.Command.prototype.setParams = function(params) {
	this.params = params;

	return this;
};

/**
 * Add params option to the command
 * @param {string} params
 */
Interface.Command.prototype.addParams = function(params) {
	this.params.push(params);

	return this;
}

/**
 * Remove params option from the command
 * @param {string|string[]} params 
 */
Interface.Command.prototype.removeParams = function(params) {

	if (params instanceof Array) {
		params.forEach(function(p) {
			this.removeParams(p);
		}, this); 
	} else {
		this.params = this.params.filter(function(p) { return p !== params; });
	}

	return this;
}




















// Export Interface Class
exports = module.exports = Interface;
