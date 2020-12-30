const express = require('express');
require('./db/mongoose');
var cors = require('cors')
const userRouter = require('./routers/user');
const avatarRouter = require('./routers/avatar');
const taskRouter = require('./routers/task');

const app = express()

//MIDDLEWAREs (allows to run code between req and res)
//Without Middleware: new req -> run route handler
//With Middleware: new req -> do something -> run route handler
app
    .use(express.json())
    .use(cors())
    .use(userRouter)
    .use(avatarRouter)
    .use(taskRouter)

module.exports = app