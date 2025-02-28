const planetRouter = require('./planet/planet.router')
const launchRouter = require('./launches/launch.router')
const express = require('express')

const api = express.Router() 

api.use('/planet',planetRouter)
api.use('/launches',launchRouter)

module.exports = api