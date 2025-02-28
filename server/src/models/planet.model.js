const { parse } = require('csv-parse')
const path = require('path')
const fs = require('fs')
const planets = require('./planets.mongo')

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6;
}

function loadPlanetData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler-data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    // habitablePlanet.push(res)
                    await savePlanet(data)
                }
            })
            .on('error', (err) => {
                reject(err)
                console.log(err)
            })
            .on('end', async() => {
                const PlanetsFound = (await getAllPlanets()).length
                console.log(`${PlanetsFound} habitable planets`)
                resolve()
            })
    })
}

async function getAllPlanets() {
    return await planets.find({},{
        '_id':0,'__v':0
    })
}

async function savePlanet(planet) {
    //use upsert because using planets.create can consits duplicate data in mongoDB
    // it is possible that our mongoDB through error while updating data
    try{
        await planets.updateOne({
            keplerName:planet.kepler_name
        },{
            keplerName:planet.keplar_name
        },{
            upsert:true
        })
    }
    catch(err){
        console.error(`Error during updating habitable planet:: ${err}`)
    }
}
module.exports = {
    loadPlanetData,
    getAllPlanets,
}