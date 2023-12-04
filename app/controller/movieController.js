import express from 'express'
import { Cast, Genre, Movie, MovieCast, MovieGenre } from '../index.js';

export const movieController = {
    getMovies: async (req, res) => {
        const movies = await Movie.findAll({
            include: [
                { model: Genre,attributes:['id','name'],through:{attributes:[]}},
                { model: Cast ,attributes:['id','name'],  through: { attributes: [] }}
            ]
        });
        res.json(movies);
    },

    getMovie: async (req, res) => {
        const movie = await Movie.findByPk(req.params.id, {
            include: [
                { model: Genre,attributes:['id','name'],through:{attributes:[]}},
                { model: Cast ,attributes:['id','name'],  through: { attributes: [] }}
            ]
        });
        res.json(movie);
    },

    createCast: async (req, res) => {
        try {
            const { name } = req.body;

            const cast = await Cast.create({ name });

            res.status(201).json(cast);
        } catch (error) {
            console.error('Error creating movie:', error);
            res.status(500).json({ error: 'Failed to create movie' });
        }
    },
    createGenre: async (req, res) => {
        try {
            const { name } = req.body;

            const genre = await Genre.create({ name });

            res.status(201).json(genre);
        } catch (error) {
            console.error('Error creating movie:', error);
            res.status(500).json({ error: 'Failed to create movie' });
        }
    },


    createMovie: async (req, res) => {
        try {
            const { name, description, genres, casts } = req.body;
            const movie = await Movie.create({ name, description });
            console.log("cast", casts);

            if (genres && genres.length > 0) {
                Array.from(genres).forEach(async (genreId) => {
                    const genre = await Genre.findOne({ where: { id: genreId } });

                    if (!genre) {
                        return new Error("Genre not found")
                    }

                    await MovieGenre.create({ MovieId: movie.id, GenreId: genreId })
                })
            }

            if (casts && casts.length > 0) {
                Array.from(casts).forEach(async (castId) => {
                    const cast = await Cast.findOne({ where: { id: castId } });

                    if (!cast) {
                        return new Error("Genre not found")
                    }
                    await MovieCast.create({ MovieId: movie.id, CastId: castId })
                })
            }

            res.status(201).json(movie);
        } catch (error) {
            console.error('Error creating movie:', error);
            res.status(500).json({ error: 'Failed to create movie' });
        }
    },


};


//sequalize query, include.