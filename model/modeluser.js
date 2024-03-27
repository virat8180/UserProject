const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 30,
        minlength: 10
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "please give correct email"]
    },
    password: {
        type: String,
        required: true,
        maxlength: 12,
        minlength: 8,
        select: false
    },
    passwordconfirm: {
        type: String,
        required: true,
        maxlength: 12,
        minlength: 8,
        select: false

    },
    phone: {
        type: String,
        unique: true,
        maxlength: [10, "Invalid phonenumber"]


    },
    bio: {
        type: String,
        maxlength: [100, "word limit is 100"]
    },
    avatar: {
        publicid: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        enum: ['admin', 'normal'],
        default: 'normal'
    },


    view: {
        type: String,
        enum: ["public", "private"]

    }


}, { timestamps: true })

userschema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)

    // Delete passwordConfirm field
    this.passwordconfirm = undefined;
    next()

})

//JWT token
userschema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRETKEY, { expiresIn: process.env.JWT_EXPIRES_IN })
}

//comparepassword
userschema.methods.comparepassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password)
}

module.exports = mongoose.model('user', userschema)