const mongoose =  require("mongoose")
const Schema =   mongoose.Schema;

const  userSchema =  new Schema({
       email:{
            type:String,
            required:true
       },
       name:{
            type:String,
            required:true
       },
       password:{
            type:String,
            required:true
       },
       date:{
         type:Date,
         required:true,
         default: new Date().toUTCString()   
       }
})


const User =  mongoose.model('user',userSchema)

module.exports =  User;