import app from "./server.js"   // We import this so that we can run the server from here
import mongodb from "mongodb"   // TO interact with tthe database
import dotenv from "dotenv"     
import MflixDAO from "./dao/mflixDAO.js"
import ReviewsDAO from "./dao/reviewsDAO.js"

dotenv.config() 
const MongoClient = mongodb.MongoClient // Idk why this is for

const port = process.env.PORT || 8000   // Initializes port

// Tries to connect to the database
// Tries to catch errors
// If no errors happen .then we start our web server
MongoClient.connect(
    process.env.JD_DB_URI,
    {
        maxPoolSize: 50,
        waitQueueTimeoutMS: 2500,
        useNewUrlParser: true // maybe deprecated?
    }
)
.catch(err => {
    console.error(err.stack)
    process.exit(1)
})
.then(async client => {
    // It seems that every DAO in the project needs to have the DB independently injected into it
    // In other words, declare all DAO.injectDB(client) here
    await MflixDAO.injectDB(client)
    await ReviewsDAO.injectDB(client)

    app.listen(port, () => {
        console.log('listening on port: ' + port)
    })
})

// We left the review at mark 50:00
// We were in the middle of modifying the "./dao/reviewsDAO.js" file