const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const avatarRouter = require('./routers/avatar');
const taskRouter = require('./routers/task');

const app = express()
const port = process.env.PORT

//MIDDLEWAREs (allows to run code between req and res)
//Without Middleware: new req -> run route handler
//With Middleware: new req -> do something -> run route handler
app
    .use(express.json())
    .use(userRouter)
    .use(avatarRouter)
    .use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})