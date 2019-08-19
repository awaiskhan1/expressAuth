const router = require('express').Router();
const verify = require('./verifytoken');
const User = require('../model/User');
const secretKey = 'loremIpsum';

router.get('/',verify,async (req,res)=> {
    const {_id:id} = req.user;
    let user = await User.findOne({_id: id});
    if(!user) return res.status(400).send(`can't  find the user`);
    res.send(user);
})

module.exports = router;