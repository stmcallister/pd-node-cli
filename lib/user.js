const authenticate = require('./functions/authenticate.js');
const chalk = require('chalk');
const camelCase = require('camelcase');

let user = {};

/**
 * Adds a user.
 *
 * @returns Promise
 */
user.add = async function (email, password, name) {
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
 * Deletes a user.
 *
 * @param number userId
 * @param number transferTo
 * @param boolean transferSheets
 * @param boolean removeFromSharing
 *
 * @returns {Promise}
 */
user.delete = async function (userId) {
    const pd = await authenticate.oAuth([]);

    return pd.users.deleteUser(userId);
};

/**
 * List all users.
 *
 * @param {Object} pagination
 *   An optional hash, which may include any combination of the following:
 *   - page
 *   - pageSize
 *   - includeAll
 *
 * @returns Promise
 */
user.listUsers = async function () {
    const pd = await authenticate.oAuth([]);
    let options = {};
    return await pd.users.listUsers(options);
};

user.display = function (record) {
    let identifier = record.email;
    if (record.name) {
        identifier = `${record.name} (${record.id})`;
    }
    console.log(chalk.bold.yellow(identifier));

    console.log('email: %s', record.email);
    console.log('');

};

module.exports = user;
