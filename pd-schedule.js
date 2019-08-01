#!/usr/bin/env node
const user = require('./lib/user.js');
const program = require('commander');
const process = require('process');
const inquirer = require('inquirer');
const chalk = require('chalk');

program
    .option('-f, --force', 'Skip any confirmation prompts.');

program
    .command('add')
    .option('--email [email]', 'The user\'s email address.')
    .option('--password [password]', 'The user\'s password.')
    .option('--name [name]', 'The user\'s name.')
    .action(function () {
        const info = program.args[program.args.length-1];
        if (!info.email) {
            console.error('You must specify a value for --email.');
            process.exit(1);
        }
        if (!info.password) {
            console.error('You must specify a value for --password.');
            process.exit(1);
        }
        if (!info.name) {
            console.error('You must specify a value for --name. Example: --name "Homer Simpson".');
            process.exit(1);
        }
        let email = info.email;
        let password = info.password;
        let name = info.name;
        user.add(email, password, name)
            .then(data => {
                console.log('User added:');
                const userProfile = data.body.user;
                user.display(userProfile);
            })
            .catch(error => console.log(error));
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
 
        user.listUsers().then(function (results) {
            if (asJson) {
                console.log(results);
            }
            else {
                const parsedBody = JSON.parse(results.body);

                for (let i = 0; i < parsedBody.users.length; i++) {
                    let record = parsedBody.users[i];
                    user.display(record);
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
