const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const {
    sendWelcomeEmail,
    sendByeEmail
} = require('../emails/account');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client("453554487997-jact340aibie5td0co3tdesi5cku6dd1.apps.googleusercontent.com");

const router = new express.Router()

/* USER ENDPOINTS */
router
    .post('/users', async (req, res) => {
        const user = new User(req.body)
        try {
            sendWelcomeEmail(user)
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
    .post('/users/google/login', async (req, res) => {
        try {
            const { tokenId } = req.body
            const response = await googleClient.verifyIdToken({idToken: tokenId, audience: "453554487997-jact340aibie5td0co3tdesi5cku6dd1.apps.googleusercontent.com"})                        
            const { email_verified, name, email, picture } = response.payload

            if(!email_verified) return res.status(400).send({
                error: 'Unable to sign in. Google email unverified!'
            }) 

            const user = await User.findOne({ email })            

            if (!user) {                
                const password = email + process.env.JWT_SECRET
                const user = new User({
                    name, 
                    email, 
                    password, 
                    googlePicture: picture
                })

                await user.save()
                const token = await user.generateAuthToken()
                
                sendWelcomeEmail(user)
                await user.addDefaultNote()

                res.status(201).send({
                    user,
                    token
                })
            }else {                             
                const token = await user.generateAuthToken()
                res.send({
                    user,
                    token
                })
            }
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
        const body = req.body

        const updates = Object.keys(body)
        const allowedUpdates = ['name', 'email', 'password']
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
        const user = req.user
        try {
            sendByeEmail(user)            
            await user.remove()
            res.send(user)
        } catch (error) {
            res.status(500).send()
        }
    })
module.exports = router