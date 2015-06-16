cli-parser
==========

cli-parser is an easy and simple-to-use command line parser for creating dynamic CLI apps

Npm package is available
```
npm install cli-parser
```

Setup interface
===============

```javascript

const Interface = require('cli-parser');

var cli = new Interface({
	name: 'Name of my program',
	desc: 'Detailed description',
	version: '1.0.0',
	outfn: function (data) { // Function that will output results
		process.stdout.write(data + '\n');
	}
})

// Start by adding a command
cli
	.command('add', {
		params: '[Number, Number]', 
		desc: 'Adds two numbers' 
	})
	.option('t', 'third', '[number]', 'Adds a third number')
	.callBack(function (opts, n1, n2) {
	
		var sum = +n1 + +n2 + (+opts.get('third') || 0);

		cli.output('Result: ' + sum);
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
cli.output(1);
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
		
		opts.get('long'); // Gets the corresponding value || null
		opts.has('s');    // returns true or false

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

License
======

```
The MIT License (MIT)

Copyright (c) 2015 cli-parser

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```



































