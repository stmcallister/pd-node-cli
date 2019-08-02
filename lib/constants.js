const path = require('path');
const os = require('os');

/**
 * Define constants
 *
 * @returns {void}
 */
function Constants() {
    Object.defineProperties(this, {
        'APP_DIR': {
            value: path.join(os.homedir(), '.pdcli-cli'),
        },
        'TOKEN_FILE': {
            value: 'token.json',
        },
        'REDIRECT_URL': {
            value: 'http://localhost',
        },
        'REDIRECT_PORT': {
            value: '9013',
        },
        'CLIENT_ID': {
            value: '1ce93c6ce0f56c4a339ccd425622fe89a35b7362c496f23529342285eeceeb28'
        },
        'CLIENT_SECRET': {
            value: 'c17383d85c8024e0403d8205971a41d89e3375d6429fb21e0b1419928f4de10a'
        }
    });
}

module.exports = new Constants();