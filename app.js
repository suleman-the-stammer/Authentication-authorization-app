const express = require('express');
const app = express();

const path = require('path');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user');
const { getMaxListeners } = require('events');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname , 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());



app.get('/' , function(req, res){
    res.render("index")
})

app.get('/login' , function(req ,res){
    res.render("login");
})

app.post('/login' , async (req ,res)=>{
    let user = await userModel.findOne({email: req.body.email});

    if(!user) return res.send("Something Went Wrong");

    bcrypt.compare(req.body.password , user.password , function( err , result){
        if(result){
            let token = jwt.sign({email: user.email} , "secret-key");
            res.cookie("token" , token);
             res.send("You Can Login");
        } 
        else res.send("Please Try Again");
    })
})

app.get('/logout' , function(req, res){
    res.cookie("token" , "");
    res.redirect('/');
})

app.post('/create' , async (req , res) => {
    let {username ,email , password ,age } = req.body;
  
    bcrypt.genSalt(10 , (err , salt) => {
        bcrypt.hash(password , salt , async function(err , hash){
            let newUser = await userModel.create({
                username,
                email,
                password: hash,
                age
               })
               
               let token = jwt.sign({email} , "secret-key");
               res.cookie(token);
               res.send(newUser);
        })
    })

    
})

app.listen(3000);