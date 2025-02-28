const {getAllLaunches, scheduleNewLaunch, existLaunchById, abortLaunchById} = require("../../models/launch.model")
const { getPagination } = require("../../services/query")


async function httpGetAllLaunches(req,res){
    const {skip,limit} = getPagination(req.query)
    const launches = await getAllLaunches(skip,limit)
    return res.status(200).json(launches)   
}

async function httpAddNewLaunch(req,res){
    const launch = req.body
    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({
            error:'missing required property'
        })
    }
    launch.launchDate = new Date(launch.launchDate)
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error:'Invalid Launch Date'
        })
    }
    await scheduleNewLaunch(launch)
    return res.status(201).json(launch)
    
}


async function httpAbortLaunch(req,res){
    const launchId = Number(req.params.id)
    const existLaunch = await existLaunchById(launchId) 
    if(!existLaunch){
        return res.status(404).json({
            error:'Launch not found'
        })
    }
    const abort = await abortLaunchById(launchId)
    if(!abort){
        res.status(400).json({
            error:'Launch not aborted'
        })
    }
    return res.status(200).json({
        ok:true
    })
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}


// To api call use postman or browser -> if using browser formate should be followed for send correct data

// fetch('http://localhost:8000/launch', {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//         mission:'nodejs backend',
//         rocket:'hehehhehehe',
//         destination:'kepler-planet -b',
//         launchDate:'Feburary 20,2026'
//     })
// })