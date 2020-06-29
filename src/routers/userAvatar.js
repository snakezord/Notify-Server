const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

const router = new express.Router()

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
    .delete('/users/me/avatar', auth, async (req, res) => {
        req.user.avatar = undefined
        await req.user.save()

        res.send()
    }, (error, req, res) => {
        res.status(400).send({
            error: error.message
        })
    })
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