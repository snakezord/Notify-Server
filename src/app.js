const express = require('express');
require('./db/mongoose');
var CronJob = require('cron').CronJob;
const userRouter = require('./routers/user');
const avatarRouter = require('./routers/avatar');
const taskRouter = require('./routers/task');

const Task = require('./models/task');

const app = express()

//MIDDLEWAREs (allows to run code between req and res)
//Without Middleware: new req -> run route handler
//With Middleware: new req -> do something -> run route handler
app
    .use(express.json())
    .use(userRouter)
    .use(avatarRouter)
    .use(taskRouter)

var job = new CronJob('* * * * *', async function() {
  await Task.deleteMany({
      isRemoved: true
    })
  await Task.deleteMany({
      completed: true
    })
}, null, true, 'Europe/Lisbon');

job.start();

module.exports = app