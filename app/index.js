import express from 'express';
import { movieRouter } from './routes/movieRoutes.js';
import { Sequelize, DataTypes } from 'sequelize';


const sequelize = new Sequelize('movieApp', 'postgres', 'ferid090', {
    host: 'localhost',
    port: 8081,
    dialect: 'postgres'
});



export const Cast = sequelize.define('Cast', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
export const Genre = sequelize.define('Genre', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
export const Movie = sequelize.define('Movie', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

export const MovieCast = sequelize.define('MovieCast', {
    MovieId: {
        type: DataTypes.INTEGER,
        references: {
            model: Movie,
            key: 'id'
        }
    },
    CastId: {
        type: DataTypes.INTEGER,
        references: {
            model: Cast,
            key: 'id'
        }
    }
});

export const MovieGenre = sequelize.define('MovieGenre', {
    MovieId: {
        type: DataTypes.INTEGER,
        references: {
            model: Movie,
            key: 'id'
        }
    },
    GenreId: {
        type: DataTypes.INTEGER,
        references: {
            model: Genre,
            key: 'id'
        }
    }
});


Movie.belongsToMany(Genre, { through: MovieGenre });
Genre.belongsToMany(Movie, { through: MovieGenre });

Movie.belongsToMany(Cast, { through: MovieCast });
Cast.belongsToMany(Movie, { through: MovieCast });




sequelize.authenticate().then(() => {
    console.log("Connected to POSTGRESQL Server");
}).catch((err) => {
    console.log(err);
})



try {
    await Movie.sync();
    await Cast.sync();
    await Genre.sync();
    await MovieCast.sync();
    await MovieGenre.sync();
    console.log('Movie model synchronized with the database');
} catch (error) {
    console.error('Unable to sync Movie model:', error);
}



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'DELETE', 'PUT']);
    next();
})


app.use('/api', movieRouter)

try {
    app.listen(8080, () => {
        console.log("Server is Running");
    })

} catch (error) {
    console.log('Error:' + error);
}