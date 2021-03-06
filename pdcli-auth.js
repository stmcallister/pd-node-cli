#!/usr/bin/env node
const auth = require('./lib/auth.js');
const program = require('commander');

program
    .command('login')
    .description('Login through PagerDuty OAuth')
    .action(function() {
        auth.login();
    });

program
    .command('logout')
    // options arent getting passed corrrectly with the way auth.js is structured
    .description('Removes your PagerDuty access token.')
    .action(function() {
        auth.logout();
    });

    program
        .command('manual')
        .option('--token [accesstoken]', 'Your manually generated PagerDuty Access Token')
        .action(function() {
            const info = program.args[program.args.length-1];
            if (!info.token) {
                console.error('To manually auth you need to provide your PagerDuty Access Token for --token');
                process.exit(1);
            }
            let accessToken = info.token;
            auth.login(accessToken);
        });
program
    .parse(process.argv);
