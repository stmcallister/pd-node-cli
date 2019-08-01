# PagerDuty-CLI
This is a tool that allows you to interact with PagerDuty without leaving the command line.

To get it installed, run the following command on the command-line:

    npm install -g pd-cli

Then, to use the cli use the `pd` command. To login run:

    pd auth login

To get the rest of the command/subcommand combinations run:

    pd --help


Currently, here are the functions that can be accomplished with the PagerDuty-CLI:

* Users
    * Add
    * Update
    * Delete
    * List
* Auth
    * Login (OAuth)
    * Logout
* WhoAmI
    * Displays info for the current user