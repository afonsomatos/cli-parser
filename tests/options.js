const Interface = require('../cli-parser');
const assert    = require('assert');

var cli = new Interface({ /* ... */ });

describe('Options parser', function () {

	it('should know whether a certain option was given', function () {

		var hasCarrots, hasApples;

		cli
			.command('bag', function (opts) {
				hasCarrots = opts.has('carrots');
				hasCarrots = opts.has('c');
				hasApples  = opts.has('apples')
			})
			.option('c', 'carrots', '', '');

		cli.parse('bag --carrots');

		assert.equal(hasCarrots, true);
		assert.equal(hasApples, false);

	});

	it('should get the value of a certain option', function (){

		var scream, strength;

		cli
			.command('scream', function (opts) {
				scream   = opts.get('message');
				strength = opts.get('s');
			})
			.option('m', 'message', '', '')
			.option('s', 'strength', '', '');

		cli.parse("scream -s=3 --message=help");

		assert.equal(scream, "help");
		assert.equal(strength, '3');

	});

});