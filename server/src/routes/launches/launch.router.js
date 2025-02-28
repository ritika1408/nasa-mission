const express = require('express')
const launchRouter = express.Router()

const {httpAbortLaunch,httpAddNewLaunch,httpGetAllLaunches} = require('./launch.controller')

launchRouter.get('/',httpGetAllLaunches)

launchRouter.post('/',httpAddNewLaunch)

launchRouter.delete('/:id',httpAbortLaunch)


module.exports = launchRouter