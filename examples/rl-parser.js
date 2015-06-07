// Working with built-in readline module
const readline  = require('readline');
const Interface = require('../cli-parser');

// Configure CLInterface
var cli = new Interface({
	name: 'rl-parser',
	version: '1.0.0',
	desc: 'Work with readline',
	outfn: console.log
});

/*
 * Second argument given to cli.command 
 * may be object OR one callBack
 */
cli.command('scream', function (opts, str) {
	
	cli.output(str);

});

// Configure readline
var rl  = readline.createInterface({
	input:  process.stdin,
	output: process.stdout
})

rl.closeConfirmed = false;
rl.setPrompt('> ');
rl.prompt();

rl.on('line', function(data) {
	rl.closeConfirmed = false;
	cli.parse(data);
	rl.prompt();
});

rl.on('SIGINT', function() {
	if (rl.closeConfirmed) {
		console.log();
		return rl.pause();
    }
	rl.closeConfirmed = true;
	console.log('\n(^C again to exit)');
	rl.prompt();
});

