#!/usr/bin/env node

var mongoose = require('mongoose'),
    express = require('express'),
    util = require('util'),
    events = require('events'),
    async = require('async'),
    fs = require('fs'),
    http = require('http'),
    Pool = require('./models/pool');

// Configuration ---------------------------------------------------------------

var PORT = 27124;

// Database --------------------------------------------------------------------

mongoose.connect('mongodb://localhost/pools');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to Mongo database.');
});

// App -------------------------------------------------------------------------

var app = express();
// Log requests.
app.use(express.logger('dev'));
// Parse body into req.body.
app.use(express.urlencoded());
app.use(express.json());
app.use(express.favicon());
// Put the angular JS directory as static.
app.use(express.static('./app'));

// Setup a route to request a new pool or an existing pool from the poolId.
app.get('/REST/pool/:poolId', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
  Pool.findByIdOrNew(req, res, next);
});

// Setup a route to update a pool with new bets.
app.post('/REST/pool/:poolId/addBet', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
  // TODO Check input from the user here.

  // Add the bet to the pool.  
  Pool.addBet(req, res, next);
});

// Setup a route to allow updating of the pool.
app.post('/REST/pool', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
  Pool.update(req, res, next); 
});

app.get('/REST/pool', function() {
  Pool.findAll(req, res, next);
});

// Start the servers.
// This needs to be at the bottom of the code.
app.listen(PORT, function (){
  console.log( 'Express server listening on port %d in %s mode.', PORT, app.settings.env );
});
