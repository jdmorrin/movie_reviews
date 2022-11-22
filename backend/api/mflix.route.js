/**
 * 
 * This file contains all the possible routes that people can go to.
 * 
 */

import express from "express"
import MflixCtrl from "./mflix.controller.js"
import ReviewsCtrl from "./reviews.controller.js"

const router = express.Router()

// Old code. Demo route
//router.route("/").get((req, res) => res.send("Hello World!"))

router.route("/").get(MflixCtrl.apiGetMovies)   // GET list of all restaurants at root
// This route is not working --Juan David
router.route("/id/:id").get(MflixCtrl.apiGetMovieById) //GET a specific item with specific id, and all data associated with it. It is a bit complicated
router.route("/rated").get(MflixCtrl.apiGetRating) // GET a list of all ratings


// This route URL is used for writing reviews
// Notice none of the methods here are "get", because we're not reading data, but writing data
router.route("/review")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

// export statements allow this file to be imported by other files 
export default router