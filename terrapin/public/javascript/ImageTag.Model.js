'use strict';

define('ImageTag.Model', [
  'backbone'
], function (Backbone) {

  return Backbone.Model.extend({
    urlRoot: '/imagegallery',
    defaults: {
      id: null,
      link: null,
      url: null
    }
  });

});
