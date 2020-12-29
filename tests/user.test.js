const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user');
const {
    userOneId,
    userOne,
    cleanDB
} = require('./fixtures/db');

beforeEach(cleanDB);

test('should signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Roman',
            email: 'dx.killer@example.com',
            password: 'wasd123'
        }).expect(201)
    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Roman',
            email: 'dx.killer@example.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('wasd123')
});

test('should login existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)
    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
});

test('should not login nonexistent user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'wrong password',
        })
        .expect(400)
});

test('should get profile user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
});

test('should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
});

test('should delete account for user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
});

test('should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
});

test('should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
});

test('should update valid user fields', async () => {
    const newUser = {
        name: 'Roman'        
    }
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(newUser)
        .expect(200)
    const user = await User.findById(userOneId)
    expect({        
        name: user.name
    }).toEqual(newUser)
});


test('should not update invalid user fields', async () => {
    const newUser = {
        name: 'Roman',
        age: 24,
        dick: 17
    }
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(newUser)
        .expect(400)
});