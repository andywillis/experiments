// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var render = require('../lib/render');

function home(app) {
  return function (request, response) {
    app.currentCount = 0;
    var options = { count: app.count };
    app.ig.tag_media_recent(app.tag, options, render.manager(app, request, response));
  };
}

exports = module.exports = home;
