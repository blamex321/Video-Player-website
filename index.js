const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/VidDb");

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
  },
  image:{
    type:String,
  },
},{timestamps:true});

const User = mongoose.model("User",userSchema);

const vidSchema = new mongoose.Schema({
  vidName:{
    type:String,
    required:true,
    unique:true
  },
  vidThumb:{
    type:String,
    required:true,
    unique:true
  },
  vidLink:{
    type:String,
    required:true,
    unique:true
  },
  likes:{
    type:Number,
    default:0
  },
  views:{
    type:Number,
    default:0
  },
});

const Vids = mongoose.model("Vid",vidSchema);

app.get("/",function(req,res){
  // Vids.find({},function(err,vids){
  //   res.render("index",{
  //     videos:vids
  //   });
  // });

  Vids.find().then(function(vids,err){
      res.render("index",{
        videos:vids
      });
  });
});

app.get("/vids/:vidId",function(req,res){
  const videoID = req.params.vidId;
  Vids.findOne({_id:videoID}).then(function(vid,err){
    res.send(vid.vidLink);
  });
});

app.listen(3000,function(){
  console.log("Server Started");
});
