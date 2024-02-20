// We inport all the dependencies that we need.
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cfonts = require('cfonts');

// Declaring the PORT variable
const PORT = process.env.PORT || 3001;
const green = "\x1b[32m";
const red = "\x1b[31m";
const yellow = "\x1b[33m";

// Initializing express
const app = express();

//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to the database
const db = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'7Enero2000.',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
    );

//Function that shows the title of the app
cfonts.say('SQL Employee Tracker', {
	font: 'block',              // define the font face
	align: 'center',              // define text alignment
	colors: ['white'],         // define all colors
	background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
	letterSpacing: 1,           // define letter spacing
	lineHeight: 1,              // define the line height
	space: true,                // define if the output text should have empty lines on top and on the bottom
	maxLength: '0',             // define how many character can be on one line
	gradient: false,            // define your two gradient colors
	independentGradient: false, // define if you want to recalculate the gradient for each new line
	transitionGradient: false,  // define if this is a transition between colors directly
	env: 'node'                 // define the environment cfonts is being executed in
});

promptUser = () => {
    inquirer
    .prompt([
        {
            type:'list',
            name:'view-options',
            message:'What would you like to do?',
            choices:['View All Departments','View All Roles','View All Employees','View Employees By Manager','View Employees By Department','Add Department','Add Role','Add Employee','Update Employee Role','Update Employee Manager', 'Delete Employees, Roles or Departments',`View Department's Total Utilized Budget`,'Quit']

        },
    ])
    .then((answers) => {
        switch(answers["view-options"]){
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Update Employee Manager':
                updateEmployeeManager();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View Employees By Department':
                viewByDepartment();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'View Employees By Manager':
                viewByManager();
                break;
            case 'Delete Employees, Roles or Departments':
                deleteData();
                break;
            case `View Department's Total Utilized Budget`:
                viewTotalBudget();
                break;
            case 'Quit':
                cfonts.say('GOOD BYE!', {
                    font: 'block',              // define the font face
                    align: 'center',              // define text alignment
                    colors: ['white'],         // define all colors
                    background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
                    letterSpacing: 1,           // define letter spacing
                    lineHeight: 1,              // define the line height
                    space: true,                // define if the output text should have empty lines on top and on the bottom
                    maxLength: '0',             // define how many character can be on one line
                    gradient: false,            // define your two gradient colors
                    independentGradient: false, // define if you want to recalculate the gradient for each new line
                    transitionGradient: false,  // define if this is a transition between colors directly
                    env: 'node'                 // define the environment cfonts is being executed in
                });
                db.end();
                break;
        };
    });
};

// function for viewing the data
viewAllDepartments = () => {
    const sql = `SELECT * FROM department
    ORDER BY id`;
    db.query(sql, (err, res) => {
      if (err) {
        res.status(500).json({ error: err.message });
         return;
      }
      console.table(res);
      promptUser();

    });
};

viewAllRoles = () => {
    const sql = `SELECT role.id, role.title, department.name AS department, role.salary 
    FROM role
    JOIN department ON role.department_id = department.id
    ORDER BY id`;
    db.query(sql, (err, res) => {
      if (err) {
        res.status(500).json({ error: err.message });
         return;
      }
      console.table(res);
      promptUser();

    });
};

viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role , department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager ON employee.manager_id = manager.id 
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id`;
    
    db.query(sql, (err, res) => {
      if (err) {
        res.status(500).json({ error: err.message });
         return;
      }
      console.table(res);
      promptUser();  
    });
};

//Function to view employees by Manager
viewByManager = () => {
    const sql = `SELECT employee.id, CONCAT(manager.first_name, ' ', manager.last_name) AS manager, employee.first_name AS Employee_first_name, employee.last_name AS Employee_last_name, role.title AS role , department.name AS department, role.salary
    FROM employee
    LEFT JOIN employee manager ON employee.manager_id = manager.id 
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    ORDER BY manager.id`;
    
    db.query(sql, (err, res) => {
      if (err) {
        res.status(500).json({ error: err.message });
         return;
      }
      console.table(res);
      promptUser();  
    });
};

//Function fo view employees by Department
viewByDepartment = () => {
    const sql = `SELECT employee.id, department.name AS department, employee.first_name AS Employee_first_name, employee.last_name AS Employee_last_name, role.title AS role , role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager ON employee.manager_id = manager.id 
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    ORDER BY department.id`;
    
    db.query(sql, (err, res) => {
      if (err) {
        res.status(500).json({ error: err.message });
         return;
      }
      console.table(res);
      promptUser();  
    });
};

// functions to add data
addDepartment = () => {
    inquirer
    .prompt([
        {
            type:'input',
            name:'department',
            message:'What is the name of the new department?',
        }
    ])
    .then((answers) => {
    const sql = `INSERT INTO department (name)
    VALUES ("${answers.department}");`;
    db.query(sql, (err, res) => {
        if (err) {
          res.status(500).json({ error: err.message });
           return;
        }
        console.log(`${green}${answers.department} has been added to the database.🏬`);
        promptUser();
      });
    });
};

addRole = () => {
    const sql2 = `SELECT * FROM department`;
    db.query(sql2, (err, res) => {
         departmentList = res.map(departments => ({
            name: departments.name,
            value: departments.id
        })) ;
    return inquirer
    .prompt([
        {
            type:'input',
            name:'title',
            message:'What is the name of the new role?',
        },
        {
            type:'input',
            name:'salary',
            message:'What is the salary for this role?',
        },
        {
            type:'list',
            name:'department',
            message:'Which department does this role belong to?',
            choices: departmentList
        },
    ])
    .then((answers) => {
    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES ("${answers.title}",${answers.salary}, ${answers.department});`;
    db.query(sql, (err, res) => {
        if (err) {
          res.status(500).json({ error: err.message });
           return;
        }
        console.log(`${green}${answers.title} has been added to the database.💼`);
        promptUser();
        });
    });
    });
};

