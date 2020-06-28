const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router()

/* TASK ENDPOINTS */
router
    .post('/tasks', auth, async (req, res) => {
        //const task = new Task(req.body)
        const task = new Task({
            ...req.body,
            user: req.user._id
        })
        try {
            await task.save()
            res.status(201).send(task)
        } catch (error) {
            res.status(400).send(error)
        }
    })
    .get('/tasks', auth, async (req, res) => {
        const user = req.user
        const query = req.query
        const match = {}
        const sort = {}

        if (query.completed) match.completed = query.completed === 'true'

        if (query.sortBy) {
            const parts = query.sortBy.split(':')
            const key = parts[0]
            const value = parts[1]
            sort[key] = value === 'asc' ? 1 : value === 'desc' ? -1 : 0
        }
        
        try {            
            await user.populate({
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(query.limit),
                    skip: parseInt(query.skip),                    
                    sort
                }
            }).execPopulate()
            res.send(user.tasks)
        } catch (error) {
            res.status(500).send()
        }
    })
    .get('/tasks/:id', auth, async (req, res) => {
        const task_id = req.params.id
        const user_id = req.user._id
        try {
            const task = await Task.findOne({
                _id: task_id,
                user: user_id
            })
            if (!task) return res.status(404).send()

            res.send(task)
        } catch (error) {
            res.status(500).send()
        }
    })
    .patch('/tasks/:id', auth, async (req, res) => {
        const _id = req.params.id
        const body = req.body
        const user = req.user

        const updates = Object.keys(body)
        const allowedUpdates = ['description', 'completed']
        const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidUpdate) return res.status(400).send({
            error: 'Invalid update!'
        })

        try {
            const task = await Task.findOne({
                _id,
                user: user._id
            })            
            
            if (!task) return res.status(404).send()

            updates.forEach((update) => task[update] = body[update])
            await task.save()

            res.send(task)
        } catch (error) {
            res.status(400).send(error)
        }
    })
    .delete('/tasks/:id', auth, async (req, res) => {
        const _id = req.params.id
        const user = req.user
        try {            
            const deleted = await Task.findOneAndDelete({
                _id,
                user: user._id
            }) 

            if (!deleted) return res.status(404).send()

            res.send(deleted)
        } catch (error) {
            res.status(500).send()
        }
    })
module.exports = router