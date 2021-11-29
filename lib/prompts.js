
const mysql = require("mysql");
const inquirer = require("inquirer");
const db = require("../db");
const colors = require("colors");

function firstQ() {
    inquirer.prompt([
        {
            type: "list",
            message: "Would you like to view, add, or modify information?",
            name: "firstQChoice",
            choices: ["view", "add", "modify"]
        }
    ])
}