const Interface = require('../cli-parser');
const assert    = require('assert');

describe('String and object formatting', function () {

    it('should replace {key} with {value} from an object literal', function () {

        var str1 = Interface.format('{name}: hello!', { name: 'John' }),
            str2 = Interface.format('{d0g}: woof!' , { 'd0g': 'Puff'}),
            str3 = Interface.format('{0} {1} {2}', ["I", "love", "JS"]);

        assert.equal(str1, 'John: hello!');
        assert.equal(str2, 'Puff: woof!');
        assert.equal(str3, 'I love JS');

        });

    it('should throw error if non-object was passed', function () {

        assert.throws(function () {
            Interface.format('{something}', 'something:3');
        });

        assert.throws(function () {
            Interface.format('{0}', 0);
        });

    });

    it('should handle own properties of objects', function () {

        var obj = { name: "Afonso", age: 15 };

        var str1 = Interface.format('{0} {1} {2}', [0, 1, 2]),
            str2 = Interface.format('{name} - {age}', obj);

        assert.equal(str1, "0 1 2");
        assert.equal(str2, "Afonso - 15");

    });

});
