const authenticate = require('./functions/authenticate.js');
const chalk = require('chalk');
const camelCase = require('camelcase');

let incident = {};

/**
 * Adds a incident.
 *
 * @returns Promise
 */
incident.add = async function (email, password, name) {
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
 * Deletes a incident.
 *
 * @param number incidentId
 *
 * @returns {Promise}
 */
incident.delete = async function (incidentId) {
    const pd = await authenticate.oAuth([]);

    return pd.incidents.deleteincident(incidentId);
};

/**
 * List all users.
 *
 * @param {Object} pagination
 *
 * @returns Promise
 */
incident.list = async function () {
    const pd = await authenticate.oAuth([]);
    let options = {};
    return await pd.incidents.listIncidents(options);
};

incident.display = function (record) {
    let identifier = `${record.title} (${record.incident_number})`;
    console.log(chalk.bold.yellow(identifier));
    console.log(record.description);
    console.log('');

};

module.exports = incident;
