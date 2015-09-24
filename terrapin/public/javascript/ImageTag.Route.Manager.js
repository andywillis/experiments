'use strict';

define('ImageTag.Route.Manager', [
  'jquery',
  'backbone',
  'ImageTag.Collection',
  'ImageTag.View.Gallery'
], function ($, Backbone, ImageGalleryCollection, ImageGalleryView) {

  return function (application) {

    var imageGallery = new ImageGalleryCollection();

    var imageGalleryView = new ImageGalleryView({
      collection: imageGallery,
      application: application,

      // send through the view property so that
      // ImageTag.View.Image knows to add "remove" buttons to
      // the images
      view: 'manager'
    });

    imageGallery.fetch().done(function () {
      imageGalleryView.render();
    });

  };

});
