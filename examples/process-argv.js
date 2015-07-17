const Interface = require('../cli-parser');

/*
 * Because the program is a command it self
 * there is no need to configure the Interface object
 */
var cli = new Interface({ outfn: console.log });

cli
    .command('process-argv', function (opts, str) {
        cli.output(str);
        if (opts.has('twice'))
            cli.output(str);
    })
    .option('t', 'twice', '', 'Output twice');

/*
 * Process.argv should return 
 * something like ['node', '/...', arg1, arg2]
 * slice it and append it to the command name
 */
cli.parse('process-argv ' + process.argv.slice(2).join(' '));
