#!/usr/bin/env node
const ep = require('./lib/escalation-policy.js');
const program = require('commander');
const process = require('process');
const inquirer = require('inquirer');
const chalk = require('chalk');

program
    .option('-f, --force', 'Skip any confirmation prompts.');

program
    .command('add')
    .action(function () {

    });

program
    .command('delete')
    .option('--user-id [id]', 'The ID of the user to be deleted. Required.')
    .action(function () {
        const info = program.args[program.args.length-1];

        let userId = info.userId || null;

        if (!userId) {
            console.error('The --user-id parameter is required.');
            process.exit(1);
        }
        
        user.delete(userId)
            .then (function (values) {
                console.log('User deleted.');
            })
            .catch(function (error) {
                console.error(error);
            });


    });

program
    .command('list')
    .option('--json', 'Display the results as raw JSON.')

    .action(function () {
        const info = program.args[program.args.length-1];
        let asJson = !!info.json;
 
        ep.list().then(function (results) {
            if (asJson) {
                console.log(results);
            }
            else {
                const parsedBody = JSON.parse(results.body);

                for (let i = 0; i < parsedBody.escalation_policies.length; i++) {
                    let record = parsedBody.escalation_policies[i];
                    ep.display(record);
                }
            }
        });
    });
    
program
    .command('update')
    .option('--user-id [id]', 'The id of the user account to be updated.')
    .option('--add-role [role]', 'Add a role to the user account. Must be one of "admin", "group-admin", "licensed-sheet-creator", "resource-viewer".')
    .option('--remove-role [role]', 'Remove a role from the user account. Must be one of "admin", "group-admin", "licensed-sheet-creator", "resource-viewer".')
    .action(function () {
        const info = program.args[program.args.length-1];
        if (!info.userId) {
            console.error('The --user-id parameter is required.');
        }
        if (info.addRole) {
            user.editRole('add', info.addRole, info.userId)
                .then(json => {
                    console.log('Role added:');
                    console.log('');
                    user.display(json);
                    })
                .catch((error) => {console.error(error)});
        }
        if (info.removeRole) {
            user.editRole('remove', info.removeRole, info.userId)
                .then(json => {
                    console.log('Role removed:');
                    console.log('');
                    user.display(json);
                })
                .catch((error) => {console.error(error)});
        }
    });

program
    .parse(process.argv);
