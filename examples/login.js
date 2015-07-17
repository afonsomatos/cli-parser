const Interface = require('../cli-parser');

/*
 * All properties of the object passed
 * to the Interface constructor are optional
 * and can be changed later on (cli[prop])
 */
var cli = new Interface({
    name: 'Interface example',
    desc: 'Private server',
    version: '1.0.0',
    outfn: console.log
});

var users = [ {name: 'John', pass: 'qwerty123'} ];

cli
    .command('login', {
        usage: '[name] [passwd]',
        desc: 'Enter the server'
    })
    .callBack(function(opts, name, passwd) {
        
        /*
         * The current scope is the Interface.Command object 
         * this => cli.checkCommand('login')
         */

        users.forEach(function(obj, i) {
            if (obj.name === name && obj.passwd === passwd) {
                cli.output('Welcome, ' + name);
                // ...
            } else if (i === users.length - 1) {
                cli.output('User and password do not match');
            }
        });

    });


cli.parse('login John qwerty123');
