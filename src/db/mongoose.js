const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017'
const dbName = '/task-manager'

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}

mongoose.connect(url + dbName, options)