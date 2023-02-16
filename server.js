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

// Conectar la BD antes de cualquier solicitud get
myDB(async client => {
  const myDataBase = await client.db('database').collection('users');

  // Be sure to change the title
  app.route('/').get((req, res) => {
    // Change the response to render the Pug template
    res.render('index', {
      title: 'Connected to Database',
      message: 'Please login'
    });
  });

  // Serialization and deserialization here...

  // Be sure to add this...
}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('index', { title: e, message: 'Unable to connect to database' });
  });
});

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
