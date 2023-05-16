const db = require('./mysql.js');
const inquirer = require('inquirer');
const {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  // import additional functions for bonus points...
} = require('./main');

function startApp() {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Quit',
        // ...additional choices for bonus points...
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments().then(() => startApp());
          break;
        case 'View all roles':
          viewAllRoles().then(() => startApp());
          break;
        case 'View all employees':
          viewAllEmployees().then(() => startApp());
          break;
        case 'Add a department':
          addDepartment().then(() => startApp());
          break;
        case 'Add a role':
          addRole().then(() => startApp());
          break;
        case 'Add an employee':
          addEmployee().then(() => startApp());
          break;
        case 'Update an employee role':
          updateEmployeeRole().then(() => startApp());
          break;
        case 'Quit':
          console.log('Exiting the application.');
          // Close the database connection here if needed
          break;
        // ...additional cases for bonus points...
      }
    })
    .catch((err) => {
      console.error(err);
      startApp();
    });
}

// ...additional functions for bonus points...

startApp();







