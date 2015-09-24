'use strict';

define('ImageTag.Route.Client', [
  'jquery',
  'backbone',
  'ImageTag.Collection',
  'ImageTag.View.Client'
], function ($, Backbone, ImageGalleryCollection, ImageClientView) {

  return function (application) {

    var collection = new ImageGalleryCollection();

    var view = new ImageClientView({
      collection: collection,
      application: application,

      // send through the view property so that
      // ImageTag.View.Image knows not to add "remove" buttons to
      // the images
      view: 'client'
    });

    collection.fetch().done(function () {
      view.render();
    });

  };

});
