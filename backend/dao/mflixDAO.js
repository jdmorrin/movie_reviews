/**
 * This file creates a DAO.
 * A DAO is a Data Acceess Object, which is essetnially the class that holds CRUD statements and queries
 * 
 * More info on MongoDB uery operators: https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqazZidVNFeHJWbk9PeURKeEIzd2F6aXVWTTR3Z3xBQ3Jtc0trQnB0MGN0ZHlzVXdZd2xKeTllTkp0a0VaTmhGRjhDeU4wc2E3U2hoRXc0VW9zdGRzNVllRE56QzdVT2pXdjFxcEstQ1FFNm1HTVhQWUU1UTZBNGVsYVh1RXFfczlickVuMmVFRDRjUjVlUVNMdDBBZw&q=https%3A%2F%2Fdocs.mongodb.com%2Fmanual%2Freference%2Foperator%2F&v=mrHNSanmqQ4
 */

import { ObjectId } from "mongodb"
//import mongodb from "mongodb"
//const ObjectId = mongodb.ObjectId

let mflix   //Creates a variable used to store a ref to our DB

// This is the export statement 
class MflixDAO {
    static async injectDB(conn){    // This method is called as soon as the server starts. This is how we initially connect to the DB  
        // If the variable is already is already associated to a reference, then just return it.
        if(mflix){
            return
        }
        // Otherwise, associate the variable to the db ref
        try{
            mflix = await conn.db(process.env.JD_NS).collection("movies")
        }catch(e){
            console.error('Unable to establish a collection handle in mflixDAO: ' + e)
        }
    }

    // Creates a query to fetch data from the collection/table in the DB
    static async getMovies({
        
        // These are default options for the queries.
        // The input values for these options are passed by mflix.controller
        filters = null,
        page = 0,
        moviesPerPage = 20,
    } = {}) {
        let query
        // Here we are only initializing the queries, but not executing them
        // If this were in a shell, it would be like typing out the query, but not pressing ENTER
        if (filters){
            if("title" in filters){
                query = {$text: {$search: filters["title"] } }  // $search only works if the DB is hosted on Atlas. For local DBs, create local text index.
            } else if ("runtime" in filters){
                query = {"runtime": {$eq: filters["runtime"] } }
            } else if("year" in filters){
                query = {"year": {$eq: filters["year"]}}
            }else if("rated" in filters){
                query = {"rated": {$eq: filters["rated"]}}
            }

            
        }

        // Cursor represents the returned data
        let cursor
        
        // Executes the query. If no query exists, then ALL the data in a collection will be returned
        try{
            cursor = await mflix.find(query)
        }catch(e){
            console.error('Unable to issue find command ' + e)
            return {moviesList: [], totalNumMovies: 0}
        }

        // This displays the data, with a limit of how many documents appear at once
        const displayCursor = cursor.limit(moviesPerPage).skip(moviesPerPage * page)

        try{
            const moviesList = await displayCursor.toArray()    // Puts data in an array
            const totalNumMovies = await mflix.countDocuments(query)  // Gets total number of documents

            return { moviesList, totalNumMovies}
        } catch(e){
            console.error('Unable to convert cursor to array or problem counting documents ' + e)
            return{moviesList: [], totalNumMovies: 0}
        }
        
    }

    // Don't really need to pay too much attention to this method, for our purposes
    // Still good to know tho
    // This method is complicated because we have to find all the reviews associated with one movie_id, and display it with the movie of the requested id
    static async getMovieById(id){
        try {
            // For more info on what's going on here, go to the video at mark 59:45
            // This is very complex mongodb syntax that I don't understand quite yet
            // MongoDB aggregation pipeline is a framework for data aggregation
            // Transforms documents into aggregated results
            // It's not working. Pipeline aggregation problem
            // MORE RESEARCH REQUIRED
            const pipeline = [
                {
                    // If there is an error here, check the import statements
                    $match: {_id: new ObjectId(id),},
                },
                {
                    // From my understanding of mongodb
                    // $lookup essentially performs a left outer join to a collectioin within the SAME db
                    // The particular syntax used here for lookup is for CORRELATED sunqueries
                    $lookup: {
                        from: "reviews",    // foreign collection that will ne jopined to this collection
                        let:{id: "$_id",},  // OPTIONAL. Specifies variables to use in pipeline stages
                        pipeline: [         // This pipeline runs on the FOREIGN collection: in this case, "reviews"
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$movie_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort: {date: -1,},
                            },
                        ],
                        as: "reviews",  // Specifies the name of new array field to add to the foreign documents.
                    },
                },
                {
                    // Final stage of aggregation. Adds aggregated fields to the results
                    $addFields: {reviews: "$reviews",},
                },
                
            ]

            // The db.aggregate() method, takes the pipeline and does the mongodb aggregation magic
            return await mflix.aggregate(pipeline).next()
        } catch (e) {
            console.error('Something went wrong in getMoviesById: ' + e)
            throw e
        }
    }

    // I'll do the rest tomorrow
    static async getRatings(){
        let ratings = []
        try {
            ratings = await mflix.distinct("rated")
            return ratings
        } catch (e) {
            console.error("Unable to get ratings: " + e)
            return ratings
        }
    }
}

// Put the export statements at the end. Otherwise, you'll get a dumb "The requested module does not provide export named default" syntax err.
export default MflixDAO