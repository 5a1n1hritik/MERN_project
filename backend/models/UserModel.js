const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxlength:[30,'Name cannot excead 30 charecters'],
        minlength:[5, 'Name should have more then 5 charecters']
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength:[6, 'Password should be gretor then 6 charecters'],
        select:false
    },
    avatar:{
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
    },
    role:{
        type:String,
        default:'user'
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
})



module.exports = mongoose.model('user',userSchema);

