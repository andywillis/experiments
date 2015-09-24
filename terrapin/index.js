// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

'use strict';

// Gallery is a bespoke prototype built for this module
var Gallery = require('./lib/gallery');

// Some bespoke file operations
var file = require('./lib/file');

// The instagram node module for easy API access
var ig = require('instagram-node').instagram();

var express = require('express');
var bodyparser = require('body-parser');
var app = express();

// Set up a new Gallery
app.gallery = new Gallery();

// Where the data is stored (currently as a JSON file)
app.galleryPath = './data/gallery.json';

// The tag for which we will be searching
app.tag = 'bmawholenewworldskaterdress';

// Number of images to retrieve
app.count = 7;

app.pagination = {};
app.currentCount = 0;
app.ig = ig;

// load the gallery from JSON
file.loadGallery(app);

// set up instagram
app.ig.use({ access_token: process.env.IGTOKEN });
app.ig.use({ client_id: process.env.IGCLIENT, client_secret: process.env.IGSECRET });

// set up express app
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyparser.json());

// main routes
app.get('/client', require('./routes/client')(app));
app.get('/manager', require('./routes/manager')(app));
app.get('/nextpage', require('./routes/nextpage')(app));
// app.get('/previouspage', require('./routes/previouspage')(app));

// images routes (backbone API)
var images = require('./routes/images')(app);
app.get('/imagegallery', images.index);
app.post('/imagegallery', images.add);
app.delete('/imagegallery/:id', images.delete);

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
