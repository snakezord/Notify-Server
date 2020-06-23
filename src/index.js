const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express()
const port = process.env.PORT || 3000

//MIDDLEWAREs (allows to enforce change without needing to look at multiple places)
app
    .use(express.json())
    .use(userRouter)
    .use(taskRouter)

    .listen(port, () => {
        console.log('Server is up on port ' + port)
    })