'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');

// Importar express-session y passport
const session = require('express-session');
const passport = require('passport');

// Importar mongoDB
const { ObjectId, MongoClient } = require('mongodb');
const obj = new ObjectId();
console.log(obj);

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

// Habilitar la serializacion
passport.serializeUser( (user, done)=>{
    done(null, user._id);
});

// Habilitar la deserializacion del usuario
passport.deserializeUser( (id, done)=>{
  done(null, null);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
