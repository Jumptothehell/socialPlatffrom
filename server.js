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
    database: "userdb"
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
app.post('/checkLogin',async (req,res) => {
    let username = req.body.username;
    console.log(username);
    let password = req.body.password;
    console.log(password);

    res.cookie("username", username);
    return res.redirect('feed.html');
    // let sql = `SELECT username, password, img FROM ${userinfo_table}`;
    // let result = await queryDB(sql);//--> object
    // for(let i = 0; i < result.length; i++)
    // {
    //     if(result[i].username == username && result[i].password == password){
    //         res.cookie("username", username);
    //         res.cookie("img", result[i].img);
    //         return res.redirect('feed.html');
    //     }
    // }
    // return res.redirect('login.html?error=1')
})
app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/login.html`); //แก้เป็น register.html
});