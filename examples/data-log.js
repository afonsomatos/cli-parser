// Logging every data parsed
const Interface = require('../cli-parser');

var cli = new Interface({ outfn: console.log }),
    datalog = "";

/*
 * cli.output calls every outfn from the output stack
 * addOutfn and use it as a data-logger
 */
cli.addOutfn(function(data) {
    
    datalog += Date() + ' >>\n' + data + '\n';

});


cli.output("Something");
cli.output("Hello\nI'm\nYour Father");

console.log(datalog);

/*
 * Sun Jun 07 2015 12:30:19 GMT+0100 (WEST) >>
 * Something
 * Sun Jun 07 2015 12:30:19 GMT+0100 (WEST) >>
 * Hello
 * I'm
 * Your Father
 */