addEmployee = () => {
    const sql2 = `SELECT * FROM employee`;
    db.query(sql2, (err, res) => {
        employeeList = res.map (employees => ({
            name : `${employees.first_name} ${employees.last_name}`,
            value: employees.id
        }))
    
    const sql3 = `SELECT * FROM role`;
    db.query(sql3, (err, res) => {
         roleList = res.map(roles => ({
            name: roles.title,
            value: roles.id
        }));
    employeeList.push({ name: "None", value: "Null" }); // added a "none" option
        return inquirer
        .prompt([
            {
                type: 'input',
                name: 'first-name',
                message: "What is the new employee's first name?",
            },
            {
                type: 'input',
                name: 'last-name',
                message: "What is the new employee's last name?",
            },
            {
                type: 'list',
                name: 'role',
                message: "What is the new employee's role?",
                choices: roleList
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is the new employee's manager?",
                choices: employeeList
            }
        ])
        .then((answers) => {
            if(answers.manager === "Null"){
                answers.manager = null; // the manager will be NULL
            }
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ("${answers['first-name']}","${answers['last-name']}",${answers.role}, ${answers.manager});`
            db.query(sql, (err, res) => {
                if (err) {
                  res.status(500).json({ error: err.message });
                   return;
                }
                console.log(`${green}${answers['first-name']} ${answers['last-name']} has been added to the database.👔`);
                promptUser();
                });
            });
        });
    });
};

//functions to update data
updateEmployeeRole = () => {
    const sql2 = `SELECT * FROM employee`;
    db.query(sql2, (err, res) => {
        employeeList = res.map (employees => ({
            name : `${employees.first_name} ${employees.last_name}`,
            value: employees.id
        }))
    const sql3 = `SELECT * FROM role`;
    db.query(sql3, (err, res) => {
             roleList = res.map(roles => ({
                name: roles.title,
                value: roles.id
            }))
    roleList.push({ name: "Go to the main menu", value: "back" }); // added a "back" option
    return inquirer
    .prompt([
        {
            type:'list',
            name:'employee',
            message:`Which employee's role do you want to update?`,
            choices: employeeList,
        },
        {
            type:'list',
            name:'role',
            message:'Which role do you want to assign to the selected employee?',
            choices: roleList
        },
    ])
    .then((answers) => {
        if (answers.role === "back") {
            // check if user selected "back"
            roleList.pop();
            console.log("Changes were not saved!")
            promptUser();
            return;
        }
    const sql = `UPDATE employee
    SET role_id = ${answers.role}
    WHERE id = ${answers.employee} ;`;
    db.query(sql, (err, res) => {
        if (err) {
          res.status(500).json({ error: err.message });
           return;
        }
        console.log(`${yellow}Employee's role has been updated.🎊`);
        promptUser();
        });
    });
    });
});
};

updateEmployeeManager = () => {
    const sql2 = `SELECT * FROM employee`;
    db.query(sql2, (err, res) => {
        employeeList = res.map (employees => ({
            name : `${employees.first_name} ${employees.last_name}`,
            value: employees.id
        }))
        employeeList.push({ name: "Go Back", value: "back" }); // added a "back" option
    return inquirer
    .prompt([
        {
            type:'list',
            name:'employee',
            message:`Which employee's manager do you want to update?`,
            choices: employeeList
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who will be this employee's manager?",
            choices: employeeList
        },
    ])
    .then((answers) => {
        if (answers.manager === "back") {
            // check if user selected "back"
            employeeList.pop();
            console.log(`${red}Changes were not saved!❌`)
            promptUser();
            return;
        }
    const sql = `UPDATE employee
    SET manager_id = ${answers.manager}
    WHERE id = ${answers.employee} ;`;
    db.query(sql, (err, res) => {
        if (err) {
          res.status(500).json({ error: err.message });
           return;
        }
        console.log(`${yellow}Employee's manager has been updated.🎊`);
        promptUser();
        });
    });
    });
};

