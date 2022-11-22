/**
 * This file initializes the input, and formats the output of the DAO
 */

import MflixDAO from "../dao/mflixDAO.js"

class MflixController{
    static async apiGetMovies(req, res, next){
        
        // Initializes query options. "?" signifies a condensed if-then, ":" is else
        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.title){
            filters.title = req.query.title
        }else if (req.query.runtime){
            filters.runtime = parseInt(req.query.runtime)
        }else if(req.query.year){
            filters.year = req.query.year
        }else if(req.query._id){
            filters.cast = req.query._id
        }else if(req.query.rated){
            filters.rated = req.query.rated
        }

        const {moviesList, totalNumMovies} = await MflixDAO.getMovies({
            filters,
            page,
            moviesPerPage,
        })

        // Constructing the layout of the response.
        let response = {
            mflix: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        }

        // Convert response to JSON format
        res.json(response)
    }

    /**
     * An explanation on mogodb requests
     * "req.query.x" x comes after the "?" in the URL
     * "req.param.x" x comes right after the "/" in the URL
     * "req.body.x" x comes from the body of the request
     */

    // This method is not working. Pipeline aggregation problems
    // Problem inside DAO.getMovieById()
    static async apiGetMovieById(req,res,next){
        try{
            let id = req.params.id || {}
            let movie = await MflixDAO.getMovieById(id)
            if(!movie){
                res.status(404).json({error: "Not Found"})
                return
            }
            res.json(movie)
        } catch(e){
            console.log('api, ' + e)
            res.status(500).json({error: e})
        }
    }

    static async apiGetRating(req, res, next){
        try {
            let ratings = await MflixDAO.getRatings()
            res.json(ratings)
        } catch (e) {
            console.log('api, ' + e)
            res.status(500).json({error: e})
        }
    }
}

export default MflixController