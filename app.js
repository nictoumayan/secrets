const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewURLParser:true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});


const User = new mongoose.model("User", userSchema);


//---------------------gets------------------------------

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

//------------------------posts---------------------------


app.post("/register", function(req,res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
  if(err){
    console.log(err);
  }else{
    res.render("secrets");
    }
  });
});

app.post("/login", function(req,res){
  const userName = req.body.username;
  const password = req.body.password;
  User.findOne({email:userName}, function(err, foundUser){
    if(err){
      res.render("error");
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }else{
          res.render("error");
        }
      }else{
        res.render("error");
      }
    }
  })
});

app.listen(3000, function(){
  console.log("server listening on port 3000");
});
