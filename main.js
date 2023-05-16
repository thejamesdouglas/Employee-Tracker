const inquirer = require('inquirer');

const db = require('./mysql.js');

async function viewAllDepartments() {
  try {
    console.log('Calling viewAllDepartments');

    const query = 'SELECT * FROM department';
    const args = [];

    console.log('Executing query:', query);
    console.log('Query arguments:', args);

    const departments = await db.query(query, args);
    console.log('Departments:', departments);
  } catch (err) {
    console.error('Error in viewAllDepartments:', err);
  }
}

async function viewAllRoles() {
  try {
    let roles = await db.query('SELECT * FROM roles');
    console.log(roles);
  } catch (err) {
    console.error(err);
  }
}

async function viewAllEmployees() {
  try {
    let employees = await db.query('SELECT * FROM employee');
    console.log(employees);
  } catch (err) {
    console.error(err);
  }
}

async function addDepartment() {
  try {
    const departmentData = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department (or type "back" to go back):',
      },
    ]);

    const { name } = departmentData;

    if (name.toLowerCase() === 'back') {
      // Go back to the main menu
      return startApp();
    }

    // Check if the department already exists
    const existingDepartment = await db.query('SELECT * FROM department WHERE name = ?', [name]);
    if (existingDepartment.length > 0) {
      console.log('Department already exists.');
      return startApp();
    }

    // Insert the new department into the database
    await db.query('INSERT INTO department (name) VALUES (?)', [name]);
    console.log('Department added successfully.');

    // Prompt the main menu again
    return startApp();
  } catch (err) {
    console.error(err);
  }
}

async function addRole() {
  try {
    const roleData = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the role:',
      },
      {
        type: 'input',
        name: 'department_id',
        message: 'Enter the department ID for the role (refer to the department table):',
      },
    ]);

    console.log('Role data:', roleData);

    const { title, salary, department_id } = roleData;

    console.log('Adding role...');

    // Check if the role already exists
    const existingRole = await db.query('SELECT * FROM roles WHERE title = ?', [title]);
    if (existingRole.length > 0) {
      console.log('Role already exists.');
      return;
    }

    console.log('Inserting role into the database...');

    // Insert the new role into the database
    const result = await db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [
      title,
      salary,
      department_id,
    ]);

    console.log('Role added successfully.');
    console.log('Insert result:', result);
  } catch (err) {
    console.error(err);
  }
}

async function addEmployee() {
  try {
    const employeeData = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "Enter the employee's first name:",
      },
      {
        type: 'input',
        name: 'last_name',
        message: "Enter the employee's last name:",
      },
      {
        type: 'input',
        name: 'role_id',
        message: "Enter the employee's role ID:",
      },
      {
        type: 'input',
        name: 'manager_id',
        message: "Enter the employee's manager ID:",
      },
    ]);

    const { first_name, last_name, role_id, manager_id } = employeeData;

    // Insert the new employee into the database
    await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [
      first_name,
      last_name,
      role_id,
      manager_id,
    ]);

    console.log('Employee added successfully.');
  } catch (err) {
    console.error(err);
  }
}

async function updateEmployeeRole() {
  try {
    // Fetch the list of employees with department names from the database
    const employees = await db.query('SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department FROM employee AS e INNER JOIN roles AS r ON e.role_id = r.id INNER JOIN department AS d ON r.department_id = d.id');

    // Prompt the user to select an employee to update
    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name} (${employee.department}) - ${employee.title}`,
      value: employee.id,
    }));

    const { employeeId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select an employee to update:',
        choices: employeeChoices,
      },
    ]);

    // Fetch the list of roles from the database
    const roles = await db.query('SELECT * FROM role');

    // Prompt the user to select a new role for the employee
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const { roleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'roleId',
        message: 'Select a new role for the employee:',
        choices: roleChoices,
      },
    ]);

    // Update the employee's role in the database
    await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);

    console.log('Employee role updated successfully.');
  } catch (err) {
    console.error(err);
  }
}

module.exports = { 
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};

