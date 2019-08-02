const authenticate = require('./functions/authenticate.js');
const chalk = require('chalk');
const camelCase = require('camelcase');

let ep = {};

/**
 * Adds a team.
 *
 * @returns Promise
 */
ep.add = async function (email, password, name) {
    const pd = await authenticate.oAuth([]);
    const options = {
        email: email,
        name: name,
        password: password
    };
    const cuResult = await pd.users.getCurrentUser({});
    const currentUser = JSON.parse(cuResult.body).user;

    return await pd.users.createUser(currentUser.email, options);
};

/**
 * Deletes a team.
 *
 * @param number teamId
 *
 * @returns {Promise}
 */
ep.delete = async function (teamId) {
    const pd = await authenticate.oAuth([]);

    return pd.teams.deleteteam(teamId);
};

/**
 * List all escalationPolicies.
 *
 * @param {Object} pagination
 *
 * @returns Promise
 */
ep.list = async function () {
    const pd = await authenticate.oAuth([]);
    let options = {};
    return await pd.escalationPolicies.listEscalationPolicies(options);
};

ep.display = function (record) {
    let identifier = record.email;
    if (record.name) {
        identifier = `${record.name} (${record.id})`;
    }
    console.log(chalk.bold.yellow(identifier));
    console.log('');

};

module.exports = ep;
