#!/usr/bin/env node

var program = require('commander');
var phpunit_parser = require('./../src/parser/phpunit.js');

program
    .version('0.0.1')

program
    .command('parse [unit|behat] [file]')
    .description('Parses result file into HTML report')
    .action(function(type, file){
        phpunit_parser.parseFile(file)
    })
    .command("*")


program.parse(process.argv);


var NO_COMMAND_SPECIFIED = program.args.length === 0;

if (NO_COMMAND_SPECIFIED) {
    program.help();
}
