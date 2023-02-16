'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');

// Importar express-session y passport
const session = require('express-session');
const passport = require('passport');

// Importar mongoDB
const ObjectID = require('mongodb').ObjectId;

const app = express();

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usa el motor de plantilla pug
app.set( 'view engine', 'pug' );

// Define las vistas que seran compiladas de pug
app.set( 'views', `./views/pug` );

app.route('/').get((req, res) => {
  res.render( 'index', {
    title: 'Hello',
    message: 'Please log in'
  });
});

// Configurando session-express
app.use( session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Configurar el servidor con passport
app.use( passport.session() );
app.use( passport.initialize() );

async function conectarBD( cliente ){

  try{
    const myDataBase = await cliente.db('fccNodeExpress').collections('usuarios');

    app.get( '/', (req, res)=>{
      res.render( 'index', {
        title: 'Connected to Database',
        message: 'Please login'
      });
    });

    passport.serializeUser((user, done) => {
      console.log(user._id);
      done(null, user._id);
    });
    
    passport.deserializeUser((id, done) => {
      myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
        done(null, doc);
      });
      done( null, null );
    });

  }
  catch( error ){

    app.get( '/', (req, res)=>{
      res.render( 'index', {
        title: error,
        message: 'Unable to connect to database'
      });
    });
  };
};
myDB( conectarBD );

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
