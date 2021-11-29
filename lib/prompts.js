
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
    ]).then(function (deptAnswers) {
        if (deptAnswers.firstQChoice === "add") {
            addWhat(deptAnswers)
        } else if (deptAnswers.firstQChoice === "view") {
            viewWhat(deptAnswers)
        } else (
            modifyWhat(deptAnswers)
        )
    });
}

function addWhat() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to add?",
            name: "addWhatChoice",
            choices: ["New Department", "New Role", "New Employee"]
        }
    ]).then(function (addWhatAnswers) {
        if (addWhatAnswers.addWhatChoice === "New Department") {
            addDept()
        } else if (addWhatAnswers.addWhatChoice === "New Role") {
            addRole()
        } else {
            addEmployee();
        }
    });
}

function viewWhat() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to view?",
            name: "viewWhatChoice",
            choices: ["Departments", "Roles", "Employees"]
        }
    ]).then(function (viewWhatAnswers) {
        if (viewWhatAnswers.viewWhatChoice === "Departments") {
            viewDept()
        } else if (viewWhatAnswers.viewWhatChoice === "Roles") {
            viewRole()
        } else {
            viewEmployee();
        }
    });
}

function modifyWhat() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "modifyWhatChoice",
            choices: ["Change an employee's manager", "Change an employee's role"]
        }
    ]).then(function (modifyWhatAnswers) {
        if (modifyWhatAnswers.modifyWhatChoice === "Change an employee's manager") {
            modifyMgrEmplSel()
        } else {
            modifyRoleEmplSel()
        }
    });
}

function addDept() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the department name",
            name: "addDeptAnswer",
        }
    ]).then(function (newDeptResults) {
        db.connection.query(
            "INSERT INTO department SET ?",
            {
                name: newDeptResults.addDeptAnswer,
            },
            function (err, res) {
                if (err) throw err;
                console.log(`Success!  You have added the department ${newDeptResults.addDeptAnswer}`.underline.brightGreen)
                continueOption();
            })
    }
    )
};

function addRole() {
    db.connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the name of the job title",
                name: "addRoleTitle",
            },
            {
                type: "input",
                message: "What is the salary for this position?",
                name: "addRoleSalary",
            },
            {
                type: "list",
                message: "In which department will this role be?",
                name: "addRoleDept",
                choices: function () {
                    const choiceArrayDepts = []
                    for (let i = 0; i < res.length; i++) {
                        choiceArrayDepts.push(`${res[i].id} | ${res[i].name}`);
                    }
                    return choiceArrayDepts
                }
            },
        ]).then(function (newRoleResults) {
            if (newRoleResults.addRoleSalary != parseInt(newRoleResults.addRoleSalary)) {
                console.log(`The salary must be numbers only, without letters or special characters.  Please try again.`.underline.red);
                addRole();
            } else {
                db.connection.query("INSERT INTO role SET ?",
                    {
                        title: newRoleResults.addRoleTitle,
                        salary: newRoleResults.addRoleSalary,
                        department_id: parseInt(newRoleResults.addRoleDept.slice(0, 3))
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(`Success!  You have added the role ${newRoleResults.addRoleTitle}`.underline.brightGreen)
                        continueOption();
                    })
            }
        })
    }
    )
}

function addEmployee() {
    db.connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the employee's first name",
                name: "addEmployeeNameF",
            },
            {
                type: "input",
                message: "Enter the employee's last name",
                name: "addEmployeeNameL",
            },
            {
                type: "list",
                message: "Which team will they be joining?",
                name: "addEmployeeRole",
                choices: function () {
                    const choiceArrayRoles = []
                    for (let i = 0; i < res.length; i++) {
                        choiceArrayRoles.push(`${res[i].id} | ${res[i].title}`);
                    }
                    return choiceArrayRoles
                }
            },
            {
                type: "confirm",
                message: "And will this person be a people manager?",
                name: "addEmployeeIsMgr",
            },
            {
                type: "confirm",
                message: "Great, will this employee report to a manager?",
                name: "addEmployeeHasMgr",
            },
        ]).then(function (newEmployeeResults) {
            let query = db.connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: newEmployeeResults.addEmployeeNameF,
                    last_name: newEmployeeResults.addEmployeeNameL,
                    role_id: parseInt(newEmployeeResults.addEmployeeRole.slice(0, 5)),
                    is_manager: newEmployeeResults.addEmployeeIsMgr,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " employee inserted!\n");
                    if (newEmployeeResults.addEmployeeHasMgr === true) {
                        console.log(`Almost there with ${newEmployeeResults.addEmployeeNameF} ${newEmployeeResults.addEmployeeNameL}, just a couple of questions about their manager`.underline.brightGreen)
                        getMgr()
                    } else {
                        console.log(`Success!  You have added` `${newEmployeeResults.addEmployeeNameF} ${newEmployeeResults.addEmployeeNameL}`.underline.brightGreen`to the team!`)
                        continueOption();
                    }
                }
            )
        })
    })
};

