// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var fs = require('fs');

var file = {};

file.loadGallery = function (app) {
  fs.lstat(app.galleryPath, function (err, stats) {
    if (!err) {
      fs.readFile(app.galleryPath, 'UTF-8', function (err, data) {
        if (err) {
          console.log(err);
        }
        app.gallery.load(data);
      });
    }
  });
};

file.saveGallery = function (app, request, response) {
  var json = JSON.stringify(app.gallery);
  fs.writeFile('./data/gallery.json', json, function (err) {
    if (err) {
      console.log(err);
    }
    console.log('The file was saved!');
  });
  response.send(true);
};

exports = module.exports = file;
