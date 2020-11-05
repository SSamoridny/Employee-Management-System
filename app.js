const mysql = require('mysql');
const inquirer = require('inquirer');
const express = require('express')
const console = require('console.table')

const connection = mysql.createConnection({
    host: 'localhost',
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "Maiyapapaya1!",
    database: "employeeTracker"
});

connection.connect(function (err) {
    console.log('connected')
    if (err) throw err;
});