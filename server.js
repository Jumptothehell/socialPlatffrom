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

let userinfo_table = "userinfo";

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
const updateImg = async (username, filen) => {
    let sql = `UPDATE ${userinfo_table} SET img = '${filen}' WHERE username = '${username}'`;
    // let sql = `UPDATE ${userinfo_table} SET img = '${req.file.filename}' WHERE username = '${req.cookies.username}'`;
    let result = await queryDB(sql);
    console.log('img update!');
}
app.post('/checkLogin',async (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    let sql = `SELECT username, password, img FROM ${userinfo_table}`;
    let result = await queryDB(sql);//--> object
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
    console.log(`Server running at   http://${hostname}:${port}/register.html`); //แก้เป็น register.html
});