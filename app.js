// Dependencies
require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table')

// Creation of connection
const connection = mysql.createConnection({
  host: 'localhost',
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: process.env.DB_USER,
  // Your password
  password: process.env.DB_PWD,
  database: process.env.DB_NAME
});

connection.connect(function (err) {
  console.log('connected')
  if (err) throw err;
});

// Inquirer prompts / questions for user

const userQuestions = function () {
  inquirer
    .prompt({
      type: 'list',
      name: 'userQuestions',
      message: 'What would you like to do?',
      choices: [
        'View all employees',
        'View all roles',
        'View all departments',
        'Add an employee',
        'Add a department',
        'Add a role',
        'Update an employee role',
        'Remove an employee'
      ]
    })
    .then(function (answer) {
      //console.log(answer);
      // Switch statement with user choices
      switch (answer.userQuestions) {
        case 'View all employees':
          viewEmployees();
          break;

        case 'View all roles':
          viewRoles();
          break;

        case 'View all departments':
          viewDepts();
          break;

        case 'Add an employee':
          addEmployee();
          break;

        case 'Update an employee role':
          updateEmployeeRole();
          break;

        case 'Add a department':
          addDept();
          break;

        case 'Add a role':
          addRole();
          break;

        case 'Remove an employee':
          removeEmployee();
          break;
      }
    });
};
userQuestions();

// Function to allow the user to see all of the available departments
function viewDepts() {
  connection.query('SELECT * FROM department', function (err, answer) {
    //console.log('Departments Retrieved from Database');
    console.table(answer);
    userQuestions();
  });

}

// Function to show the user all of the available employee roles
function viewRoles() {
  connection.query('SELECT * FROM role', function (err, answer) {
    //console.log('Roles Retrieved from Database');
    console.table(answer);
    userQuestions();
  });

}

// Function to show all of the employees available
function viewEmployees() {
  //console.log('retrieving employess from database');
  const infoQuery =
    'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;';
  connection.query(infoQuery, function (err, answer) {
    //console.log('Employees retrieved from Database');
    console.table(answer);
    userQuestions();
  });

}

// Function for adding a new employee to the database
function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'Enter employee first name',
        name: 'firstname'
      },
      {
        type: 'input',
        message: 'Enter employee last name',
        name: 'lastname'
      }
    ])
    .then(function (answer) {
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answer.firstname,
          last_name: answer.lastname,
          role_id: null,
          manager_id: null
        },
        function (err, answer) {
          if (err) {
            throw err;
          }
          //console.log(answer);
        }
      );
      userQuestions();
    });
}

// Function to allow the user to select an employee to update from the db
function updateEmployeeRole() {
  let allemp = [];
  connection.query('SELECT * FROM employee', function (err, answer) {
    for (let i = 0; i < answer.length; i++) {
      let employeeString =
        answer[i].id + ' ' + answer[i].first_name + ' ' + answer[i].last_name;
      allemp.push(employeeString);
    }

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'updateEmpRole',
          message: 'select employee to update role',
          choices: allemp
        },
        {
          type: 'list',
          message: 'select new role',
          choices: ['manager', 'employee',],
          name: 'newrole'
        }
      ])
      .then(function (answer) {
        //console.log('about to update', answer);
        const updateID = {};
        updateID.employeeId = parseInt(answer.updateEmpRole.split(" ")[0]);
        if (answer.newrole === 'manager') {
          updateID.role_id = 1;
        } else if (answer.newrole === 'employee') {
          updateID.role_id = 2;
        }
        connection.query(
          'UPDATE employee SET role_id = ? WHERE id = ?',
          [updateID.role_id, updateID.employeeId],
          function (err, data) {
            userQuestions();
          }
        );
      });
  });
}

// Function to add a new department to the db
function addDept() {
  inquirer
    .prompt({
      type: 'input',
      message: 'enter department name',
      name: 'dept'
    })
    .then(function (answer) {
      connection.query(
        'INSERT INTO department SET ?',
        {
          name: answer.dept
        },
        function (err, answer) {
          if (err) {
            throw err;
          }
        }
      ),
        console.table(answer);
      userQuestions();
    });
}

// Function to add a new role or title to existing employee
function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'enter employee title',
        name: 'addtitle'
      },
      {
        type: 'input',
        message: 'enter employee salary',
        name: 'addsalary'
      },
      {
        type: 'input',
        message: 'enter employee department id',
        name: 'addDepId'
      }
    ])
    .then(function (answer) {
      connection.query(
        'INSERT INTO role SET ?',
        {
          title: answer.addtitle,
          salary: answer.addsalary,
          department_id: answer.addDepId
        },
        function (err, answer) {
          if (err) {
            throw err;
          }
          console.table(answer);
        }
      );
      userQuestions();
    });
}

// Function to delete an employee
function removeEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'enter employee first name',
        name: 'firstName'
      },
      {
        type: 'input',
        message: 'enter employee last name',
        name: 'lastName'
      }
    ])
    .then(function (answers) {

      let employee;
      connection.query('SELECT * FROM employee', function (err, answer) {
        let employees = answer;
        employees.forEach(employeeid => {

          if (employeeid.first_name == answers.firstName && employeeid.last_name == answers.lastName)
            employee = employeeid.id;
        })
        connection.query("DELETE FROM employee WHERE id =?", employee);
        //console.log(employee)    
      })
    });
}