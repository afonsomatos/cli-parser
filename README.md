cli-parser
==========

cli-parser is an easy and simple-to-use command line parser for creating dynamic CLI apps

Setup interface
===============

```javascript

const Interface = require('cli-parser');

var cli = new Interface({
	name: 'Name of my program',
	desc: 'Detailed description',
	version: '1.0.0',
	outfn: console.log // Function that will output results
})

// Start by adding a command
cli
	.command('add', {
		params: '[number] [number]', 
		desc: 'Adds two numbers' 
	})
	.option('t', 'third', '[number]', 'Adds a third number')
	.callBack(function (opts, n1, n2, n3) {
	
		var sum = +n1 + +n2 + (opts.get('third') || 0);

		cli.output('Result: ', sum);
	});

cli.parse('add 1 2 --third=32');

```

You may have multiple Interfaces. The `Interface Object` sends data to every function in the `outfnStack`.

```javascript

cli.outfnStack = [console.log];

cli.checkOutfn(console.log);  // console.log
cli.addOutfn(console.log);    // Does nothing because it's already there
cli.removeOutfn(console.log); // Removes from stack

// Does nothing since there are no functions in the outfnStack
this.output(1);
```

Interface.Command
=================

```javascript

// To check more Interface.Command#methods
// access Interface.Command.prototype

cli
	.add('commandName', {
		params: '[param1] [param2]',
		desc: 'Useful command description',
	})
	.option({ short: 'l', long: 'lol', param: '[number]', desc: 'Do something' })
	.callBack(function (opts, p1, p2, p3) {
		
		// Both work the same
		opts.get('long');
		opts.has('s');

		// opts.get takes a callBack to execute the returning value
		opts.get('long', function (val) {
			return Number(val);
		});

		// This works too
		opts.get('long', Number);

		// Or this
		Number(opt.get('long'));
		
		
		// Are given as strings
		p1; p2;

	});

// Default helper-command
cli.parse('help');

```

That should be enough to get you started.

Be sure to check `/examples/` for some for some tests and snippets of working code.
The source code `cli-parser.js` has very detailed comments, take a look if you have some trouble.







































