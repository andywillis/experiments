// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var render = require('../lib/render');

function previousPage(app) {
  return function (request, response) {
    var options = { count: app.count, max_tag_id: app.lastPagination.min };
    app.direction = 'previous';
    app.ig.tag_media_recent(app.tag, options, render.renderImageList(app, request, response));
  };
}

exports = module.exports = previousPage;
