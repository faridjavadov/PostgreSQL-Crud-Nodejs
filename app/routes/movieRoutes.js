import express from 'express'
import { movieController } from '../controller/movieController.js';

export const movieRouter = express.Router();

movieRouter.get('/movies',movieController.getMovies)
movieRouter.get('/movies/:id',movieController.getMovie)
movieRouter.post('/movies',movieController.createMovie)
movieRouter.post('/genres',movieController.createGenre)
movieRouter.post('/casts',movieController.createCast)