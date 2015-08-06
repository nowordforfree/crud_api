/**
 * Created by ozzy on 7/31/15.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = require('./router');

var port = process.env.PORT || '3333';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

app.listen(port);