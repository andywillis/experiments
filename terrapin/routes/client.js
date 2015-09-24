// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var render = require('../lib/render');

function home(app) {
  return function (request, response) {
    render.client(app, request, response);
  };
}

exports = module.exports = home;
