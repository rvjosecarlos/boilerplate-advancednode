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


// Conectar la BD antes de cualquier solicitud get
async function conectarBD( cliente ){
  
  try{
    const miBaseDeDatos = await cliente.db('controlcalidad').collections('usuarios');
    app.get('/', (req, res)=>{
      
      res.render( 'index', {
        title: 'Connected to Database',
        message: 'Please Login'
      })

      passport.serializeUser((user, done) => {
        done(null, user._id);
      });
      
      passport.deserializeUser((id, done) => {
        console.log('ID:',id);
        myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
          done(null, doc);
        });
        done( null, null );
      });

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
