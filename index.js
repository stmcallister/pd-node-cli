#!/usr/bin/env node

const package = require('./package.json');
const program = require('commander');
const path = require('path');
const lib = path.join(__dirname, './lib');
// WARNING: If you use .action it will break all sub commands
process.title = "pdcli";

program
    .version(package.version);

program
    .command('auth  [subcommand]', 'Authorization')
    .command('user [subcommand]', 'User functions')
    .command('schedule [subcommand]', 'Schedule commands')
    .command('team [subcommand]', 'Team commands')
    .command('service [subcommand]', 'Commands related to Services')
    .command('escalation-policy [subcommand]', 'Commands related to Escalation Policies')
    .command('incident [subcommand]', 'Commands related to Incidents')
    .command('vendor [subcommand]', 'Commands related to Vendors')
    .command('response-plays [subcommand]', 'Commands related to Response Plays')
    .command('whoami', 'shows which pagerduty account is connected');
    
program.on('--help', function () {
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('**** todo: flesh out below examples');
    console.log('');
    console.log('    $ pdcli user get ');
    console.log('    $ pdcli schedule create ');
    console.log('    $ pdcli service ');
    console.log('    $ pdcli escalation-policy ')
    console.log('    $ pdcli incident list ')
    console.log('    $ pdcli event-rules ')
    console.log('');
});

program.parse(process.argv);
