'use strict';

var file = require('./file');

/**
 * Gallery is a bespoke prototype for this module
 * It has an easy API with which to grapple.
 */

function Gallery() {
  this.data = [];
  return this;
}

Gallery.prototype.getData = function (data) {
  return this.data;
};

Gallery.prototype.getJSON = function (data) {
  return JSON.stringify(this.data);
};

Gallery.prototype.add = function (data) {
  data.id = this.data.length + 1;
  this.data.push(data);
  return this;
};

Gallery.prototype.load = function (json) {
  var data = JSON.parse(json).data;
  this.data = data;
  return this;
};

Gallery.prototype.delete = function (id) {
  this.data = this.data.filter(function (el) {
    return el.id !== +id;
  });
  return this;
};

Gallery.prototype.save = function (app, request, response) {
  file.saveGallery(app, request, response);
};

Gallery.prototype.reset = function () {
  this.data = [];
  return this;
};

module.exports = Gallery;
