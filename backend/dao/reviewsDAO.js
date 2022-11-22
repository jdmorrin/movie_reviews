import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId   // We're gonna need to convert a string to Object Id from mongodb

let reviews // Variable that will hold the reviews collection

class ReviewsDAO{
    static async injectDB(conn){
        if(reviews){    
            return
        }

        try{
            reviews = await conn.db(process.env.JD_NS).collection("reviews")
        }catch(e){
            console.error('Unable to establish connection to handles in userDAO: ' + e)
        }
    }

    static async addReview(movieId, user, review, date){
        try{
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                text: review,
                movie_id: ObjectId(movieId),    // This converts the movieId String into an object id
            }

            return await reviews.insertOne(reviewDoc)
        }catch(e){
            console.error('Unable to post review: ' + e)
            return {error: e}
        }
    }

    static async updateReview(reviewId, userId, text, date){
        try {
            const updateResponse = await reviews.updateOne(
                {user_id: userId, _id: ObjectId(reviewId)}, // Chekcs that the userID and reviewId are both correct before update is executed
                {$set: {text: text, date: date} },  //Sets the vaues of new text and new date
            )
            return updateResponse
        } catch (e) {
            console.error('Unable to update review: ' + e)
            return {error: e}
        }
    }

    static async deleteReview(reviewId, userId){
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: ObjectId(reviewId),
                user_id: userId,
            })

            return deleteResponse
        } catch (e) {
            console.error('Unable to delete review: ' + e)
            return{error: e}
        }
    }
}

export default ReviewsDAO