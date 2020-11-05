// Dependencies
const env = require('dotenv');
const mysql = require('mysql');
const inquirer = require('inquirer');
const console = require('console.table')

// Creation of connection
const connection = mysql.createConnection({
    host: 'localhost',
    // Your port; if not 3306
    port: PORT,
    // Your username
    user: DB_USER,
    // Your password
    password: DB_PWD,
    database: DB_NAME
});

connection.connect(function (err) {
    console.log('connected')
    if (err) throw err;
});

// Inquirer prompts / questions for user

const userQuestions = function() {
    inquirer
      .prompt({
        type: "list",
        name: "userQuestions",
        message: "What would you like to do?",
        choices: [
          "view all employees",
          "view all roles",
          "view all departments",
          "add employee",
          "add department",
          "add role",
          "update employee role",
          "remove employee"
        ]
      })
      .then(function(answer) {
        console.log(answer);
        // start of switch statment for user choice
        switch (answer.userQuestions) {
          case "view all employees":
            viewEmployees();
            break;
  
          case "view all roles":
            viewRoles();
            break;
  
          case "view all departments":
            viewDepts();
            break;
  
          case "add employee":
            addEmployee();
            break;
  
          case "update employee role":
            updateEmployeeRole();
            break;
  
          case "add department":
            addDept();
            break;
  
          case "add role":
            addRole();
            break;
        }
      });
  };
  userQuestions();