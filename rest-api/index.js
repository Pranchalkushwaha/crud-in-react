const express = require("express");
const bodyParser = require("body-parser");
// const app = express();
const mysql = require("mysql");
const req = require("express/lib/request");
const cors = require('cors');
// const express = require('express');
let app = express();
app.use(cors());
app.options('*', cors());
// const cors = require('cors');
// app.use(cors({
//     origin: 'https://localhost:3000',
// }));

// parse application/json
app.use(bodyParser.json());

// create databse connection
const conn = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "crud",
});

conn.connect((err) =>{
    if(err) throw err;
    console.log("MYSQL Connected");
});

// create a new record
app.post("/api/create", (req, res) => {
    let data = { name: req.body.name, location: req.body.location, employeeType: req.body.selectemployeeType, employeeRole: req.body.selectemployeeRole, country: req.body.country};
    let sql = "INSERT INTO users SET ?";
    let query = conn.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send(JSON.stringify({ status: 200, error: null, response: "New Record is Added successfully" }));
    });
});

// show all records
app.get("/api/view", (req, res) => {
	let sql = "SELECT * FROM users";
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: result }));
	});
});

// show a single record
app.get("/api/view/:id", (req, res) => {
	let sql = "SELECT * FROM users WHERE id=" + req.params.id;
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: result }));
	});
});

// update the Record
app.put("/api/update/", (req, res) => {
	let sql = "UPDATE users SET name='" + req.body.name + "', location='" + req.body.location + "', employeeType='" + req.body.selectemployeeType + "', employeeRole='" + req.body.selectemployeeRole + "', country='" + req.body.country + "' WHERE id=" + req.body.id;
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: "Record updated SuccessFully" }));
	});
});

// delete record
app.delete("/api/delete/:id", (req, res) => {
    let sql = "DELETE FROM users WHERE id=" + req.params.id + "";
    let query = conn.query(sql, (err, result) => {
        if(err) throw err;
        res.send(JSON.stringify({ status: 200, error: null, response: "Record deleted successfully"}));
    });
});

// show country
app.get("/api/country", (req, res) => {
	let sql = "SELECT * FROM country";
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: result }));
	});
});

app.listen(8000, () => {
    console.log("server started on port 8000..");
});