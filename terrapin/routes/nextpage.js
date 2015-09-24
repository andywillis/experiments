// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var render = require('../lib/render');

function nextPage(app) {
  return function (request, response) {
    var options = { count: app.count, max_tag_id: app.pagination.max };
    app.direction = 'next';
    app.ig.tag_media_recent(app.tag, options, render.renderImageList(app, request, response));
  };
}

exports = module.exports = nextPage;
