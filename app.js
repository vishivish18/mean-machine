/**
 * Module dependencies.
 */
"use-strict"

var express = require('express')
var mongoose = require("mongoose")
var bodyParser = require('body-parser')
var routes = require("./app/routes")


var app = express();
var router = require('express').Router()
var path = require('path')

app.use(bodyParser.json({ limit: 153791147 }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: 153791147
}));

var port = process.env.PORT || 1818

var server = app.listen(port, function() {
    console.log('Magic begins at port ', port);
});
console.log(routes.apiBaseUri);

app.use(routes.apiBaseUri, routes.api(app));

app.use(express.static(path.resolve('public/assets/')))
app.use(express.static(path.resolve('public/app/views')))
app.get('*', function(req, res) {
    res.sendFile(path.resolve('public/index.html'));
    //res.sendFile(path.resolve('public/app/views/material/examples/dashboard.html'));
});


