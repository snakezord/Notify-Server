const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task');
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
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(v) {
            if (!isEmail(v)) throw new Error('Email is invalid')
        }
    },    
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(v) {
            if (v.toLowerCase() === 'password') throw new Error('Password can\'t be equal to "password"')
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    },
    googlePicture: {
        type: String
    }
}, {
    timestamps: true
})

schema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'user'
})

schema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })

    if (!user) throw new Error('Unable to login. Checkout your email or password.')

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) throw new Error('Unable to login. Checkout your email or password.')

    return user
}

schema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.__v
    delete userObject.avatar

    return userObject
}

schema.methods.addDefaultNote = async function () {
    const user = this
    
    const task = new Task({
        title: 'Hello 👋',
        description: `-This is my Notes App 📔
                      -You can add different notes
                      -You can Drag and Drop notes
                      -You can edit notes by clicking on them 🖱️
                      -And more...
                      -Please try it out 😃`,
        background: '#FCF475',
        user: user._id
    })

    await task.save()    
}

// Generate user jsonWebToken
schema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.JWT_SECRET, { expiresIn: '24h'})
    
    user.tokens = [...user.tokens, {
        token
    }]
    await user.save()

    return token
}

//Hash the plain text password before saving
schema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete user tasks when user is removed
schema.pre('remove', async function (next) {    
    const user = this

    await Task.deleteMany({
        user: user._id
    })
    
    next()
})

const User = mongoose.model('User', schema)


module.exports = User