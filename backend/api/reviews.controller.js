import ReviewsDAO from "../dao/reviewsDAO.js"
import bson from "bson" // I don;t know why he includes these import statemenets here
import mongodb from "mongodb"
//const ObjectId = bson.ObjectId // 50:04
const ObjectId = mongodb.ObjectId



// "controllers" are classes that initialize user input variables for the db
class ReviewsCtrl{
    static async apiPostReview(req, res, next){
        try{
            // unlike the mflix controller, here we request data directly from the body
            // Why do we request information from the body?
            // Because this is a POST request, not a GET request
            const movieId = req.body.movie_id
            const review = req.body.text
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
            const date = new Date()
            // NOTE: The user authentication that is used in this controller is pretty bad. 
            // Learn to fix it later

            const reviewResponse = await ReviewsDAO.addReview(
                movieId,
                userInfo,
                review,
                date,
            )
            res.json({status: "success"})

        } catch(e){
            res.status(500).json({error: e.message})
        }
    }

    static async apiUpdateReview(req, res, next){
        try{
            const reviewId = req.body.review_id
            const text = req.body.text
            const date = new Date()

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.body.user_id,
                text,
                date,
            )

            // Check if there is an error
            var {error} = reviewResponse
            if(error){
                res.status(400).json({error})
            }

            if (reviewResponse.modifiedCount === 0){
                throw new Error(
                    "unable to update review - user may not be original poster",
                )
            }

            res.json({status: "Success"})
        }catch(e){
            res.status(500).json({error: e.message})
        }
            
    } 

    static async apiDeleteReview(req, res, next){
        try{
            const reviewId = req.query.id
            const userId = req.body.user_id // It's not standard to delete anything in the body in delete requests
            console.log(reviewId)
            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId,
            )
            res.json({status: "success"})
        } catch(e){
            res.status(500).json({eerror: e.message})
        }
    }
}

export default ReviewsCtrl