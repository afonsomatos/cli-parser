const Interface = require('../cli-parser');

/*
 * Name, version and desc properties 
 * are directly available from the
 * object created and used in the
 * default-help command
 */
var cli = new Interface({
	name: 'My program',
	version: '1.0.0',
	outfn: console.log
});

/*
 * Default help command outputs program information:
 * interface.name
 * interface.version
 * interface.desc
 * interface.commands
 */
cli.commands.checkCommand('help');

cli.parse('help');



