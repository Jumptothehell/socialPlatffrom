const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'public/img/');
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

let userinfo_table = 'userinfo';
let userpost_table = 'userpost';
let userlovedpost_table = 'userlovedpost';

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

    sql = "CREATE TABLE IF NOT EXISTS userpost (id INT AUTO_INCREMENT PRIMARY KEY, msg VARCHAR(1000), username VARCHAR(200), time TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
    result = await queryDB(sql);

    sql = "CREATE TABLE IF NOT EXISTS userlovedpost (id INT AUTO_INCREMENT PRIMARY KEY, userid INT, postid INT, loved BOOLEAN)"
    result = await queryDB(sql);

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
    console.log(result);
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
app.post('/checkLogin',async (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    let sql = `SELECT username, password, img FROM ${userinfo_table}`;

    let result = await queryDB(sql);
    console.log(result);
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

const updateImg = async (username, filen) => {
    let sql = `UPDATE ${userinfo_table} SET img = '${filen}' WHERE username = '${username}'`;
    let result = await queryDB(sql);
    console.log('img update!');
}

app.post('/profilepic', (req,res) => {
    let upload = multer({storage: storage, fileFilter: imageFilter}).single('avatar');
    upload(req, res, (err) => {
        if(req.fileValidationError){
            return res.send(req.fileValidationError);
        }
        else if (!req.file){
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError){
            return res.send(err);
        }
        else if (err){
            return res.send(err);
        }
        updateImg (req.cookies.username, req.file.filename);
        res.cookie("img", req.file.filename);
        return res.redirect('feed.html');
    })
})

// app.post('/lovedPost', async (req, res) => { 
//     // let sql = `SELECT id, username FROM ${userinfo_table}`;
//     // let result = await queryDB(sql);

//     // let postsql = `SELECT id FROM ${userinfo_table}`;
//     // let postresult = await queryDB(sql);
//     // for (let i = 0; i <= result.length; i++)
//     // {
//     //     if(result[i].username == req.cookies.username){
//     //         let sql = `SELECT id, username FROM ${userinfo_table}`;
//     //         let result = await queryDB(sql);
//     //     }
//     // }
// })
app.post('/seeprofile' , async (req, res) => {
    return res.redirect('profile.html')  
})
 
app.get('/readPost', async (req,res) => {
    let sql = `SELECT id, msg, username, time FROM ${userpost_table}`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    res.json(result);
})

app.post('/writePost',async (req,res) => {
    let sql = `INSERT INTO userpost (msg, username, time) VALUES ("${req.body.msg}", "${req.cookies.username}", NOW())`;
    let result = await queryDB(sql);
    let sqlselect = `SELECT id, msg, username, time FROM ${userpost_table}`;
    let resultselect = await queryDB(sqlselect);
    resultselect = Object.assign({}, resultselect);
    res.json(resultselect);
})

app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/login.html`); // แก้เป็น register
});