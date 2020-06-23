const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {
    isEmail
} = require('validator').default;

const schema = new mongoose.Schema({
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

//MIDDLEWAREs (allows to enforce change without needing to look at multiple places)
schema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', schema)


module.exports = User