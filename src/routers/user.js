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
            res.status(400).send()
        }
    })
    .get('/users/me', auth, async (req, res) => {
        res.send(req.user)
    })
    .get('/users/:id', async (req, res) => {
        const _id = req.params.id

        try {
            const user = await User.findById(_id)
            if (!user) return res.status(404).send()
            res.send(user)
        } catch (error) {
            res.status(500).send()
        }
    })
    .patch('/users/:id', async (req, res) => {
        const _id = req.params.id
        const body = req.body

        const updates = Object.keys(body)
        const allowedUpdates = ['name', 'email', 'age', 'password']
        const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidUpdate) return res.status(400).send({
            error: 'Invalid update!'
        })

        try {
            const user = await User.findById(_id)

            if (!user) return res.status(404).send()

            updates.forEach((update) => user[update] = body[update])
            await user.save()

            res.send(user)
        } catch (error) {
            res.status(400).send(error)
        }
    })
    .delete('/users/:id', async (req, res) => {
        const _id = req.params.id

        try {
            const deleted = await User.findByIdAndDelete(_id)
            if (!deleted) return res.status(404).send()
            res.send(deleted)
        } catch (error) {
            res.status(500).send()
        }
    })
module.exports = router