const express = require('express');
const User = require('../models/user');

const router = new express.Router()

/* USER ENDPOINTS */
router
    .post('/users', async (req, res) => {
        const user = new User(req.body)
        try {
            await user.save()
            res.status(201).send(user)
        } catch (error) {
            res.status(400).send(error)
        }
    })
    .get('/users', async (req, res) => {
        try {
            const users = await User.find({})
            res.send(users)
        } catch (error) {
            res.status(500).send()
        }
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

            // DOESN'T TRIGGER THE SAVE MIDDLEWARE!
            /* const user = await User.findByIdAndUpdate(_id, body, {
                new: true,
                runValidators: true
            }) */
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