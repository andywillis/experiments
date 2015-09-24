'use strict';

// Not we're not naming our modules here. It would be interesting to know why
// NS does.
define([
  'lodash',
  'jquery',
  'backbone',
  'ImageTag.Router'
], function (_, $, Backbone, Router) {

  return function (application) {

    new Router(application);
    Backbone.history.start({ pushState: true });

  };

});
