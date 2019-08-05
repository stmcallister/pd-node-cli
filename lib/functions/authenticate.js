'use strict'
const qs = require('querystring');
const path = require('path');
const fs = require('fs-extra');
const http = require('http');
const open = require('open');
const url = require('url');
const constants = require('../constants.js');
const pdClient = require('node-pagerduty');
const request = require('request');

let pd = new pdClient('', 'Bearer');

/**
 * Saves access token to disk
 * 
 * @param token
 * @returns {Promise} 
 */
function storeToken(token) {
    return fs.ensureDir(constants.APP_DIR)
        .then(() => {
            const userAuthInfo = JSON.stringify(token);
            const newFile = path.join(constants.APP_DIR, constants.TOKEN_FILE)
            fs.writeFile(newFile, userAuthInfo, 'utf8', (err) => {
                if (err) { return err; }
            });
        })
        .catch((err) => {
            console.error(err)
        });
}

/**
 * Get and store PagerDuty access token taking user through oauth flow
 * 
 * @param string authUrl 
 * @returns {Promise}
 */
function getNewToken(baseOAuthUrl) {
    return new Promise((resolve, reject) => {    
        // build authorization URL with params values
        // parameters to send to the `oauth/authorize` endpoint to initiate flow
        const authParams = {
            response_type: 'code',
            client_id: constants.CLIENT_ID,
            redirect_uri: `${constants.REDIRECT_URL}:${constants.REDIRECT_PORT}`
        };
        const authUrl = `${baseOAuthUrl}/authorize?${qs.stringify(authParams)}`;
        
        // get PagerDuty access token through OAuth

        // spin up local http server to receive auth code callback from PagerDuty
        const server = http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url, true);
            const queryAsObject = parsedUrl.query;
            const authCode = queryAsObject.code;

            // first check if the request contains any errors and display them to the browser
            if (parsedUrl.error) {
                console.error(`Error: ${req.query.error}. Description: ${req.query.error_description}`);
                return;
            }
            const tokenParams = {
                grant_type: `authorization_code`,
                client_id: constants.CLIENT_ID,
                client_secret: constants.CLIENT_SECRET,
                code: authCode,
                redirect_uri: `${constants.REDIRECT_URL}:${constants.REDIRECT_PORT}`
            };

            // retrieve code and request access token
            request.post(`${baseOAuthUrl}/token`, {
                json: tokenParams     
            }, (error, tres, body) => {
                if (error) {
                    console.error(error);
                    return;
                }
                // Use the access token to make a call to the PagerDuty API
                pd = new pdClient(body.access_token, body.token_type);
                pd.users.getCurrentUser({})
                    .then(uRes => {
                        console.log(`Hello, ${JSON.parse(uRes.body).user.name}!`);
                        // if token seems valid, save it to the token_file
                        // store the token
                        const token = {access_token: body.access_token};
                        storeToken(token)
                            .then(() => {
                                resolve(pd);
                            }, (error) => {
                                reject(error);
                            });
                        })
                        .catch(err => {
                            console.error(err);
                        });

            });
            // send response to browser to let user know auth is successful
            res.writeHead(302, {
                // todo: create heroku landing page
                'Location': 'https://stmcallister.github.io/pd-cli-landing/page.html',
            });
            res.end();

            req.connection.end(); // close the socket
            req.connection.destroy(); // close it really
            server.close(); // close the server
        }).listen(constants.REDIRECT_PORT);  // callback server listens on the redirect_port in constants

        // opens browser to the authorizationURL (auth consent form in PagerDuty)
        open(authUrl);

        console.log(`A web page should opened to allow 'PagerDuty-Node-CLI' to:`);
        console.log(`    'Access your PagerDuty Account`);
        console.log(`These permissions are necessary for pulling data from and pushing data to your PagerDuty Account.`);
    });
}
module.exports = {
    deleteToken : () => {
        return new Promise((resolve, reject) => {
            fs.removeSync(path.join(constants.APP_DIR, constants.TOKEN_FILE));
            resolve();
        })
    },
    manual: (access_token) => {
        return new Promise((resolve, reject) => {
            // make a call to PagerDuty to test the validity of the token
            pd = new pdClient(access_token, 'Bearer');
            pd.users.getCurrentUser({})
            .then(uRes => {
                console.log(`Hello, ${JSON.parse(uRes.body).user.name}!`);
                // if token seems valid, save it to the token_file
                // store the token
                const token = {access_token: access_token};
                storeToken(token)
                    .then(() => {
                        // TODO: can't remember what this does
                        resolve(pd);
                    }, (error) => {
                        reject(error);
                    });
                })
                .catch(err => {
                    console.error(err);
                });

        });
    },
    oAuth: () => {
        return new Promise((resolve, reject) => {
            // set file path for the token.json file
            const tokenFile = path.join(constants.APP_DIR, constants.TOKEN_FILE);
            // baseOAuthUrl -- endpoint for initiating an OAuth flow
            const baseOAuthUrl = "https://app.pagerduty.com/oauth";

            // Check if we have previously stored a token.
            fs.readFile(tokenFile, 'utf8', (err, token) => {
                if (err !== null || token === '') {
                    // if there is no tokenFile getNewToken
                    getNewToken(baseOAuthUrl).then((pdClient) => {
                        resolve(pdClient);
                    }, (err) => {
                        reject(err);
                    });
                } else {
                    // use the token from the token.json file to create PagerDuty client
                    let parsedToken = JSON.parse(token);
                    pd = new pdClient(parsedToken.access_token, 'Bearer');

                    // check if token needs to be refreshed and then refresh auth token
                    pd.users.getCurrentUser({})                    
                    .then(function(userProfile) {
                        resolve(pd);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                }
            });
        });
    }
}