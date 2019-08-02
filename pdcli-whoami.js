#!/usr/bin/env node
const program = require('commander');
const authenticate = require('./lib/functions/authenticate.js');
const user = require('./lib/user.js');

program
    .parse(process.argv);

const gotAuth = authenticate.oAuth([]);

const currentUser = Promise.all([gotAuth, ]).then((values) => {
    const pd = values[0];

    pd.users.getCurrentUser({})
    .then(function(result) {
        const userProfile = JSON.parse(result.body).user;
        user.display(userProfile);
    })
    .catch(function(error) {
        console.log(error);
    });
});   