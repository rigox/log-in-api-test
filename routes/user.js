const express = require("express");
const router =  express.Router();
const bcrypt   = require("bcryptjs")
const  jwt =  require("jsonwebtoken")
const config =  require("config")
const  {check,validationResult}   =   require("express-validator")
const User  =   require("../models/user")

router.get('/test',(req,res)=>{
       res.send("hello")
});

//@router POST api/users
//@desc  Registers  new users
//@access public

router.post('/register',[
     check('name','name is required').not().isEmpty(),
     check('email','it must be a valid email').isEmail(),
     check('password',"Password must have a length").isLength({min:6})
],async (req,res)=>{
  const errors  =  validationResult(req)
  if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()})
  }
   const {name,email,password} =  req.body || req.query
   try {
        //we are using the async pattern
        let user =  await User.findOne({email})
        if(user){
             return res.status(400).json({msg:"user already exists"})
        }
        newUser =  new User({
             name,
             email,
             password
        });

        const salt = await  bcrypt.genSalt(10);
    
        newUser.password  =  await bcrypt.hash(password,salt)
        await  newUser.save()
        const payload = {
             user:{
                  id: newUser.id
             }
        }
        jwt.sign(payload, config.get('jwtSecret'),{expiresIn:360000},(err,token)=>{
             if(err){throw err}
             res.json({token})
        })
   } catch (err) {
        console.log(err)
        res.status(500).send("server error")
   }


});


module.exports  =  router;