const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = 'loremIpsum';
// Validation
const {registerValidation,loginValidation} = require('../validation');

router.post('/register', async (req, res)=>{
    const {name, email, password,date} = req.body; 
    // let validate the data before the send
    const {error} = registerValidation(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    // cheking if the user exist in the database
    const  emailExist = await User.findOne({email: email});
    if(emailExist){
        return res.status(400).send('Email already exists!!')
    }

    // Hash password 
    const salt  = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);

    // create new user
    const user = new User({
        name: name,
        email: email,
        password: hashPassword,
        date: (date)? date : null
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser)
    }catch(err){
        res.status(400).send(err);
    }
});

// Login
router.post('/login' , async (req,res) => {
    const {email, password} = req.body; 
    //let validate the user
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

     // cheking if the user exist in the database
    const user = await User.findOne({email:email});
    const {_id,password:dbPassword} = user;
    if(!user) return res.status(400).send('Email is not found');

    // Passwrod check
    const validPass = await bcrypt.compare(password, dbPassword);
    if(!validPass) return res.status(400).send('Invalid password');

    // create and assign a token
    const token = jwt.sign({_id:_id},secretKey);
    res.header('auth-token', token).send(token);
    
});


module.exports = router;