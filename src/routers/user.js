const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

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
            res.status(400).send({
                error: error.message
            })
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
            res.status(400).send({
                error: error.message
            })
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
            res.status(400).send({
                error: error.message
            })
        }
    })
    .delete('/users/me', auth, async (req, res) => {
        try {
            await req.user.remove()
            res.send(req.user)
        } catch (error) {
            res.status(500).send()
        }
    })


/* AVATAR IMAGE HANDLING */
const upload = multer({
    limits: {
        fileSize: 1048576
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(new Error('Please upload file of the following formats (.jpg .jpeg .png)'))

        cb(undefined, true)
    }
})

router
    // Avatar Upload
    .post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
        const buffer = await sharp(req.file.buffer).resize({
            width: 250,
            height: 250
        }).png().toBuffer()
        
        req.user.avatar = buffer
        await req.user.save()

        res.send()
    }, (error, req, res) => {
        res.status(400).send({
            error: error.message
        })
    })
    // Avatar Delete
    .delete('/users/me/avatar', auth, async (req, res) => {
        req.user.avatar = undefined
        await req.user.save()

        res.send()
    }, (error, req, res) => {
        res.status(400).send({
            error: error.message
        })
    })
    // Avatar Fetch by id
    .get('/users/:id/avatar', async (req, res) => {
        const _id = req.params.id
        try {
            const user = await User.findById(_id)

            if (!user || !user.avatar) throw new Error()

            res.set('Content-Type', 'image/png')
            res.send(user.avatar)
        } catch (error) {
            res.status(404).send()
        }
    })
module.exports = router