'use strict'

var mongoose = require('mongoose');
var PoolSchema = require('../schemas/pool');
var Pool = mongoose.model('Pool', PoolSchema);

// Attempt to find the pool in the database.
// If it doesn't exist create a new pool with this id.
// The save will occur when a bet is placed.
exports.findByIdOrNew = function (req, res, next) {
  var pool;
  var poolId = req.params.poolId;
  Pool.findOne({poolId: poolId}, function(error, result) {
    if (error) {
      console.log('Find error' + err);
    }

    if (result != null) {
      // console.log('Matched: ' + result);
      pool = result;
    } else {
      // console.log('Created new pool');
      pool = new Pool({poolId: poolId});
      pool.save();
    }

    res.send(200, pool);
  });
};

exports.findById = function (req, res, next) {
  var pool;
  Pool.findOne({poolId: req.params.poolId}, function(error, result) {
    if (error) {
      console.log('Find error' + err);
      return next(error);
    }

    pool = result;
    res.send(200, pool);
  });
};

exports.findAll = function (req, res, next) {
  Pool.find(function(error, results) {
    res.send(200, results);
  });
};

exports.addBet = function(req, res, next) {
  Pool.findOne({poolId: req.params.poolId}, function(error, result) {
    var pool;
    if (error) {
      console.log('Find error' + err);
      return next(error);
    }

    if (result == null || result == undefined) {
      // console.log('Matched: ' + result);
      res.send(400, 'ERROR');
    }

    pool = result;
    // Add the bet to the pool.
    pool.bets.push({name: req.body.name, location: req.body.location});
    pool.save(function(error) {
      console.log('Error adding the bet.');
    });
    console.log('AddBet: Pool saved.');
    res.send(200, 'OK');
  });
};

exports.update = function(req, res, next) {
  var poolId = req.body.poolId;
  var bets = req.body.bets
  var id = req.body._id;

  Pool.findByIdAndUpdate(id, {$set: {bets: bets}}, function (error, pool) {
    if (error) {
      console.log(error);
      return error;
    } else {
      res.send(200, pool);
    }
  });
};
