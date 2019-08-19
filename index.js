const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const mongoDB = 'mongodb://127.0.0.1:27017/expresspointdb';
mongoose.connect(mongoDB,{ useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// MiddleWares 
// support parsing of application/json type post data
// app.use(express.json());
app.use(bodyParser.json());
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended:true}));


// routers  
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

// Route Middlewares
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);



// server listining 
app.listen(3000, ()=> console.log('express server  is running'));