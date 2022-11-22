/**
 * In this server.js file we will:
 * 
 *  1. Configure an Express server
 *  2. Attach a CORS an express.json middleware
 *  3. Specify routes
 */

import express from 'express'
import cors from "cors"
import mflix from "./api/mflix.route.js"   // We're going to have our routes in a seperate file. "mflix" is just the name of a randomly generated sample data from mongodb.

// App will use express to make the server
const app = express()

// App will use CORS and express.json for middleware reasons I'm too dumb to understand
app.use(cors())
app.use(express.json())

// Initial routes
// Most routes are going to be in a separate file, but we gotta specify what the starting or "root" URL/URI is gonna be
// generally it goes "/api/v#/dbname"
app.use("/api/v1/mflix", mflix)
app.use("*", (req, res) => res.status(404).json({error: "not found"}))

// We are exporting App as a module
// By doing so, we can import it into the file that accesses the DB (aka, the file that we actually run to start the server)
export default app