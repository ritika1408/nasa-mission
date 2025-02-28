require('dotenv').config()
const http = require('http')
const app = require('./app')
const { loadPlanetData } = require('./models/planet.model')
const { loadLaunchData } = require('./models/launch.model')
const {connectMongo} = require('./services/mongo')

const PORT = process.env.PORT || 8000

const server = http.createServer(app)


async function startServer() {
    await connectMongo()
    await loadPlanetData()
    await loadLaunchData()
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`)
    })
}

startServer()