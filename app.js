const express = require('express');
const app = express();

const path = require('path');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user');

app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname , 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());



app.get('/' , function(req, res){
    res.render("index")
})

app.listen(3000);