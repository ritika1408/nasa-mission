const axios = require('axios')
const launchesData = require('./launch.mongo')
const planets = require('./planets.mongo')

const Default_Flight_Number = 100

const SPACEX_URL = "https://api.spacexdata.com/v4/launches/query"

async function populateData() {
    console.log("Downloading Launch Data ...")
    const response = await axios.post(SPACEX_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    })
    //check if any error occured during post request
    if(response.status !== 200){
        console.log(`Problem in Downloading Launch Data`)
        throw new Error(`Error occurred during launch data`)
    }

    const launchesDoc = response.data.docs
    for (const launchDoc of launchesDoc) {
        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            customers,
            success: launchDoc['success'],
            upcoming: launchDoc['upcoming']
        }
        console.log(`${launch.flightNumber} ${launch.mission}`)
        await saveLaunch(launch)
    }
}

async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber:1,
        rocket:'Falcon 1'
    })

    if(firstLaunch){
        console.log(`Launch data already exists`)
    }
    else{
        await populateData()
    }
}

async function findLaunch(filter){
    return await launchesData.findOne(filter)
}

async function existLaunchById(launchId) {
    return await launchesData.findOne({
        flightNumber: launchId
    })
}

async function getAllLaunches(skip,limit) {
    return await launchesData
    .find({}, {
        '_id': 0, '__v': 0
    })
    .sort({flightNumber:1})
    .limit(limit)
    .skip(skip)
}

async function saveLaunch(launch) {
    await launchesData.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

async function getLatestFlightNumber() {
    const latest = await launchesData.findOne().sort('-flightNumber')
    if (!latest) {
        return Default_Flight_Number
    }
    return latest.flightNumber
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    })
    if (!planet) {
        throw new Error(`No matching planet found`)
    }
    const latestFlight = await getLatestFlightNumber() + 1
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Gourav', 'NASA'],
        flightNumber: latestFlight,
    })
    await saveLaunch(newLaunch)
}

async function abortLaunchById(launchId) {
    const aborted = await launchesData.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    })
    return aborted.modifiedCount === 1
}

module.exports = {
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    existLaunchById,
    abortLaunchById
}