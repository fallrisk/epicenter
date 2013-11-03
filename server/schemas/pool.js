
var mongoose = require('mongoose');

var poolSchema = mongoose.Schema({
  poolId: {type: String, required: true, unique: true, trim: true},
  creationDate: { type: Date, default: Date.now },
  bets: [{
    name: {type: String, required: true}, 
    location: {type: String, required: true}}]
});

module.exports = poolSchema;
