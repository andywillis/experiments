/*global console, $, google, util, jsonPath: true */
/*jslint browser: true */
/*jslint white: true */
/*jslint bitwise: true */
/*jslint plusplus: true */

/**
 * Store locator.
 * ---------
 * REVISIONS
 * ---------
 * 070613 - AJW - Created
 * ---------
 * THINGS TO DO.
 * ---------
 * 1) Capture latlngs so we don't keep recreating them.
 * 2) Route caching? Not sure if the Google objects do this automatically.
 * 3) Commenting.
 */
(function() {
  "use strict";

  var Locator, Map, map, coords;

  /**
   * MAP CONSTRUCTOR
   */

  Map = function (node, options) {
    this.map = new google.maps.Map(node, options);
    this.ICON_PATH = options.ICON_PATH;
    this.geocoder = new google.maps.Geocoder();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.directionsDisplay.setOptions({ suppressMarkers: true });
    this.directionsDisplay.setMap(this.map);
    this.markers = [];
  };

  Map.prototype.getMarkerImage = function (type, number) {
    var filename, image, path;

    image = {
      size: new google.maps.Size(32, 37),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(15, 37)
    };

    path = this.ICON_PATH + '#{filename}';

    if (type === 'store') {
      filename = 'number_#{no}.png'.replace('#{no}', number);
      image.url = path.replace('#{filename}', filename);
      return image;
    }
    if (type === 'origin') {
      filename = 'home-2.png';
      image.url = path.replace('#{filename}', filename);
      return image;
    }
  };

  Map.prototype.newMarker = function (type, position, number, showInfo) {
    var marker;
    marker = new google.maps.Marker({
      draggable: false,
      raiseOnDrag: false,
      icon: this.getMarkerImage(type, number),
      animation: google.maps.Animation.DROP,
      position: position,
      map: this.map
    });
    google.maps.event.addListener(marker, 'click', function() {
      showInfo.call(this, number);
    });
    return marker;
  };

  Map.prototype.addStoreMarkers = function (stores, fn) {
    var i, l, store, lat, lng, position, iconNumber;
    for (i = 0, l = stores.length; i < l; i++) {
      store = stores[i];
      lat = store.location.lat;
      lng = store.location.lon;
      iconNumber = i + 1;
      position = new google.maps.LatLng(lat, lng);
      this.markers.push(this.newMarker('store', position, iconNumber, fn));
    }
  };

  Map.prototype.zoomToMarker = function (pos) {
    var lat, lng, marker;
    marker = this.markers[pos];
    lat = marker.position.lat();
    lng = marker.position.lng();
    this.centerZoom(new google.maps.LatLng(lat, lng), 15);
  };

  Map.prototype.plotOrigin = function (latLng) {
    this.markers.push(this.newMarker('origin', latLng));
  };

  Map.prototype.getCoords = function (address, callback) {
    map.geocoder.geocode({ address: address }, function (data) {
      if (data.length > 0) {
        callback({
          lat: data[0].geometry.location.lat(),
          lng: data[0].geometry.location.lng()
        });
      }
    });
  };

  Map.prototype.setAllMap = function (map) {
    var i, l;
    for (i = 0, l = this.markers.length; i < l; i++) {
      this.markers[i].setMap(map);
    }
  };

  Map.prototype.deleteOverlays = function() {
    this.directionsDisplay.setDirections({routes: []});
    this.setAllMap(null);
    this.markers = [];
  };

  Map.prototype.centerZoom = function (origin, zoom) {
    this.map.setCenter(origin);
    this.map.setZoom(zoom);
  };

  /**
   * For a list of markers, zoom to the bounding box that contains them.
   */
  Map.prototype.zoomMarkers = function () {
    var i, l, marker, lat, lng, position, latLngList, bounds;
    latLngList = [];
    for (i = 0, l = this.markers.length; i < l; i++) {
      marker = this.markers[i];
      lat = marker.position.lat();
      lng = marker.position.lng();
      position = new google.maps.LatLng(lat, lng);
      latLngList.push(position);
    }
    bounds = new google.maps.LatLngBounds();
    for (i = 0, l = latLngList.length; i < l; i++) {
      bounds.extend(latLngList[i]);
    }
    this.map.fitBounds(bounds);
  };

  /**
   * STORE LOCATOR CONSTRUCTOR
   * Decided to break from the old store locator code and have an object each
   * for the locator and map with a bunch of functions that help glue them
   * together. Locator holds all of the store data and related methods.
   */

  Locator = function (options) {
    map = new Map($(options.node.map)[0], this.defaultMapOpts);
    this.makeImageArray(this.loadImages);
    this.defaultParams = { use_filters: 1 };
    this.options = {};
    util.merge(this.options, options);
    return this;
  };

  /**
   * Default locator map options.
   * @type {Object}
   */
  Locator.prototype.defaultMapOpts = {
    defaultOrigin: new google.maps.LatLng(51.509946, -0.126944),
    ICON_PATH: 'images/',
    center: new google.maps.LatLng(51.509946, -0.126944),
    zoom: 10,
    scrollwheel: true,
    mapTypeControl: true,
    streetViewControl: false,
    overviewMapControl: true,
    zoomControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    },
    zoomControlOptions: { style: google.maps.ZoomControlStyle.SMALL }
  };

  Locator.prototype.destinations = function () {
    var locations, destinations, i, l, store, lat, lon;
    destinations = [];
    locations = this.stores;
    for (i = 0, l = locations.length; i < l; i++) {
      store = locations[i];
      lat = store.location.lat;
      lon = store.location.lon;
      destinations.push(new google.maps.LatLng(lat, lon));
    }
    return destinations;
  };

  Locator.prototype.getStoreData = function (url, data) {
    return $.ajax({
      type: 'GET',
      url: url,
      data: data,
      async: false,
      jsonpCallback: 'jsonp',
      dataType: 'jsonp'
    });
  };

  Locator.prototype.mergeDestinations = function (res) {
    var matches, i, l;
    matches = jsonPath(res, '$..elements')[0];
    for (i = 0, l = matches.length; i < l; i ++) {
      this.stores[i].googleOrigin = matches[i];
    }
    this.sortStores('googleOrigin.duration.value');
    this.showStoresInfo();
  };

  /**
   * Uses util sortArrayOfObjects to sort the store array based on
   * a particular property.
   * @param  {[type]} sortBy [description]
   * @return {[type]}        [description]
   */
  Locator.prototype.sortStores = function (sortBy) {
    util.sortArrayOfObjects(sortBy, this.stores);
  };

  /**
   * Returns a template from a template-type.
   * @param  {String} type Template type.
   * @return {Array}       Template.
   */
  Locator.prototype.template = function (type) {
    if (type === 'postcodeError') {
      return [
        '<div class="postcodeError">',
        '<div class="error">#{error}</div>',
        '</div>'
      ];
    }
    if (type === 'storeInfo') {
      return [
        '<div id="store#{number}" data-number="#{number}" class="storeInfo infoClosed">',
        '<div class="heading">',
        '<div class="number" data-number="#{number}"><img src="#{icon}"/></div>',
        '<div class="town">#{town}</div>',
        '<div class="route">Route</div>',
        '<div class="zoom">Zoom</div>',
        '</div>',
        '<div class="table">',
        '<table>',
        '<tr><td class="label">Driving distance</td>',
        '<td>#{miles} mi / #{kilometers} km</td></tr>',
        '<tr><td class="label">ETA</td><td>#{eta}</td></tr>',
        '<tr><td class="label">Address</td><td>#{address}</td></tr>',
        '<tr><td class="label">Description</td><td>#{description}</td></tr>',
        '</table>',
        '</div>',
        '</div>'
      ];
    }
    if (type === 'instruction') {
      return [
        '<div class="instructions">',
        '<h4>Directions to #{town}</h4>',
        '<table>',
        '#{instructions}',
        '</table>',
        '</div>'
      ];
    }
    if (type === 'instructionLine') {
      return [
        '<div class="line">',
        '<tr>',
        '<tr>',
        '<td class="step">#{step}</td>',
        '<td class="label">#{distance} / #{duration}</td>',
        '<td>#{instructions}</td>',
        '</tr>',
        '</div>'
      ];
    }
    if (type === 'address') {
      return [
        '#{name},<br/>',
        '#{address1},<br/>',
        '#{address2},<br/>',
        '#{town},<br/>',
        '#{postcode},<br/>',
        '#{region}.'
      ].join('');
    }
  };

  /**
   * Simple method to convert miles to kilometers.
   * @param  {Float} val  Miles.
   * @return {Float}        Kilometers.
   */
  Locator.prototype.convertToKilometers = function (val) {
    return (val * 1.609344).toFixed(2);
  };

  Locator.prototype.zoomToMarker = function (pos) {
    map.zoomToMarker(pos);
  };

  /**
   * For each store in locator.stores concatonate its store information
   * using a template and output the html.
   */
  Locator.prototype.showStoresInfo = function () {
    var
      i, l, storeObject, store, storeTemplate, html, address, number,
      miles, kilometers, addressTemplate;

    storeTemplate = this.template('storeInfo');
    addressTemplate = this.template('address');
    html = '';

    for (i = 0, l = this.stores.length; i < l; i++) {

      store = this.stores[i];
      miles = parseFloat(store.googleOrigin.distance.text).toFixed(2);
      kilometers = this.convertToKilometers(miles);
      number = i + 1;
      address = addressTemplate
        .replace('#{name}', store.address.name)
        .replace('#{address1}', store.address.address1)
        .replace('#{address2}', store.address.address2)
        .replace('#{town}', store.address.town)
        .replace('#{postcode}', store.address.postcode)
        .replace('#{region}', store.address.region);

      storeObject = {
        number: number,
        icon: 'images/number_#{number}.png'.replace('#{number}', number),
        town: store.address.town,
        miles: miles,
        kilometers: kilometers,
        eta: store.googleOrigin.duration.text,
        description: store.extra.location_description,
        address: address
      };

      html += util.applyTemplate(storeTemplate, storeObject);

    }

    util.get('info').innerHTML = html;
  };

  /**
   * Add the origin object to locator.
   * @param  {Object} locationObj Contains postcode, latlng coords,
   *                              and a latlng object.
   */
  Locator.prototype.addOrigin = function (locationObj) {
    this.origin = locationObj;
  };

   /**
    * Pulls the travel time between origin and markers and stores them
    * in locator. This uses Googles distance matrix service. We use this
    * service because for consitency (eg. byBox calculations only appear to do
    * as-the-crow-flies math, where-as Google doesn't.)
    */
  Locator.prototype.calculateTravelTime = function (callback) {
    var origin, service, options, self;
    self = this;
    origin = this.origin.latLng;
    options = {
      origins: [origin],
      destinations: this.destinations(),
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidHighways: false,
      avoidTolls: false
    };
    service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(options, function(res, status) {
      self.mergeDestinations(res, status);
      callback();
    });
  };

  /**
   * Uses map.getCoords to pull the latlng coords for the postcode (origin).
   * @param  {String}   postcode Postcode (origin).
   * @param  {Function} callback Callback.
   */
  Locator.prototype.getLocatorOrigin = function (postcode, plotMap) {
    map.getCoords(postcode, function (data) {
      var obj;
      obj = {
        postcode: postcode,
        coords: data,
        latLng: new google.maps.LatLng(data.lat, data.lng)
      };
      plotMap(obj);
    });
  };

  /**
   * Opens and closes the store info boxes.
   * @param  {Node} el The selected storeInfo element.
   */
  Locator.prototype.openCloseStoreInfo = function (number) {
    var easeOut, easeIn, isOpen, $el;

    $el = $('#store' + number);

    easeIn = {
      bottomMargin: '1px solid #FFFFFF',
      margin: '0 0 0 0',
      borderRadius: '0px'
    };

    easeOut = {
      bottomMargin: '1px solid #dfdfdf',
      margin: '12px 0 12px 0',
      borderRadius: '9px'
    };

    $el.toggleClass('infoClosed');
    $el.toggleClass('infoOpen');
    isOpen = $el.hasClass('infoOpen');

    if (isOpen) {
      $el.animate(easeOut, 300);
      $el.find('.table').show();
    } else {
      $el.animate(easeIn, 300);
      $el.find('.table').hide();
    }
  };

  /**
   * The main function that updates the map. It deletes existing layers,
   * calculates the proper travel timings for each marker from the origin,
   * and after that is complete - through a callback - plots the store
   * and origin markers using a callback function that open and closes the
   * store info when a marker is clicked, and zooms to the bounds of the markers.
   */
  Locator.prototype.updateMap = function () {
    var self;
    self = this;
    map.deleteOverlays();
    this.calculateTravelTime(function () {
      map.addStoreMarkers(self.stores, self.openCloseStoreInfo);
      map.plotOrigin(self.origin.latLng);
      map.zoomMarkers();
    });
  };

  /**
   * Pushes the data to the locator object, applies the limit to the data
   * if it is test data (this can be removed when byBox is back online),
   * and preprocesses the latLng coords for easy access to the rest of
   * the locator methods.
   * @param  {Object} data    The store dataset.
   * @param  {Object} options User submitted options.
   */
  Locator.prototype.populateStores = function (options) {
    var i, l, store, lat, lng;
    if (this.stores.length > options.limit - 1) {
      this.stores = this.stores.slice(0, options.limit);
    }
    for (i = 0, l = this.stores.length; i < l; i++) {
      store = this.stores[i];
      lat = store.location.lat;
      lng = store.location.lon;
      store.location.latLng = new google.maps.LatLng(lat, lng);
    }
  };

  Locator.prototype.showPostcodeErrorMsg = function (err) {
    var template, error;
    template = this.template('postcodeError');
    error = util.applyTemplate(template, { error: err });
    $('#info').append(error);
  };

  Locator.prototype.processStoreData = function (data, callback) {
    if (data.errors.length > 0) {
      $(this.options.node.storeInfo).empty();
      this.showPostcodeErrorMsg(data.errors[0]);
      //map.centerZoom(map.map.defaultOrigin, 10);
    } else {
      this.stores = data.stores;
      callback();
    }
  };

  /**
   * Gets a list of stores using the submitted postcode.
   * The postcode is converted to latlng coords and stored in locator,
   * and then the data is collected, processed and the map updated.
   * @param  {Object}   options  Store-type (merchant, bybox), records count,
   *                             and postcode.
   */
  Locator.prototype.processSearch = function () {

    var params, self, node, postcode, type, limit,
        validPostcode, options, endpoint;

    self = this;
    node = this.options.node;
    postcode = $(node.postcode).val().toUpperCase();
    validPostcode = this.validatePostcode(postcode);
    if (validPostcode.ok) {
      type = $('input[name="' + this.options.radioClass + '"]:checked').val();
      limit = $(node.limit).val();
      options = {
        type: type,
        limit: limit,
        postcode: validPostcode.postcode
      };
      endpoint = this.options.endpoint[type];
      this.getLocatorOrigin(options.postcode, function (obj) {
        self.addOrigin(obj);
        params = util.merge(self.defaultParams, options);
        self.getStoreData(endpoint, params).then(function (data) {
          self.processStoreData(data, function() {
            self.populateStores(options);
            self.updateMap();
            $(self.options.node.instructions).empty();
            $(self.options.node.storeInfo).show();
          });
        });
      });
    } else {
      console.log('Postcode invalid.');
    }
  };

  /**
   * Preload the images referenced  in makeImageArray.
   * @param  {Array} arr Image array.
   */
  Locator.prototype.loadImages = function (arr) {
    var i, l, image;
    for (i = 0, l = arr.length; i < l; i++) {
      if (arr[i] !== undefined) {
        image = new Image();
        image.src = arr[i];
      }
    }
    console.log('Images loaded.');
  };

  /**
   * Create an array of images to be preloaded. Included the origin marker,
   * and the first 20 marker images stored in the data folder.
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  Locator.prototype.makeImageArray = function (callback) {
    var arr, path, i, l, filename;
    path = this.defaultMapOpts.ICON_PATH;
    arr = [];
    for (i = 1, l = 20; i <= l; i++) {
      filename = 'number_' + i + '.png';
      arr[i] = path + filename;
    }
    arr.push(path + 'origin.png');
    callback(arr);
  };

  /**
   * When a store route icon is clicked, use the location of that store
   * to build an instruction list using Google's directions service.
   * @param  {Object}   params   Set of params currently limited to
   *                             marker number and town.
   * @param  {Function} callback Callback function.
   */
  Locator.prototype.requestDirections = function (params, callback) {

    var
      arrLoc, originLat, originLng, origin,
      destLat, destLng, destination, town,
      steps, i, l, step, instructionTemplate,
      instructionLineTemplate, o, html, instructions, self;

    self = this;
    arrLoc = params.number - 1;
    town = params.town;

    originLat = this.origin.coords.lat;
    originLng = this.origin.coords.lng;
    origin = new google.maps.LatLng(originLat, originLng);
    destLat = this.stores[arrLoc].location.lat;
    destLng = this.stores[arrLoc].location.lon;
    destination = new google.maps.LatLng(destLat, destLng);

    map.directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    }, function(res) {

        map.directionsDisplay.setDirections(res);
        steps = res.routes[0].legs[0].steps;
        instructions = '';
        html = '';
        instructionTemplate = self.template('instruction');
        instructionLineTemplate = self.template('instructionLine');

        for (i = 0, l = steps.length; i < l; i++) {
          step = steps[i];
          o = {
            step: i + 1,
            instructions: step.instructions,
            distance: step.distance.text,
            duration: step.duration.text
          };
          instructions += util.applyTemplate(instructionLineTemplate, o);
        }

        html = util.applyTemplate(instructionTemplate, {
          town: town,
          instructions: instructions
        });

        callback(html);

    });

  };

  /**
   * Simple function to validate submitted postcodes. First it corrects the
   * postcode to include a space is one wasn't included, then it parses the
   * postcode. An object with the reformatted postcode and the test value is
   * returned.
   * @param  {String}   postcode Submitted postcode.
   * @return {Boolean}           Is the postcode valid?
   */
  Locator.prototype.validatePostcode = function (postcode) {
    var regex, idx;
    if (postcode.indexOf(' ') < 0) {
      idx = postcode.length === 6 ? 3 : 4;
      postcode = postcode.slice(0, idx) + ' ' + postcode.slice(idx);
    }
    regex = new RegExp([
      '^\\d{5}(-\\d{4})?|([A-PR-UWYZa-pr-uwyz0-9]',
      '[A-HK-Ya-hk-y0-9][AEHMNPRTVXYaehmnprtvxy0-9]?',
      '[ABEHMNPRVWXYabehmnprvwxy0-9]{0,2}',
      '[ ][0-9][ABD-HJLN-UW-Zabd-hjln-uw-z]{2}|(GIRgir){3} 0(Aa){2})$'
      ].join(''));
     return {postcode: postcode, ok: regex.test(postcode)};
  };

  Locator.prototype.reset = function () {
    $(this.options.node.postcode).val('');
    $(this.options.node.instructions).empty();
    $(this.options.node.storeInfo).empty();
    return this;
  };

  window.Locator = Locator;

}());