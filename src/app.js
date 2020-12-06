const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('./db/mongoose');
const userRouter = require('./routers/user');
const avatarRouter = require('./routers/avatar');
const taskRouter = require('./routers/task');

const app = express()

//MIDDLEWAREs (allows to run code between req and res)
//Without Middleware: new req -> run route handler
//With Middleware: new req -> do something -> run route handler
app
    .use('/', createProxyMiddleware({ target: 'https://roman-task-app.herokuapp.com', changeOrigin: true }))
    .use(express.json())
    .use(userRouter)
    .use(avatarRouter)
    .use(taskRouter)

module.exports = app