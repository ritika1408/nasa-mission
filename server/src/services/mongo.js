const mongoose = require('mongoose')
require('dotenv').config()

const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready')
})
mongoose.connection.on('error', (err) => {
    console.log(`error during mongoDB connection :: ${err}`)    
})

async function connectMongo(){
    await mongoose.connect(MONGO_URL)
}

async function disconnectMongo(){
    await mongoose.disconnect(MONGO_URL)
}

module.exports = {
    connectMongo,
    disconnectMongo
}