const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router()

/* USER ENDPOINTS */
router
    .post('/users', async (req, res) => {
        const user = new User(req.body)
        try {
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({
                user,
                token
            })
        } catch (error) {
            res.status(400).send(error)
        }
    })
    .post('/users/login', async (req, res) => {
        try {            
            const user = await User.findByCredentials(req.body.email, req.body.password)            
            const token = await user.generateAuthToken()
            res.send({
                user,
                token
            })
        } catch (error) {
            error = JSON.stringify(error.message, Object.getOwnPropertyNames(error))
            res.status(400).send(error)
        }
    })
    .post('/users/logout', auth, async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
            await req.user.save()

            res.send()
        } catch (error) {
            res.status(500).send()
        }
    })
    .post('/users/logoutAll', auth, async (req, res) => {
        try {
            req.user.tokens = []
            await req.user.save()

            res.send()
        } catch (error) {
            res.status(500).send()
        }
    })
    .get('/users/me', auth, async (req, res) => {
        res.send(req.user)
    })
    .patch('/users/me', auth, async (req, res) => {
        const user = req.user
        const _id = user.id
        const body = req.body

        const updates = Object.keys(body)
        const allowedUpdates = ['name', 'email', 'age', 'password']
        const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidUpdate) return res.status(400).send({
            error: 'Invalid update!'
        })

        try {
            updates.forEach((update) => user[update] = body[update])
            await user.save()

            res.send(user)
        } catch (error) {
            res.status(400).send(error)
        }
    })
    .delete('/users/me', auth, async (req, res) => {
        const _id = req.user._id

        try {            
            await req.user.remove()
            res.send(req.user)
        } catch (error) {
            res.status(500).send()
        }
    })
module.exports = router