function getMgr() {
    db.connection.query("SELECT * FROM employee WHERE is_manager=1", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Who is the manager?",
                name: "addEmployeeMgr",
                choices: function () {
                    const choiceArrayMgrs = []
                    for (let i = 0; i < res.length - 1; i++) {
                        choiceArrayMgrs.push(`${res[i].id} | ${res[i].first_name} ${res[i].last_name}`);
                    }
                    return choiceArrayMgrs
                }
            }
        ]).then(function (mgrQ) {
            const idArr = []
            db.connection.query("SELECT id FROM employee", function (err, ans) {
                for (let i = 0; i < ans.length; i++) {
                    idArr.push(ans[i].id)
                }
                const newest = idArr[idArr.length - 1];
                const mgr = parseInt(mgrQ.addEmployeeMgr.slice(0, 5));
                if (newest === mgr) {
                    console.log(`Looks like you have the same id as the employee and the manager.  Please try again.`)
                    getMgr();
                } else {
                    addMgr(newest, mgr);
                }
            });
        })
    })
}

function addMgr(manager, employee) {
    db.connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [employee, manager], function (err, res) {
        if (err) {
            console.log(err)
        } else {
            console.log(`Employee and manager added :)`.underline.brightGreen)
            continueOption();
        }
    })
}

function viewDept() {
    db.connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        const deptArr = []
        for (var i = 0; i < res.length; i++) {
            deptArr.push(res[i])
        }
        console.table(deptArr);
        continueOption();
    });
}

function viewRole() {
    db.connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        const roleArr = []
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i])
        }
        console.table(roleArr);
        continueOption();
    });
}

function viewEmployee() {
    db.connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        const empArr = []
        for (var i = 0; i < res.length; i++) {
            empArr.push(res[i]);
        }
        console.table(empArr);
        continueOption();
    });
}

function modifyRoleEmplSel() {
    db.connection.query("SELECT id, first_name, last_name FROM employee", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which employee is changing?",
                name: "modifyRoleChangedE",
                choices: function () {
                    const choiceArrayEmpl = []
                    for (let i = 0; i < res.length; i++) {
                        choiceArrayEmpl.push(`${res[i].id} | ${res[i].first_name} ${res[i].last_name}`);
                    }
                    return choiceArrayEmpl
                }
            },
        ]).then(function (empl) {
            const changingEmpl = parseInt(empl.modifyRoleChangedE.slice(0, 5));
            modifyRoleRoleSel(changingEmpl)
        })
    })
}

function modifyRoleRoleSel(empl) {
    const employee = empl
    db.connection.query("SELECT id, title FROM role", function (err, res) {
        inquirer.prompt([
            {
                type: "list",
                message: "What will be the new role be?",
                name: "modifyRoleChangedR",
                choices: function () {
                    const choiceArrayRole = []
                    for (let i = 0; i < res.length; i++) {
                        choiceArrayRole.push(`${res[i].id} | ${res[i].title}`);
                    }
                    return choiceArrayRole
                }
            },
        ]).then(function (role) {
            const newRole = parseInt(role.modifyRoleChangedR.slice(0, 5));
            const changingEmpl = role.employee
            let query = db.connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [newRole, employee], function (err, res) {
                if (err) {
                } else {
                    console.log("All set!".underline.brightGreen)
                    continueOption();
                }
            })
        })
    })
}

function modifyMgrEmplSel() {
    db.connection.query("SELECT id, first_name, last_name FROM employee", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which employee will you be changing?",
                name: "modifyMgrChangedE",
                choices: function () {
                    const choiceArrayEmpl = []
                    for (let i = 0; i < res.length; i++) {
                        choiceArrayEmpl.push(`${res[i].id} | ${res[i].first_name} ${res[i].last_name}`);
                    }
                    return choiceArrayEmpl
                }
            },
        ]).then(function (empl) {
            const changingEmpl = parseInt(empl.modifyMgrChangedE.slice(0, 5));
            modifyMgrMgrSel(changingEmpl)
        })
    })
}

function modifyMgrMgrSel(empl) {
    const employee = empl
    db.connection.query("SELECT id, first_name, last_name FROM employee WHERE is_manager = 1", function (err, res) {
        inquirer.prompt([
            {
                type: "list",
                message: "Who is the new manager?",
                name: "modifyMgrChangedM",
                choices: function () {
                    const choiceArrayMgr = []
                    for (let i = 0; i < res.length; i++) {
                        choiceArrayMgr.push(`${res[i].id} | ${res[i].first_name} ${res[i].last_name}`);
                    }
                    return choiceArrayMgr
                }
            },
        ]).then(function (people) {
            const mgr = parseInt(people.modifyMgrChangedM.slice(0, 5));
            const changingEmpl = employee

            if (mgr === changingEmpl) {
                console.log(`You have the same manager and employee id.  Please try again.`.underline.red)
                modifyMgrEmplSel()
            } else {
                db.connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [mgr, changingEmpl], function (err, res) {
                    if (err) {
                    } else {
                        console.log(`All set, thanks!`.underline.brightGreen)
                        continueOption();
                    }
                })
            }
        })
    })
}

function continueOption() {
    inquirer.prompt([
        {
            type: "list",
            message: "Is there anything else you would like to do?",
            name: "loopAnswer",
            choices: ["yes", "no"]
        }
    ]).then(function (answer) {
        if (answer.loopAnswer === "yes") {
            firstQ()
        } else {
            console.log("all done".underline.brightGreen)
            db.connection.end()
        }
    })
}

exports.firstQ = firstQ