const bcrypt = require("bcryptjs")
const jwt  = require("jsonwebtoken")
const config =  require("config")
const  User = require("../models/user")
const  {check,validationResult}   =  require('express-validator/check')
const express =  require("express")
const router =  express.Router()
const auth   = require('../middleware/auth');


router.get('/',auth, async (req,res)=>{  
    try {
        const user =  await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        console.log(err)
     res.status(500).send("server error")
    }
});

router.post('/login',[
 check('email',"email is required").isEmail(),
 check('password',"password is required please").exists()
], async(req,res)=>{
    const errors =  validationResult(req)
    console.log(req.body)
    if(!errors.isEmpty()){
         return res.status(500).json({errors:errors.array()}) 
    }

    const {email,password}   = req.body || req.query
    console.log(email,password)
    try {
            let user  =  await User.findOne({'email':email})

            console.log(user)
            if(!user){
                return res.status(401).json({msg:"credentials are invalid"})
            }
            const isMatch =  await bcrypt.compare(password,user.password)
            if(!isMatch){
                 return res.status(500).json({mag:"Password is incorrect"})
            }
            const payload =  {
                 user:{
                      id:user.id
                 }
            }

            console.log("user",user)
          jwt.sign(payload,config.get('jwtSecret'),{expiresIn:360000},(err,token)=>{
                if(err){throw err}
                res.json({token})
          });  
    } catch (err) {
         console.log("error",err)
         res.status(500).send("Server error")
    }
});

module.exports  =  router;

