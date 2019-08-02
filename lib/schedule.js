const authenticate = require('./functions/authenticate.js');
const chalk = require('chalk');
const camelCase = require('camelcase');

let schedule = {};

/**
 * Adds a schedule.
 *
 * @returns Promise
 */
schedule.add = async function (email, password, name) {
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
 * Deletes a schedule.
 *
 * @param number scheduleId
 *
 * @returns {Promise}
 */
schedule.delete = async function (scheduleId) {
    const pd = await authenticate.oAuth([]);

    return pd.schedules.deleteSchedule(scheduleId);
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
schedule.list = async function () {
    const pd = await authenticate.oAuth([]);
    let options = {};
    return await pd.schedules.listSchedule(options);
};

schedule.display = function (record) {
    let identifier = record.email;
    if (record.name) {
        identifier = `${record.name} (${record.id})`;
    }
    console.log(chalk.bold.yellow(identifier));

    console.log('# of users: %s', record.users.length);
    console.log('# of teams: %s', record.teams.length);
    console.log('# of escalation policies: %s', record.escalation_policies.length);
    console.log('');

};

module.exports = schedule;
