'use strict';

define('ImageTag.Collection', [
  'backbone',
  'ImageTag.Model'
], function (Backbone, ImageModel) {

  return Backbone.Collection.extend({
    url: '/imagegallery',
    model: ImageModel
  });

});
