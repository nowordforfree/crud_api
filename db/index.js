/**
 * Created by ozzy on 8/3/15.
 */
var mongoose = require('mongoose');
var config = require('./config');

var connectionstring = 'mongodb://' + config.ip + ':' + config.port + '/' + config.db;

mongoose.connect(connectionstring, function(err, res) {
    if (err) {
        throw err;
    }
})

module.exports = mongoose;