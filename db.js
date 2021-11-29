

const mysql = require("mysql")
const prompts = require("./lib/prompts")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "416Nardwar@",
    database: "empolyeeManagmentSystem"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    prompts.firstQ();
});

exports.connection = connection

