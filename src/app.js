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
    app.get("*", (req, res) => {
      let protected = ['transformed.js', 'main.css', 'favicon.ico']

      let path = req.params['0'].substring(1)
      
      if (protected.includes(path)) {
        // Return the actual file
        res.sendFile(`${__dirname}/build/${path}`);
      } else {
        // Otherwise, redirect to /build/index.html
        res.sendFile(`${__dirname}/build/index.html`);
      }
  });

module.exports = app