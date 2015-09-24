// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

define('ImageTag.View.Client', [
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

      this.limit = 12;
      this.image = 0;
      this.collection = options.collection;
      this.view = options.view;
      this.element = $('#imagegallery');
    },

    events: {
      'click .imagetag-nextpage': 'nextPage'
    },

    nextPage: function () {
      this.image += this.limit;
      if (this.image >= this.collection.length) { this.image = 0; }
      this.render();
    },

    /**
     * [render description]
     * Renders the complete collection
     */
    render: function () {

      this.element.empty();

      this.modelCount = this.collection.length;

      var section = (this.image + this.limit);

      var len = section < this.modelCount ? section : this.modelCount;

      for (var i = this.image; i < len; i++) {

        var modelView = new ImageView({
          model: this.collection.at(i),
          view: this.view
        });

        this.element.append(modelView.render().el);

        // Make sure the elements are kept in groups of 6
        if (i > 0 && (i + 1) % 6 === 0 && i < (this.image + this.limit - 1)) {
          this.element.append('<br/>');
        }

      }

      // add the next button
      this.element.append('<button class="imagetag-nextpage">Next >></button>');

    }

  });

});
