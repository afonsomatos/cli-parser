const Interface = require('../cli-parser');
const assert    = require('assert');

var cli = new Interface({ /* ... */ });

describe('Output functions stacking', function () {

    it('should handle multiple output functions', function () {

        var f1 = new Function(),
            f2 = new Function(),
            f3 = new Function();

        var wrongAmount = "Wrong amount of output functions";

        cli.addOutfn(f1);
        assert.equal(cli.outfnStack.length, 1, wrongAmount);
        cli.addOutfn(f2);
        assert.equal(cli.outfnStack.length, 2, wrongAmount);
        cli.addOutfn(f3);
        assert.equal(cli.outfnStack.length, 3, wrongAmount);

    });

    it('should not add repeated functions', function () {

        var f1 = new Function(),
            f2 = new Function();
        
        for (var i = 0; i < 10; i++) cli.addOutfn(f1);
        for (var i = 0; i < 30; i++) cli.addOutfn(f2);

        assert.equal(cli.outfnStack.filter(function (f) { return f === f1 }).length, 1);
        assert.equal(cli.outfnStack.filter(function (f) { return f === f2 }).length, 1);

    });

    it('should remove functions safely from the stack', function () {

        var f1 = new Function(),
            f2 = new Function();

        cli.addOutfn(f1);
        cli.removeOutfn(f1);

        cli.addOutfn(f2);
        cli.removeOutfn(f2);
        cli.removeOutfn(f2);

        assert.equal(cli.outfnStack.indexOf(f1), -1);
        assert.equal(cli.outfnStack.indexOf(f2), -1);

    });

    it('should check whether a function is in the output stack', function () {

        var f1 = new Function(),
            f2 = new Function();

        cli.addOutfn(f1);

        assert.equal(cli.checkOutfn(f1), f1);
        assert.equal(cli.checkOutfn(f2), false);

    });

    it('should call the output functions with the proper data', function () {

        var m1, m2, m3,
            useless = function (data) { m3 = data; };

        cli.addOutfn(function (data) { m1 = data; });
        cli.addOutfn(function (data) { m2 = data; });
        cli.addOutfn(useless);

        cli.removeOutfn(useless);
        cli.output('The data');

        assert.equal(m1, 'The data');
        assert.equal(m2, 'The data');
        assert.equal(m3, undefined);
        
    });

});
