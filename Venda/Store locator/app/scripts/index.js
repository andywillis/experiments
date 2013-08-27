/*global console, $, google, util, jsonPath: true */
/*jslint browser: true */
/*jslint white: true */
/*jslint bitwise: true */
/*jslint plusplus: true */
(function() {
  "use strict";

  var coords, storeLocator, options;

  /**
   * Coords is used to hold the current mouse position
   * so that mouseup/mousedown can be properly calculated.
   * These are used instead of onclick so the user can highlight
   * text in the information boxes without immediately closing them
   * down again.
   */
  coords = [];

  $(function () {

    options = {
      endpoint: {
        bybox: 'http://37.58.67.19/sl/stable/backend/bybox'
      },
      node: {
        map: '#map',
        postcode: '#postcode',
        storeInfo: '#info',
        instructions: '#instructions',
        limit: '#limit'
      },
      instructions: false,
      radioClass: 'type'
    };

    storeLocator = new Locator(options).reset();

    $('#postcode').val('');

    /**
     * Checks whether the user has entered anything
     * in the postcode search box.
     */
    $('#postcode').keyup(function (e) {
      if (e.keyCode === 13) {
        storeLocator.processSearch();
      }
    });

    /**
     * Show route to marker along with a list of direction instructions.
     */
    $(document).on('mouseup', '.route', function (e) {
      var number, town;
      e.cancelBubble = true;
      e.stopPropagation();
      number = $(this).parent().find('.number').data('number');
      town = $(this).parent().find('.town').text();
      storeLocator.requestDirections({number: number, town: town}, function (html) {
        $('#instructions').html(html);
      });
    });

    /**
     * Zoom to a specific marker.
     */
    $(document).on('mouseup', '.zoom', function (e) {
      var number, record;
      e.cancelBubble = true;
      e.stopPropagation();
      number = $(this).parent().find('.number').data('number');
      record = parseInt(number, 10) - 1;
      storeLocator.zoomToMarker(record);
    });

    /**
     * Listening for mouseup/down events allow us to highlight
     * text in the store info boxes without closing it down which is
     * what would happen with onclick.
     */
    $(document).on('mousedown', '.storeInfo', function (e) {
      coords = [];
      coords.push(e.pageX);
      coords.push(e.pageY);
    });

    /**
     * Opens and closes the store info boxes only if the mouseup
     * coords are the sames as the mousedown coords. This allows the user
     * to highlight information in the box for copying if they so wish without
     * the box repeatedly opening and closing.
     * @param  {Event} e The mouse event.
     */
    $(document).on('mouseup', '.storeInfo', function (e) {
      var number;
      coords.push(e.pageX);
      coords.push(e.pageY);
      if (coords[0] === coords[2] && coords[1] === coords[3]) {
        if (e.button !== 2) {
          number = $(this).data('number');
          storeLocator.openCloseStoreInfo(number);
        }
      }
    });

  });

}());