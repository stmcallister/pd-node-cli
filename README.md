# PagerDuty-CLI
*NOTE: This project is still very much a demo proof of concept, and does not fully support all the functionalities of the PagerDuty API*

This is a tool that allows you to interact with PagerDuty without leaving the command line.

To get it installed, run the following command on the command-line:

    npm install -g pd-cli

Then, to use the cli use the `pdcli` command. To login run:

    pdcli auth login

To get the rest of the command/subcommand combinations run:

    pdcli --help


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