const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


let userinfo_table = 'userinfo';
let userpost_table = 'userpost';

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "marrode9202",
    database: "mydb"
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}
app.post('/regisDB',async (req, res) => {
    let sql = "CREATE TABLE IF NOT EXISTS userinfo (id INT AUTO_INCREMENT PRIMARY KEY, firstname VARCHAR(200), lastname VARCHAR(200), birthday DATE, email VARCHAR(200), username VARCHAR(200), password VARCHAR(20), img VARCHAR(200))"
    let result = await queryDB(sql);
    sql = `INSERT INTO userinfo (firstname, lastname, birthday, email, username, password, img) VALUES ("${req.body.firstname}", "${req.body.lastname}", "${req.body.birthday}", "${req.body.email}", "${req.body.username}", "${req.body.password}", "avatar.png")`;
    result = await queryDB(sql);
    console.log("New record created successfully one");

    res.cookie("username",req.body.username);
    return res.redirect('login.html');
})

app.post('/checkLogin',async (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    let sql = `SELECT username, password, img FROM ${userinfo_table}`;
    let result = await queryDB(sql);
    for(let i = 0; i < result.length; i++)
    {
        if(result[i].username == username && result[i].password == password){
            res.cookie("username", username);
            res.cookie("img", result[i].img);
            return res.redirect('feed.html');
        }
    }
    return res.redirect('login.html?error=1')    
})

app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/register.html`); // แก้เป็น register
});