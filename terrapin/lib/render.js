// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var utils = require('./utils');

var render = {};

/**
 * [renderImageList description]
 * Used to render images from IG when the next button is clicked
 */
render.renderImageList = function (app, request, response) {
  return function (err, medias, pagination, remaining, limit) {
    app.pagination = { min: pagination.min_tag_id, max: pagination.next_max_tag_id };
    app.currentCount = app.lastPagination.max === undefined ? 0 : app.currentCount + app.count;
    var imagelist = utils.processImageList(medias);
    response.render('partials/imagelist', {
      imagelist: imagelist,
      count: app.currentCount
    });
  };
};

/**
 * [client description]
 * Render the simple client view
 */
render.client = function (app, request, response) {
  response.render('pages/client');
};

/**
 * [manager description]
 * Render the initial management view using the IG API
 */
render.manager = function (app, request, response) {
  return function (err, medias, pagination, remaining, limit) {
    app.pagination = { min: pagination.min_tag_id, max: pagination.next_max_tag_id };
    app.lastPagination = JSON.parse(JSON.stringify(app.pagination));
    var imagelist = utils.processImageList(medias);
    response.render('pages/manager', {
      tagcount: app.tagCount,
      imagelist: imagelist,
      count: app.currentCount,
      gallery: app.gallery.getData(),
      json: JSON.stringify(medias, null, 2),
      pagination: JSON.stringify(pagination, null, 2)
    });
  };
};

exports = module.exports = render;
