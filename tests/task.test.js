const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    cleanDB
} = require('./fixtures/db');

beforeEach(cleanDB)

test('should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Some task'
        }).expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    // Assertions about the response
    expect(task.completed).toEqual(false);
})

test('should fetch user tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('should not delete task of other user', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)

    const task = Task.findById(taskThree._id)
    expect(task).not.toBeNull();
    
});