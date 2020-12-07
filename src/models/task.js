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
        default: false,        
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    isRemoved: {
        type: Boolean,
        default: false,    
    },
    expireAt: {
            type: Date,
            default: null,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    } 
}, {
    timestamps: true
})

schema.index({
        expireAt: 1
    },
    {
        expireAfterSeconds: 0, 
    }    
)



// schema.pre('save', async function (next) {
//     const task = this

//     //todo
//     //console.log('Before save task!')

//     next()
// })

const Task = mongoose.model('Task', schema)

module.exports = Task