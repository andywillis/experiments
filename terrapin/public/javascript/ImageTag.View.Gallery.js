// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

define('ImageTag.View.Gallery', [
  'jquery',
  'backbone',
  'ImageTag.Model',
  'ImageTag.View.Image'
], function ($, Backbone, ImageModel, ImageView) {

  return Backbone.View.extend({

    collection: null,

    // Needed to set 'body' here otherwise I would not have been able to
    // access all the elements to which I need to add click events.
    el: 'body',

    initialize: function (options) {

      var _this = this;

      this.collection = options.collection;
      this.view = options.view;
      this.modelCount = this.collection.length;

      // more efficent routine for adding single models
      // to the collection
      this.collection.on('add', function () {
        _this.renderOne();
      });

      // otherwise just re-render the whole collection
   /*   this.collection.on('remove reset sync change destroy', function () {
        _this.render();
      });
*/
    },

    events: {
      'click .imagetag-nextpage': 'nextPage',
      'click .imagetag-previouspage': 'previousPage',
      'click .imagetag-remove': 'removeImage',
      'click .imagetag-ig-container:not(".imagetag-added")': 'addImage'
    },

    nextPage: function () {
      var _this = this;
      $.ajax({
        url: '/nextpage'
      }).done(function (html) {
        $('#imagelist').html(html);

        // make sure that we check the collection for any images
        // that have appeared in the gallery stream and highlight them
        _this.updateGalleryList();
      });
    },

    previousPage: function () {
      var _this = this;
      $.ajax({
        url: '/previouspage'
      }).done(function (html) {
        $('#imagelist').html(html);

        // make sure that we check the collection for any images
        // that have appeared in the gallery stream and highlight them
        _this.updateGalleryList();
      });
    },

    updateGalleryList: function (link) {
      var _this = this;

      // for each model in the collection, grab the link and if
      // there are any images in the gallery stream that match,
      // highlight them
      this.collection.forEach(function (model) {
        _this.updateGalleryImage(model.get('link'));
      });
    },

    /**
     * [updateGalleryImage description]
     * shortcut method used by updateGalleryList, renderOne,
     * and render to ensure that the images in the gallery stream
     * are highlighted where appropriate
     */
    updateGalleryImage: function (link) {
      var $container = $('.imagetag-ig-container[data-link="' + link + '"]');
      $container.addClass('imagetag-added');
    },

    // creates a brand new model with link and url populated with
    // the information from the clicked-on gallery image.
    createModel: function ($container) {
      return new ImageModel({
        link: $container.data('link'),
        url: $container.data('url')
      });
    },

    addImage: function (obj) {
      var $container = $(obj.currentTarget);
      var model = this.createModel($container);

      // model.save() automatically saves the model to the server
      // (see the urlRoot property in the model). All you then need to
      // do is add the new model to the collection and backbone takes
      // care of the rest of it.
      model.save();
      this.collection.add(model);
      $container.addClass('imagetag-added');
    },

    removeImage: function (obj) {
      var $button = $(obj.currentTarget);
      var $container = $($button).parent();
      var link = $container.data('link');
      var model = this.collection.findWhere({ link: link });

      // again, model.destroy() automatically deletes the model to the server
      // (see the urlRoot property in the model). All you then need to
      // do is remove the new model from the collection
      model.destroy();
      this.collection.remove(model);
      $('.imagetag-ig-container[data-link="' + link + '"]').removeClass('imagetag-added');
    },

    /**
     * [renderOne description]
     * This method renders only ONE model to the view and is, therefore
     * more efficient than rendering the whole collection. When a new model
     * is added to the collection this is the method that is used.
     */
    renderOne: function () {

      var element = $('#imagegallery');
      var model = this.collection.at(this.collection.length - 1);

      var itemView = new ImageView({
        model: model,
        view: this.view
      });

      element.append(itemView.render().el);

      this.updateGalleryImage(model.get('link'));

      return this;

    },

    /**
     * [render description]
     * Renders the complete collection
     */
    render: function () {

      var _this = this;

      var element = $('#imagegallery');
      element.empty();

      this.collection.forEach(function (model, i) {

        var modelView = new ImageView({
          model: model,
          view: _this.view
        });

        element.append(modelView.render().el);

        // Make sure the elements are kept in groups of 6
        if (i > 0 && (i + 1) % 6 === 0) { element.append('<br/>'); }

        _this.updateGalleryImage(model.get('link'));

      });

      return this;

    }

  });

});
