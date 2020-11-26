const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: 'wasd123',
    tokens: [{
        token: jwt.sign({
            _id: userOneId
        }, process.env.JWT_SECRET)
    }]
}

const userTwo = {
    _id: userTwoId,
    name: 'Roman',
    email: 'roman@example.com',
    password: 'wasd123',
    tokens: [{
        token: jwt.sign({
            _id: userTwoId
        }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    title: 'First',
    description: 'First',
    completed: false,
    user: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Second',
    description: 'Second',
    completed: true,
    user: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Third',
    description: 'Third',
    completed: true,
    user: userTwoId
}

const cleanDB = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    cleanDB
}