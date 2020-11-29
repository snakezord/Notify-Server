const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: {
        type: String,        
        trim: true,
        default: ''
    },
    description: {
        type: String,     
        trim: true,
        default: ''
    },
    background: {
        type: String,
        trim: true,
        default: '#fff'
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    } 
}, {
    timestamps: true
})

// schema.pre('save', async function (next) {
//     const task = this

//     //todo
//     //console.log('Before save task!')

//     next()
// })

const Task = mongoose.model('Task', schema)

module.exports = Task