//Functions to delete data 
deleteData = () =>{
    inquirer
    .prompt([
        {
            type:'list',
            name:'delete',
            message:'What would you like to delete?',
            choices:['Employee','Role','Department','None']
        },
    ])
    .then((answers) => {
        switch(answers.delete){
            case 'Employee':
                deleteEmployee();
                break;
            case 'Role':
                deleteRole();
                break;
            case 'Department':
                deleteDepartment();
                break;
            case 'None':
                promptUser();
                break;
        };
    });
};

deleteEmployee = () => {
    const sql2 = `SELECT * FROM employee`;
    db.query(sql2, (err, res) => {
        employeeList = res.map (employees => ({
            name : `${employees.first_name} ${employees.last_name}`,
            value: employees.id
        }))
    
        employeeList.push({ name: "Go Back", value: "back" }); // added a "back" option
    inquirer
        .prompt({
                type: "list",
                name: "id",
                message: "Select the employee you want to delete:",
                choices: employeeList,
            })
            .then((answers) => {
                if (answers.id === "back") {
                    // check if user selected "back"
                    deleteData();
                    return;
                }
                const sql = `DELETE FROM employee 
                WHERE id =?`;
                db.query(sql, [answers.id], (req, res) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                         return;
                      }
                      employeeList.pop();
                      console.log(`${red}Employee with ID #${answers.id} has been deleted from the database.🗑️`);
                      promptUser();
                      });
            })
    })
};

deleteRole = () => {
    const sql2 = `SELECT * FROM role`;
    db.query(sql2, (err, res) => {
        roleList = res.map (roles => ({
            name : roles.title,
            value: roles.id
        }))
    
        roleList.push({ name: "Go Back", value: "back" }); // added a "back" option
    inquirer
        .prompt({
                type: "list",
                name: "id",
                message: "Select the role you want to delete:",
                choices: roleList,
            })
            .then((answers) => {
                if (answers.id === "back") {
                    // check if user selected "back"
                    deleteData();
                    return;
                }
                const sql = `DELETE FROM role 
                WHERE id =?`;
                db.query(sql, [answers.id], (req, res) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                         return;
                      }
                      roleList.pop();
                      console.log(`${red}Role with ID #${answers.id} has been deleted from the database.🗑️`);
                      promptUser();
                      });
            })
    })
};

deleteDepartment = () => {
    const sql2 = `SELECT * FROM department`;
    db.query(sql2, (err, res) => {
        departmentList = res.map (departments => ({
            name : departments.name,
            value: departments.id
        }))
    
        departmentList.push({ name: "Go Back", value: "back" }); // added a "back" option
    inquirer
        .prompt({
                type: "list",
                name: "id",
                message: "Select the department you want to delete:",
                choices: departmentList,
            })
            .then((answers) => {
                if (answers.id === "back") {
                    // check if user selected "back"
                    deleteData();
                    return;
                }
                const sql = `DELETE FROM department 
                WHERE id =?`;
                db.query(sql, [answers.id], (req, res) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                         return;
                      }
                      departmentList.pop();
                      console.log(`${red}Department with ID #${answers.id} has been deleted from the database.🗑️`);
                      promptUser();
                      });
            })
    })
};

// function to view the total utilized budget of a department
viewTotalBudget = () => {
    const sql2 = `SELECT * FROM department`;
    db.query(sql2, (err, res) => {
         departmentList = res.map(departments => ({
            name: departments.name,
            value: departments.id
        })) ;
    return inquirer
    .prompt([
        {
            type:'list',
            name:'department',
            message:'Which department do you want to view the total budget of?',
            choices: departmentList
        }
    ])
    .then((answers) => {
    const sql = `SELECT department.name AS department, SUM(role.salary) AS total_budget
    FROM department
    INNER JOIN role ON role.department_id = department.id
    INNER JOIN employee ON employee.role_id = role.id
    WHERE department.id = ?
    GROUP BY department.id;`;
    db.query(sql,[answers.department], (err, res) => {
        if (err) {
          res.status(500).json({ error: err.message });
           return;
        }
        const totalBudget = res[0]["total_budget"];
        if(totalBudget === undefined ){
            console.log(`${yellow}The total burget for employees in this department is $0.💵`);
        promptUser();
        }else{
            console.log(`${yellow}The total burget for employees in this department is $${totalBudget}.💵`);
            promptUser();
        }
        });
    });
    });
};

app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

// We call the function so the inquirer prompts show up as soon as the app is ran.
promptUser();