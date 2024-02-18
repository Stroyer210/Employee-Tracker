// We inport all the dependencies that we need.
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Declaring the PORT variable
const PORT = process.env.PORT || 3001;

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

console.log(`
 ------------------
| EMPLOYEE TRACKER |
 ------------------`);
function promptUser(){
    inquirer
    .prompt([
        {
            type:'list',
            name:'view-options',
            message:'What would you like to do?',
            choices:['View All Employees','Add Employee','Update Employee Role','View All Roles','Add Role','View All Departments','Add Department']

        },
    ])
    .then((answers) => {
        switch(answers["view-options"]){
            case 'View All Employees':
                //what to run here
                console.log("hello");
                promptUser();
            break;
            case 'Add Employee':
                //what to run here
            break;
            case 'Update Employee Role':
                //what to run here
            break;
            case 'View All Roles':
                //what to run here
            break;
            case 'Add Role':
                //what to run here
            break;
            case 'View All Departments':
                //what to run here
            break;
            case 'Add Department':
                //what to run here
            break;
        };
    });
};

// app.post()

app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

// We call the function so the inquirer prompts show up as soon as the app is ran.
promptUser();