import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongoDB/connect.js';
import postRoutes from './routes/postRoutes.js'
import dalleRoutes from './routes/dalleRoutes.js'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import jwt from 'jsonwebtoken';

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({limit: '50mb'}))
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/', async (req, res) => {
    res.send('Hello from AI Imagecrafter!');
})


const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);
          mongoose.connect(
    "mongodb+srv://tchouminzikeubd:ZNdItc3QR0Nfmj38@cluster0.8oyf9cn.mongodb.net/",//mongoose connect url
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
        app.listen(8080, () => console.log('Server started on port http://localhost:8080'))
    } catch (error) {
        console.log(error)
    }

};
startServer()




//new 

/*const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy= require('passport-local');

const jwt = require('jsonwebtoken');
*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const port = 8080;

//schema

const messageSchema = mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recepientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messageType:{
        type: String,
        enum: ['text', 'image']
    },
    message:String,
    imageUrl:String,
    timeStamp:{
        type: Date,
        default: Date.now,
    }
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    friendRequests:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    sendFriendRequests:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
})


const User = mongoose.model('User',userSchema);

module.exports = User;



const startServer2 = async () => {
    try {
       mongoose.connect(
    "mongodb+srv://tchouminzikeubd:ZNdItc3QR0Nfmj38@cluster0.8oyf9cn.mongodb.net/",//mongoose connect url
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Not connected to MongoDB");
})
        app.listen(8080, () => console.log('Server2 started on port http://localhost:8080'))
    } catch (error) {
        console.log(error)
    }

};
//startServer2()
app.get('/',()=>{
    return "Hello, world!";
})

/*app.listen(port,()=>{
    console.log("Server is running on port http://localhost:"+port);
});*/

//const User = require("./models/user");
//const Message = require("./models/message");


//endpoints for registration of the user

app.post('/register',(req,res)=>{
    const {name, email, password, image}  =req.body;

    //create a new user object
    const newUser = new User({name, email, password, image})

    //save the user object
    newUser.save()
    .then(() => {
        res.status(200).json({message: "User Registered successfully"})
    })
    .catch((err) => {
        console.log("Error registering user: " + err);
        res.status(500).json({message: "Error registering the user!"});
    })
})

const createToken = (userId)=>{
    const payload = {
        userId: userId
    }

    //generate token
    const token = jwt.sign(payload, "ZNdItc3QR0Nfmj38");

    return token;
}

//endpoints for logging a user

app.post('/login', (req,res)=>{
    const {email, password} = req.body;

    //check if the user email and password are provided
    if(!email | !password) return res.status(404).json({message:"Email and password are not provided"});
    console.log(email)
    //check if the user is in db
    User.findOne({email})
    .then((user)=>{
        if(!user) return res.status(404).json({message:"User not found"});

        //compare the provided password
        if (user.password !== password) return res.status(404).json({message:"Password mismatch"});

        //create the user token
        const token = createToken(user.id)
        res.status(200).json({token: token});
    }).catch((err)=>{
        console.log("Error in finding the User", err);
        res.status(500).json({message:"Email not found"});
    })
})


//list of users except thz currently logged in users
app.get('/users/:userId',(req,res)=>{
    const loggedInUser = req.params.userId;
    
    User.find({_id:{$ne:loggedInUser}})
    .then((users)=>{
res.status(200).json(users);
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({message: "Error while getting users"})
    });
})


//endpoints for friend request to user

app.post("/friend-request", async(req,res)=>{
    const {currentUserId, selectedUserId } = req.body;

    try {
        //update recepient's friendRequestArray
        await User.findByIdAndUpdate(selectedUserId ,{
            $push: {friendRequests: currentUserId},
        })

        //update sender's friendRequestArray
        await User.findByIdAndUpdate(currentUserId,{
            $push: {sendFriendRequests: selectedUserId },
        }) 

        res.sendStatus(200);

    } catch (error) {
        console.log(error);
    }
})


//endpoint to show the friend requests of a user 

app.get("/friend-request/:userId", async (req, res) => {
    try {
        const {userId} = req.params;

        //fetch the friend request
        
        const user= await User.findById(userId).populate("friendRequests", "name email image").lean();
        const friendRequests = user.friendRequests

        res.json(friendRequests);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error fetching friendRequests"})
        
    }
});


//endpoint to accept a friend-request of a particular person
app.post("/friend-request/accept", async (req, res) => {
    try {
      const { senderId, recepientId } = req.body;
  
      //retrieve the documents of sender and the recipient
      const sender = await User.findById(senderId);
      const recepient = await User.findById(recepientId);
  
      sender.friends.push(recepientId);
      recepient.friends.push(senderId);
  
      recepient.friendRequests = recepient.friendRequests.filter(
        (request) => request.toString() !== senderId.toString()
      );
  
      sender.sendFriendRequests = sender.sendFriendRequests.filter(
        (request) => request.toString() !== recepientId.toString
      );
  
      await sender.save();
      await recepient.save();
  
      res.status(200).json({ message: "Friend Request accepted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  //endpoint to access all the friends of the logged in user!
  app.get("/accepted-friends/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate(
        "friends",
        "name email image"
      );
      const acceptedFriends = user.friends;
      res.json(acceptedFriends);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  const multer = require("multer");
  
  // Configure multer for handling file uploads
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "files/"); // Specify the desired destination folder
    },
    filename: function (req, file, cb) {
      // Generate a unique filename for the uploaded file
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
  //endpoint to post Messages and store it in the backend
  app.post("/messages", upload.single("imageFile"), async (req, res) => {
    try {
      const { senderId, recepientId, messageType, messageText } = req.body;
  
      const newMessage = new Message({
        senderId,
        recepientId,
        messageType,
        message: messageText,
        timestamp: new Date(),
        imageUrl: messageType === "image" ? req.file.path : null,
      });
  
      await newMessage.save();
      res.status(200).json({ message: "Message sent Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  ///endpoint to get the userDetails to design the chat Room header
  app.get("/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
  
      //fetch the user data from the user ID
      const recepientId = await User.findById(userId);
  
      res.json(recepientId);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  //endpoint to fetch the messages between two users in the chatRoom
  app.get("/messages/:senderId/:recepientId", async (req, res) => {
    try {
      const { senderId, recepientId } = req.params;
  
      const messages = await Message.find({
        $or: [
          { senderId: senderId, recepientId: recepientId },
          { senderId: recepientId, recepientId: senderId },
        ],
      }).populate("senderId", "_id name");
  
      res.json(messages);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  //endpoint to delete the messages!
  app.post("/deleteMessages", async (req, res) => {
    try {
      const { messages } = req.body;
  
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ message: "invalid req body!" });
      }
  
      await Message.deleteMany({ _id: { $in: messages } });
  
      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server" });
    }
  });
  
  
  
  app.get("/friend-requests/sent/:userId",async(req,res) => {
    try{
      const {userId} = req.params;
      const user = await User.findById(userId).populate("sendFriendRequests","name email image").lean();
  
      const sendFriendRequests = user.sendFriendRequests;
  
      res.json(sendFriendRequests);
    } catch(error){
      console.log("error",error);
      res.status(500).json({ error: "Internal Server" });
    }
  })
  
  app.get("/friends/:userId",(req,res) => {
    try{
      const {userId} = req.params;
  
      User.findById(userId).populate("friends").then((user) => {
        if(!user){
          return res.status(404).json({message: "User not found"})
        }
  
        const friendIds = user.friends.map((friend) => friend._id);
  
        res.status(200).json(friendIds);
      })
    } catch(error){
      console.log("error",error);
      res.status(500).json({message:"internal server error"})
    }
  })
