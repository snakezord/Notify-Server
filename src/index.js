const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
//const jwt = require('jsonwebtoken');

const app = express()
const port = process.env.PORT || 3000

//MIDDLEWAREs (allows to run code between req and res)
//Without Middleware: new req -> run route handler
//With Middleware: new req -> do something -> run route handler 
app 
    .use(express.json())
    .use(userRouter)
    .use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

// const Task = require('./models/task');
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('5ef7a27b926cc0950b0b083d')
//     // await task.populate('user').execPopulate()
//     // console.log(task.user)

//     const user = await User.findById('5ef7a0ae909bd694a5e7e89f')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()