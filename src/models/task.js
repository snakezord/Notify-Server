const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
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