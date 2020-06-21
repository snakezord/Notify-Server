const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017'
const dbName = '/task-manager-api'

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

mongoose.connect(url + dbName, options)


//Will use later
/* const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,        
        default: false
    }
})
 */