

const mysql = require("mysql")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3001,
    user: "root",
    password: "416Nardwar@",
    database: "employeeManagmentSystem"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
});

exports.connection = connection

