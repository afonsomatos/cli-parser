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

	it('should get the value of a certain option', function () {

		var scream, strength;

		cli
			.command('scream', function (opts) {
				scream   = opts.get('message');
				strength = opts.get('strength');
			})
			.option('m', 'message', '', '')
			.option('s', 'strength', '', '');

		cli.parse("scream -s=3 --message=help");

		assert.equal(scream, "help");
		assert.equal(strength, '3');

	});

	it('should handle non-set options', function () {

		var orange, tomato, lemon, money;

		cli
			.command('shop', function (opts) {
				orange	= opts.has('orange');
				tomato  = opts.has('tomato');
				lemon   = opts.has('lemon');
				money   = opts.get('money', Number);
			});

		cli.parse('shop --orange --tomato --lemon --money=20');

		assert.equal(orange, true);
		assert.equal(tomato, true);
		assert.equal(lemon, true);
		assert.equal(money, 20);

	});

});