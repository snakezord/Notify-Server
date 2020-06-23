const mongoose = require('mongoose');
const {
    isEmail
} = require('validator').default;

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(v) {
            if (!isEmail(v)) throw new Error('Email is invalid')
        }
    },
    age: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(v) {
            if (v.toLowerCase() === 'password') throw new Error('Password can\'t be equal to "password"')
        }
    }
})

module.exports = User