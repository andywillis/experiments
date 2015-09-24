/*global Venda, jQuery, alert, console, $, util: true */
/*jslint browser: true */
/*jslint white: true */
/*jslint bitwise: true */
/*jslint plusplus: true */
/*jslint indent: 2 */
/*jslint maxlen: 100 */
/*jslint vars: false */
/*jslint todo: true */

/**
 * Minicart Detail 1.0
 * Copyright Venda 2013.
 * ---------
 * VERSION HISTORY
 * 1.0  230813  First implementation.
 * ---------
 * DEPENDANCIES
 * ---------
 * jQuery.1.8.3.js, util-0.0.1.js.
 * ---------
 */
(function(Venda, $) {
  'use strict';

  var MCD, options, Atts;

  /**
   * Options for the minicart constructor.
   * -----
   * ENDPOINTS - either concrete links, or DOM node references.
   * -----
   * details:             The minicart details page (AJAX)
   * basket:              The Venda basket page.
   * checkout:            The Venda checkout page.
   * addProduct:          The add product workflow (AJAX).
   * -----
   * NODES - the responsive showcase has one minicart that is updated in two
   *         different places in the HTML, the first in the header for the
   *         dropdown, the second in the offcanvas nav. They share the same
   *         classes (see: general) so that both areas can be updated at once
   *         when new minicart data is loaded. Otherwise they have different
   *         ids identifying them.
   * -----
   * general:             The wrapper and details classes for both minicart
   *                      areas.
   * dropdown:            Specific node description for the dropdown minicart,
   *                      comprising the node to which it's attached, the main
   *                      wrapper, and the content, details, header
   *                      and footer sections.
   * offcanvas:           The wrapper for the offcanvas minicart.
   * buttonUp:            Top scroll button.
   * buttonDown:          Bottom scroll button.
   * form:                Product form.
   * totalItems:          The node holding the item count
   * totalItemsTiny:      The node holding the item text (mobile)
   * totalItemsText:      The node holding the item text
   * totalPrice:          The node holding the total price.
   * addProduct:          The add to basket button.
   * productUpdate:       The node that wraps the 'add' buttons.
   * productUpdateMulti:  The node that wraps the 'add' buttons.
   * quantity:            The node holding the submitted quantity value.
   * notifyTemplate:      The node holding the notification template.
   * notify:              The node holding the notification when it appears.
   * productName:         The node holding the product name value.
   * attStyles:           The product attribute format (dropdown, swatch,
   *                      halfswatch).
   * labels:              List of attribute labels for use in the notification.
   * -----
   * OTHER - user-adjustable options.
   * -----
   * device:              Device type used to view the page.
   * durations:           Various durations used for interval evaluations.
   * showAfterAddProd:    Does the minicart appear after a product has been
   *                      added.
   * showNotifications:   Toggle to turn on/off the notifications.
   * appendNotify:        Signifies whether the notification is to be appended
   *                      to the productUpdate node. If false, it is prepended.
   * highlight:           Highlighting on/off.
   * scrollSpeed:         Scroll speed of the up/down scroll buttons when the
   *                      mousebutton is held down. Usually set to 40.
   * autoload:            Load the minicart on page load.
   * animOpen:            Use a sliding action to open the dropdown minicart.
   * largeDeviceSmoothScroll:  Allows users of desktop devices to hold the mouse
   *                           button down for smooth scrolling.
   *                           
   */

  options = {
    endpoint: {
      details: '/page/home&layout=minicart',
      basket: '/bin/venda?ex=co_wizr-shopcart&bsref=shop&log=22',
      checkout: '#tag-checkoutlink',
      addProduct: '#tag-codehttp'
    },
    node: {
      general: {
        wrapper: '.minicartDetailWrapper',
        details: '.basketholder'
      },
      dropdown: {
        attachedTo: '#basketSection',
        wrapper: '#basketSection .minicartDetailWrapper',
        header: '#basketSection #header',
        footer: '#basketSection #footer',
        content: '#basketSection #basketWrapper, #basketSection #minicart_empty',
        details: '#basketSection .basketholder'
      },
      offCanvas: {
        wrapper: '#js-canvas-content-right .minicartDetailWrapper'
      },
      buttonUp: '.buttonUp',
      buttonDown: '.buttonDown',
      form: '#addproductform',
      totalItems: '#basketSection .js-updateItems',
      totalItemsTiny: '.js-canvas-right .js-updateTotalMini',
      totalItemsText: '.js-updateItemsText',
      totalPrice: '#basketSection .js-updateTotal',
      addProduct: '.js-addproduct',
      minicartHeaderText: '.minicart-header-text',
      productUpdate: '.prod-detail-buttons',
      productUpdateMulti: '.js-buyControlsMulti',
      quantity: 'input[name="qty"]',
      notify: '#addproductform #notify',
      notifyTemplate: '#notifyTemplate',
      productName: '#tag-invtname',
      attStyles: '.js-attributesForm',
      labels: '#attributeNames'
    },
    device: util.checkDevice(),
    duration1: 250,
    duration2: 3000,
    duration3: 5000,
    duration4: 500,
    scrollSpeed: 40,
    showAfterAddProd: false,
    showNotifications: true,
    appendNotify: false,
    highlight: true,
    autoload: false,
    animOpen: true,
    largeDeviceSmoothScroll: true
  };

  /**
   * Sets up the minicartdetail constructor. Uses util.merge to merge
   * the options object to 'this'.
   * @param  {Object} options An object containing the main options.
   */
  Venda.MinicartDetail = function (options) {
    util.merge(this, options);
    this.minicartLoaded = false;
    this.visible = false;
    this.productIds = {};
    this.multiForm = false;
    this.multiFormType = false;
    this.multiTest = ['productdetailSet', 'productset'];
    this.largeDevices = ['standard', 'large', 'tablet'];
    this.checkboxes = {};
    this.device = util.checkDevice();
    if (this.autoload) { this.loadMinicartHtml(); }
  };

  /**
   * Shortcuts.
   */
  MCD = Venda.MinicartDetail.prototype;
  Atts = Venda.Attributes;

  /**
   * Load the minicart content. Note that this loads the minicart data into
   * two sections identified by the general wrapper class specified in the
   * options - the dropdown minicart and the off-canvas minicart. The 'loaded'
   * variable is there to prevent from the dropdown minicart from closing on
   * immediately opening if the showAfterAddProd is true.
   * @param  {[type]} timer [description]
   */
  MCD.loadMinicartHtml = function (highlight, update, callback) {
    var self, loader, $wrapper, loaded;
    self = this;
    loaded = 0;
    this.minicartLoaded = false;
    loader = this.template('loader').join('');
    $wrapper = $(this.node.general.wrapper);
    if (this.device === 'mobile') { $wrapper.empty().append(loader); }
    $wrapper.load(this.endpoint.details, function () {
        loaded++;
        self.cacheProductIds();
        self.minicartLoaded = true;
        if (loaded < 2 && update && self.showAfterAddProd) {
          self.toggleVisibility();
        }
        if (highlight && self.highlight) {
          self.highlightProduct(highlight);
        }
        if (callback) { callback(); }
      });
  };

  /**
   * Highlights the background of an added product in the minicart
   * if the option has been selected.
   * @param  {String} highlight Id of the added product.
   */
  MCD.highlightProduct = function (highlight) {
    var $el, position;
    $el = $(this.node.dropdown.details).find('li.minicart-' + highlight);
    $el.addClass('minicartHighlight');
    position = $el.position();
    this.scrollMinicartDetails(null, position.top);
  };

  /**
   * Cache the product ids when the page is first loaded.
   * This is necessary for the remove-tem functionality to work - once
   * the minicart is reloaded again (when an item is added or removed)
   * the new delete-line ids will not work. Caching the original ids and then
   * repopulating them (populateProductIds) prevents this. The cached ids are
   * stored under the product 'hash'. e.g. cla000bla7r.
   */
  MCD.cacheProductIds = function () {
    var $hidden, obj, i;
    obj = {};
    $hidden = $(this.node.general.details).find('.hiddenfields');
    $hidden.each(function () {
      var hash, id;
      id = $(this).find('[name="line-id"]').val();
      hash = $(this).find('[name="hash"]').val();
      obj[hash] = id;
    });
    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (!this.productIds[i]) {
          this.productIds[i] = obj[i];
        }
      }
    }
  };

  /**
   * Serves the minicartdetail templates. Used so that we don't have HTML
   * concatonation clogging up the code. Only used in conjunction with the
   * util.applyTemplate method.
   * @param  {String} template Template name.
   */
  MCD.template = function (template) {
    var obj;
    obj = {
      alert: [
        '<div id="notify" class="box box-section">',
        '<div class="box-header alert">Oops!</div>',
        '<div class="box-body alert">',
        '<div class="row">',
        '<div class="large-24 columns">',
        '#{alert}',
        '</div>',
        '</div>',
        '</div>',
        '</div>'
      ],
      detailsLine: [
        '<span class="bold">#{label}:</span> #{select}'
      ],
      multicheckbox: [
        '<label>#{text} ',
        '<input type="checkbox" id="checkAllProducts" />',
        '</label>'
      ],
      loader: [
        '<div class="canvas-loading">',
        '<i class="icon-loader icon-spin icon-2x"></i>',
        '<span>Please wait...</span>',
        '</div>'
      ]
    };
    return obj[template];
  };

  /**
   * When the minicart summmary or the minicartdetail close button is
   * clicked, and the device is a desktop or greater, this works out
   * whether to open or close the minicartdetails.
  */
  MCD.toggleVisibility = function () {
    var isDesktop, self, checkDevice;
    self = this;
    checkDevice = util.checkDevice();
    this.device = (checkDevice === undefined) ? 'large' : checkDevice;
    isDesktop = this.largeDevices.contains(this.device);
    if (isDesktop) {
      if (this.visible) {
        this.visible = false;
        this.toggleMinicart('close');
      } else {
        this.visible = true;
        if (!this.minicartLoaded) {
          this.loadMinicartHtml(null, null, function () {
            self.setPosition();
            self.toggleMinicart('show');
          });
        } else {
          this.setPosition();
          this.toggleMinicart('show');
        }
      }
    }
  };

  /**
   * Hides selected minicart elements from view.
   */
  MCD.hideElements = function () {
    var elements, i, l;
    elements = Array.prototype.slice.call(arguments);
    for (i = 0, l = elements.length; i < l; i++) {
      elements[i].css({
        opacity: 0,
        visibility: 'hidden'
      }).animate({opacity: 0});
    }
  };

  /**
   * Reveals selected minicart elements.
   */
  MCD.showElements = function () {
    var elements, i, l;
    elements = Array.prototype.slice.call(arguments);
    for (i = 0, l = elements.length; i < l; i++) {
      elements[i].css({
        opacity: 0,
        visibility: 'visible'
      }).animate({ opacity: 1.0 });
    }
  };

  /**
   * Preps elements for reveal.
   */
  MCD.prepareElements = function () {
    var elements, i, l;
    elements = Array.prototype.slice.call(arguments);
    for (i = 0, l = elements.length; i < l; i++) {
      elements[i].css({ opacity: 0, visibility: 'visible'});
    }
  };

  /**
   * Displays the minicart either immediately, or using
   * a sliding animation.
   */
  MCD.showMinicart = function () {
    var $content, $footer, $wrapper, self, height;
    self = this;
    $wrapper = $(this.node.dropdown.wrapper);
    $footer = $(this.node.dropdown.footer);
    $content = $(this.node.dropdown.content);
    height = $footer.position().top + $footer.outerHeight();
    if (this.animOpen) {
      this.hideElements($content, $footer);
      this.prepareElements($wrapper);
      $wrapper.css({ opacity: 1.0 });
      $wrapper.animate({
        height: height
      }, this.duration1, function () {
        self.showElements($content, $footer);
      });
    } else {
      $wrapper.css({ visibility: 'visible', height: height })
        .animate({ opacity: 1.0 }, this.duration1);
    }
  };

  /**
   * Hides the minicart either immediately, or using
   * a sliding animation.
   */
  MCD.hideMinicart = function () {
    var $content, $footer, $wrapper, self;
    self = this;
    $wrapper = $(this.node.dropdown.wrapper);
    $footer = $(this.node.dropdown.footer);
    $content = $(this.node.dropdown.content);
    if (this.animOpen) {
      this.hideElements($content, $footer);
      $wrapper.animate({
        height: 0
      }, this.duration4, function () {
        self.hideElements($wrapper);
      });
    } else {
      this.hideElements($wrapper);
    }
  };

  /**
   * Opens or closes the minicart.
   */
  MCD.toggleMinicart = function (type) {
    if (type === 'show') { this.showMinicart(); }
    if (type === 'close') { this.hideMinicart(); }
  };

  /**
   * Shows or hides the minicart detail depending on what what device
   * the customer is using.
   */
  MCD.updateDisplay = function () {
    var isDesktop;
    this.device = util.checkDevice();
    isDesktop = this.largeDevices.contains(this.device);
    if (isDesktop) {
      this.setPosition('resize');
      $(this.node.el).fadeIn(this.duration1);
    } else {
      $(this.node.el).fadeOut(this.duration1);
    }
  };

  /**
   * Calculate the position of minicartdetail component divs.
   */
  MCD.setPosition = function (type) {
    if (this.visible) {
      this.positionContent();
      this.positionFooter();
      this.positionMinicartDetail(type);
      this.toggleDirectionButtons();
    }
  };

  /**
   * Positions the minicart content wrapper depending on the screen height and its
   * relation to the cart details div.
   */
  MCD.positionContent = function () {
    var $content, $header, detailsHeight, height, mainHeight,
        headerLowerPos;
    $content = $(this.node.dropdown.content);
    $header = $(this.node.dropdown.header);
    detailsHeight = $(this.node.dropdown.details).outerHeight() + 10;
    mainHeight = $(window).height() - $(this.node.dropdown.attachedTo).outerHeight() - 450;
    if (mainHeight > detailsHeight) {
      height = detailsHeight;
    } else {
      height = (mainHeight < 120) ? 120 : mainHeight;
    }
    headerLowerPos = $header.offset().top + $header.outerHeight();
    $content.offset({top: headerLowerPos});
    $content.height(height);
  };

  /**
   * Position the minicartdetail footer in relation to the minicartdetail
   * content wrapper.
   */
  MCD.positionFooter = function () {
    var contentLowerPos, $content, $footer;
    $footer = $(this.node.dropdown.footer);
    $content = $(this.node.dropdown.content);
    contentLowerPos = $content.offset().top + $content.height();
    $footer.offset({top: contentLowerPos});
  };

  /**
   * Position the minicartdetail wrapper along the x and y axis
   * immediately under the attachedTo wrapper. In this case the attachedTo
   * wrapper will be the showcart summary.
   */
  MCD.positionMinicartDetail = function (type) {
    var $wrapper, $attachedTo, $footer, widthDiff;
    $wrapper = $(this.node.dropdown.wrapper);
    $attachedTo = $(this.node.dropdown.attachedTo);
    $footer = $(this.node.dropdown.footer);
    widthDiff = $wrapper.outerWidth() - $attachedTo.outerWidth();
    $wrapper.css({
      top: $attachedTo.position().top + $attachedTo.height(),
      left: -widthDiff
    });
    if (type === 'resize') {
      $wrapper.css({height: $footer.position().top + $footer.outerHeight() });
    }
    if (type === 'removed') {
      $wrapper.animate({
        height: $footer.position().top + $footer.outerHeight()
      }, 500);
    }
  };

  /**
   * Resets the form selects and disables the 'add to basket' button
   * after adding a product.
   */
  MCD.resetForm = function () {
    var $selects, text, $form;
    $form = $(this.node.form);
    text = $(this.node.attStyles).text();
    switch(text) {
      case "dropdown":
        $selects = $form.find('select');
        $selects.each(function () {
          $(this).prop('selectedIndex', 0)
            .trigger('change')
            .trigger('liszt:updated');
          });
      break;
      case "swatch":
        $selects = $form.find('select');
      break;
      case "halfswatch":
      break;
    }
  };

  /**
   * Enable a button.
   * @param  {DOM node} button  The button.
   * @param  {String} text      Value of the button.
   * @param  {String} type      Whether the button is input/anchor.
   */
  MCD.enableButton = function (button, text, type) {
    var $button;
    $button = $(button);
    if (type && type === 'anchor') {
      $button.html(text);
    } else {
      $button.val(text);
    }
    $button.removeAttr('disabled');
    $button.css({ opacity: 1.0 });
    $button.find('i').remove();
  };

  /**
   * Disable a button.
   * @param  {DOM node} button  The button.
   * @param  {String} text      Value of the button.
   * @param  {String} type      Whether the button is input/anchor.
   */
  MCD.disableButton = function (button, text, type) {
    var $button;
    $button = $(button);

    if (type && type === 'anchor') {
      $button.html(text);
    } else {
      $button.val(text);
    }
    $button.append('<i class="icon-loader icon-spin icon-small thinpad-side"></i>');
    $button.attr('disabled', 'disabled');
    $button.css({ opacity: 0.5 });
  };

  /**
   * Submits the product form after a client has clicked the 'add to basket'
   * button. The button is disabled, the form serialised and the form submitted
   * to the url specified in options.endpoint.addProduct. On success the
   * minicart and item totals are updated and, if turned on, any notifications
   * shown. The final 'minicart-items-added' trigger is REQUIRED for tracking.
   */
  MCD.addProduct = function (el) {
    var serialisedForm, $form, self, isValid;
    self = this;
    isValid = this.validate(el);
    if (isValid) {
      $form = $(this.node.form);
      $form.find('input[name="layout"]').val('minicart');
      $form.find('input[name="ex"]').val('co_disp-shopc');
      this.disableButton($(this.node.addProduct), 'Adding to basket', 'anchor');
      this.removeNotify();
      serialisedForm = $form.serializeToLatin1();
      $.ajax({
        type: 'POST',
        global: false,
        url: $(this.endpoint.addProduct).html(),
        data: serialisedForm,
        success: function(html) {
          var highlight, hasAlert;
          hasAlert = $(html).find('.alert-box').length > 0 ? true : false;
          if (!hasAlert) {
            highlight = Atts.dataObj.atrsku;
            self.loadMinicartHtml(highlight, true);
            self.updateTotals(html);
            $('body').trigger('minicart-items-added');
          }
          self.processNotifications(html, $form);
          self.enableButton($(self.node.addProduct), 'Add to basket', 'anchor');
        }
      });
    }
  };

  /**
   * Updates the item total and text on the main page after a product has
   * been added.
   * @param  {[type]} html The returned HTML from addProduct.
   */
  MCD.updateTotals = function (html) {
    var $html, obj;
    obj = {};
    $html = $(html);
    obj.totalItems = $html.find('.js-updateItems').text();
    obj.totalItemsTiny = $html.find('.js-updateTotalMini').text();
    obj.totalItemsText = $html.find('.js-updateItemsText').text();
    obj.totalPrice = $html.find('.js-updateTotal').text();

    $(this.node.totalItems).text(obj.totalItems);
    $(this.node.totalItemsTiny).text(obj.totalItems);
    $(this.node.totalItemsText).text(obj.totalItemsText);
    $(this.node.totalPrice).text(obj.totalPrice);
  };

  /**
   * Takes the returned HTML from addProduct and extracting and showing
   * any warnings. If there are no warnings it 1) shows the minicart if that
   * option is turned on, and 2) shows the product notification, either
   * appended or prepended to the productUpdate node depending on the option.
   * @param  {String}         html    HTML returned by the addProduct method.
   * @param  {jQuery object}  $form   The addProduct form.
   */
  MCD.processNotifications = function (html, $form) {
    var $html, $alert, templateObject, hasAlert;
    $html = $(html);
    $alert = $html.find('.alert-box[data-alert]');
    hasAlert = $alert.length > 0 ? true : false;
    if (this.showNotifications) {
      if (hasAlert) {
        templateObject = {
          alert: $alert.html()
        };
        this.showNotify(templateObject, 'alert');
      } else {
        if (this.multiForm) {
          templateObject = { text: 'Items added to your basket.' };
        } else {
          templateObject = this.createProductNotify($form);
        }
        this.showNotify(templateObject, 'default');
      }
    }
  };

  /**
   * Returns an array of labels for the notification.
   * @return {Array} Set of labels.
   */
  MCD.getLabels = function () {
    var labels;
    labels = [];
    $(this.node.labels).find('div').each(function () {
      var text;
      text = $(this).text();
      if (text) { labels.push(text); }
    });
    return labels;
  };

  /**
   * Creates the new product notification from the information contained in
   * the submitted addProduct form. It returns an template object that can
   * be used by util.applyTemplate.
   * @param  {[type]} $form [description]
   * @return {[type]}       [description]
   */
  MCD.createProductNotify = function($form) {

    var product, quantity, details, attribute, attr,
        $choice, select, label, i, l, o, template, labels, obj;

    product = $(this.node.productName).text();
    quantity = $form.find(this.node.quantity).val();
    labels = this.getLabels();
    if ($('.js-attributesForm').length > 0) {
      template = this.template('detailsLine');
      details = '';
      for (i = 0, l = labels.length-1; i < l; i++) {
        attr = i + 1;
        attribute = '[name="att' + attr + '"]';
        if (attribute && attribute.length > 0) {
          $choice = $form.find(attribute);
          select = $choice.val();
          label = labels[i];
          o = { label: label, select: select };
          details += util.applyTemplate(template, o);
          /* cloggs only shows size attribute
          if (i < labels.length - 1) { details += ', '; }*/
        }
      }
      obj = {
        quantity: quantity,
        product: product,
        details: details,
        basketUrl: this.endpoint.basket,
        checkoutUrl: $(this.endpoint.checkout).text()
      };
    } else {
      obj = {
        quantity: quantity,
        product: product,
        basketUrl: this.endpoint.basket,
        checkoutUrl: $(this.endpoint.checkout).text()
      };
    }
    return obj;
  };

  /**
   * Removes the notification from the page.
   */
  MCD.removeNotify = function () {
    $(this.node.notify)
      .animate({ height: 0 }, {
        duration: this.duration1,
        complete: function() { $(this).remove(); }
      });
  };

  /**
   * Shows a notification. Either a warning notification, or the
   * product notification. Appended or prepended to the productUpdate node as
   * specified in the options.
   * @param  {Object} templateObject The template object for use in
   *                                 util.applyTemplate.
   */
  MCD.showNotify = function(templateObject, type) {
    var html, template, attachedTo, node, $template;
    if (type === 'default') {
      $template = $(this.node.notifyTemplate);
      if (!this.multiForm) { $template.find('#js-notify-text').empty(); }
      if (this.multiForm || $('.js-attributesForm').length === 0) {
        $template.find('#js-notify-details').empty();
      }
      template = $template.html();
    } else {
      template = this.template(type);
    }
    html = util.applyTemplate(template, templateObject);
    node = this.node;
    attachedTo = this.multiForm ? node.productUpdateMulti : node.productUpdate;
    if (this.appendNotify) {
      $(html).insertAfter($(attachedTo));
    } else {
      $(html).insertBefore($(attachedTo));
    }
  };

  /**
   * Turns the minicart scroll buttons on/off depending on the position of the
   * minicart details.
   */
  MCD.toggleDirectionButtons = function () {
    var $content, position, height, scrollHeight, $up, $down, totalItems;
    $content = $(this.node.dropdown.content);
    $up = $(this.node.buttonUp);
    $down = $(this.node.buttonDown);
    position = $content.scrollTop();
    scrollHeight = $content[0].scrollHeight;
    height = $content.outerHeight();
    totalItems = parseInt($(this.node.totalItems).html(), 10);
    if (totalItems > 0) {
      $up.removeClass('off').addClass('on');
      $down.removeClass('off').addClass('on');
      if (position <= 0) {
        $up.removeClass('active').addClass('inactive');
        this.scrollStop();
      }
      if (position > 0) {
        $up.removeClass('inactive').addClass('active');
      }
      if (position >= scrollHeight - height) {
        $down.removeClass('active').addClass('inactive');
        this.scrollStop();
      }
      if (position < scrollHeight - height) {
        $down.removeClass('inactive').addClass('active');
      }
    } else {
      $up.removeClass('on').addClass('off');
      $down.removeClass('on').addClass('off');
    }
  };

  /**
   * Scrolls the minicart details up or down depending on which of the scroll
   * buttons was clicked.
   * @param  {String} direction Up/down.
   */
  MCD.scrollMinicartDetails = function (direction, highlightPos) {
    var pos, $wrapper, speed;
    $wrapper = $(this.node.dropdown.content);
    pos = $wrapper.scrollTop();
    if (direction) {
      speed = this.scrollSpeed;
      $wrapper.scrollTop(direction === 'up' ? pos - speed : pos + speed);
    } else {
      $wrapper.scrollTop(highlightPos);
    }
    this.setPosition();
  };

  /**
   * Required method to allow the scrolling to function while
   * keeping the mouse button held down.
   * @param  {[type]} direction Up/down.
   */
  MCD.scrollStart = function (direction) {
    var self;
    self = this;
    if (['mobile', 'tablet'].contains(this.device) || !this.largeDeviceSmoothScroll) {
      this.scrollMinicartDetails(direction);
    } else {
      this.scrollInterval = setInterval(function () {
        self.scrollMinicartDetails(direction);
      }, 100);
    }
  };

  /**
   * Required method to allow the scrolling to function while
   * keeping the mouse button held down.
   */
  MCD.scrollStop = function () {
    if (this.largeDeviceSmoothScroll) {
      clearInterval(this.scrollInterval);
    }
  };

  /**
   * Populates the ids of each of the items in the minicart from the
   * copies cached when the page was first loaded in order to allow the
   * remove-item functionality to properly work. In summary, the method runs
   * through each of the inputs for each of an item's hiddenInputs div
   * replacing the current id found in [name="line-id"] with the cached copy
   * found in this.productids under the key represented by the
   * product hash [name="hash"], e.g. cla000bla7r.
   */
  MCD.populateProductIds = function () {
    var $hidden, self;
    self = this;
    $hidden = $(this.node.general.details).find('.hiddenfields');
    $hidden.each(function () {
      var hash, id, $this, $input;
      $this = $(this);
      id = $this.find('[name="line-id"]').val();
      hash = $this.find('[name="hash"]').val();
      if (self.productIds[hash]) {
        $input = $this.find('input');
        $input.each(function () {
          var name, value, regex, $this;
          $this = $(this);
          name = $this.attr('name');
          value = $this.attr('value');
          regex = new RegExp('\\*|' + id, 'g');
          $this.attr('name', name.replace(regex, self.productIds[hash]));
          $this.attr('value', value.replace(regex, self.productIds[hash]));
        });
      }
    });
  };

  /**
   * Builds a new form for the purposes of removing an item from the minicart.
   * This is done by creating a form element and appending the inputs from
   * the product's hiddenInput div, and appending new inputs to the form
   * representing each item of that product required.
   * @param  {DOM node}   el        Clicked anchor of the item to be removed.
   * @param  {Function}   callback  Pass the new form to the callback
   *                                for processing.
   */
  MCD.createItemRemovalForm = function (el, callback) {
    var $hidden, $normal, $dataline, numberStart, quantity, i, l,
        lineid, $form, template;
    $form = $('<form id="deleteitem"></form>');
    $hidden = $(el).closest('.prod-details').find('.hiddenfields');
    $normal = $hidden.find('input.normal');
    $dataline = $hidden.find('input.dataline');
    $normal.appendTo($form);
    $dataline.appendTo($form);
    lineid = $normal.filter('[name="line-id"]').val();
    numberStart = parseInt($normal.filter('[name="numberstart"]').val(), 10);
    quantity = parseInt($normal.filter('[name="quantity"]').val(), 10);
    template = '<input name="oirfnbr-id-#{lineid}" value="#{i}"/>';
    for (i = numberStart, l = numberStart + quantity; i < l; i++) {
      template.replace('#{lineid}', lineid).replace('#{i}', i);
      $(template).appendTo($form);
    }
    callback($form);
  };

  /**
   * Remove an item from the minicart. Populate the product ids from the cache,
   * create the a new form from the product's hiddenInputs div, and submit
   * the form. This ajax call must use async: false due to it being a
   * rediret. This blocks the execution of the code leading to an
   * interesting DOM related issue in IE and Chrome - the button does not
   * disable until after the ajax call which isn't particularly responsive.
   * Strangely, this doesn't happen in Firefox. To counteract this problem,
   * a brief timeout has been inserted.
   * @param  {COM node} el    Clicked anchor of the item to be removed.
   */
  MCD.removeItem = function (el) {
    var self;
    self = this;
    this.disableButton(el, 'Removing', 'anchor');
    this.populateProductIds();
    setTimeout(function () {
      self.createItemRemovalForm(el, function (form) {
        $.ajax({
          type: 'POST',
          async: false,
          url: '/bin/venda',
          data: form.serialize(),
          success: function (html) {
            self.loadMinicartHtml(null, null, function () {
              self.setPosition('removed');
              self.updateTotals(html);
            });
          }
        });
      });
    }, 10);
  };

  /**
   * Runs through the necessary steps if this is a multi-product; adding
   * and initialising new checkboxes, then resetting them.
   * @param  {[type]} type The attributeForm id / page type.
   */
  MCD.checkMultipage = function (type) {
    var check;
    check = this.multiTest.contains(type);
    this.multiFormType = type;
    if (check) {
      this.multiForm = check;
      this.addCheckAllBox();
      this.initCheckboxes();
      this.toggleAllProducts(false);
    }
  };

  /**
   * Displays the checkboxes in a multi-product page.
   * @param  {[type]} type [description]
   */
  MCD.initCheckboxes = function () {
    $('.js-addToCheckBoxLabel').css('display', 'block');
    $('.js-addToCheckBox').each(function () {
      $(this).removeAttr('checked');
    });
    $('#checkAllProducts').removeAttr('checked');
  };

  /**
   * Add the checkAll box in a multi-product page.
   */
  MCD.addCheckAllBox = function () {
    var text, label, template;
    text = $('#attributes-addAllProduct').text();
    template = this.template('multicheckbox');
    label = util.applyTemplate(template, { text: text });
    $('.js-buyControlsMulti').prepend(label);
  };

  /**
   * Return an object containing the id and unique id for a checkbox
   * depending on multipage-type.
   * @param  {DOM node} el  Element.
   * @return {Object}       Contains the element id and unique id.
   */
  MCD.getCheckboxUid = function (el) {
    var id, uid, type, $el;
    $el = $(el);
    id = $el.attr('id');
    type = this.multiFormType;
    if (type !== 'productdetailMulti') {
      uid = $el.closest('.js-oneProduct').attr('id').substr(11);
    } else {
      uid = id;
    }
    return {id: id, uid: uid};
  };

  /**
   * Enables a checkbox and its attributes.
   * @param  {DOM node} el Checkbox.
   */
  MCD.enableCheckbox = function (el) {
    var obj;
    obj = this.getCheckboxUid(el);
    this.checkboxes[obj.uid] = true;
    $('#itemlist_' + obj.id).removeAttr('disabled');
    $('#qtylist_' + obj.id).removeAttr('disabled');
    this.checkCheckAllBox();
  };

  /**
   * Disables a checkbox and its attributes.
   * @param  {DOM node} el Checkbox.
   */
  MCD.disableCheckbox = function (el) {
    var obj;
    obj = this.getCheckboxUid(el);
    this.checkboxes[obj.uid] = false;
    $('#itemlist_' + obj.id).attr('disabled', true);
    $('#qtylist_' + obj.id).attr('disabled', true);
    this.checkCheckAllBox();
  };

  /**
   * Checks the status of the checkAll box after a checkbox has been
   * enabled or disabled. If the checkboxes are all checked/unchecked,
   * check/uncheck the box.
   */
  MCD.checkCheckAllBox = function () {
    var prop, check;
    check = true;
    for (prop in this.checkboxes) {
      if (this.checkboxes.hasOwnProperty(prop)) {
        if (!this.checkboxes[prop]) { check = false; }
      }
    }
    if (check) {
      $('#checkAllProducts').attr('checked', true);
    } else {
      $('#checkAllProducts').removeAttr('checked');
    }
  };

  /**
   * Returns a boolean on whether there are any selected checkboxes.
   * @return {Boolean} Are there any checkboxes checked.
   */
  MCD.itemsSelected = function () {
    var prop, check;
    check = false;
    for (prop in this.checkboxes) {
      if (this.checkboxes.hasOwnProperty(prop)) {
        if (this.checkboxes[prop]) { check = true; }
      }
    }
    return check;
  };

  /**
   * If the checkAll box is checked/unchecked, check/uncheck all of the
   * product checkboxes.
   * @param  {[type]} box   Either the checkAll box, or false if initialising.
   */
  MCD.toggleAllProducts = function (box) {
    var $checkboxes, $box, self, checked;
    self = this;
    $checkboxes = $('input.js-addToCheckBox');
    if (!box) {
      $checkboxes.each(function () { self.disableCheckbox(this); });
    } else {
      $box = $(box);
      checked = $box.attr('checked') === 'checked' ? true : false;
      if (checked) {
        $box.attr('checked', true);
        $checkboxes.attr('checked', true);
        $checkboxes.each(function () { self.enableCheckbox(this); });
      } else {
        $box.removeAttr('checked');
        $checkboxes.removeAttr('checked');
        $checkboxes.each(function () { self.disableCheckbox(this); });
      }
    }
  };

  /**
   * Copied wholesale from the original minicart script and refactored to
   * improve line-length.
   * @param  {DOM node} uID       ID of the element.
   * @return {Boolean}  isValid   Is the selection valid.
   */
  MCD.validateRoutine = function (uID) {
    var i, l, arr, att1, att2, att3, att4, isValid;
    isValid = false;
    if (Atts.productArr.length > 0) {
      switch (this.multiFormType) {
        case 'productdetail':
        case 'quickBuyFast':
        case 'quickBuyDetails':
        case 'productdetailSet':
        case 'productset':
        case 'quickShop':
          for (i = 0, l = Atts.productArr.length; i < l; i++) {
            arr = Atts.productArr[i];
            att1 = arr.attSet.att1.selected;
            att2 = arr.attSet.att2.selected;
            att3 = arr.attSet.att3.selected;
            att4 = arr.attSet.att4.selected;
            if (uID === arr.attSet.id) {
              if (Atts.IsAllSelected(att1, att2, att3, att4, uID)) {
                switch (Atts.Get('stockstatus')) {
                  case 'Out of stock':
                    alert($('#attributes-stockOut').text());
                    isValid = false;
                    break;
                  case 'Not Available':
                    alert($('#attributes-stockNA').text());
                    isValid = false;
                    break;
                  default:
                    isValid = true;
                    break;
                }
              }
            }
          }
          break;
      }
    }
    return isValid;
  };

  /**
   * Calls the validation routine if the product is a multiproduct.
   * @param  {DOM node} el  Add product button.
   * @return {Boolean}      Is the selection valid.
   */
  MCD.validate = function () {
    var self, arr, uID;
    self = this;
    arr = [];
    if (this.multiForm && !this.itemsSelected()) { return false; }
    if ($('.js-attributesForm').length === 0) { return true; }
    $('.js-oneProduct').each(function () {
      uID = $(this).attr('id').substr(11);
      arr.push(self.validateRoutine(uID));
    });
    if (arr.contains(false)) { return false; }
    return true;
  };

  /**
   * INITIALISE!
   * @type {MinicartDetail}
   */
  Venda.mcd = new Venda.MinicartDetail(options);

  /**
   * Bind a resize function to the window so that we can determine
   * whether we need to show the minicartdetail or not.
   */
  $(window).on('load', function() {
    $('.js-minicart a').on('click');
    $(this).bind('resize', function () {
      Venda.mcd.updateDisplay();
    });
  });

  /**
   * Set up the DOM events.
   * @return {[type]} [description]
   */
  $(document).ready(function () {
    $('.js-minicart a').off('click'); // stop clicking on the basket before the page has finished

    var formType;

    formType = $('.js-attributesForm').attr('id');
    Venda.mcd.checkMultipage(formType);

    $(document)
      .on('touchstart', '.buttonUp', function () { Venda.mcd.scrollStart('up'); })
      .on('touchstart', '.buttonDown', function () { Venda.mcd.scrollStart('down'); })
      .on('touchend', '.buttonDown, .buttonUp', function () { Venda.mcd.scrollStop(); })
      .on('mousedown', '.buttonUp', function () { Venda.mcd.scrollStart('up'); })
      .on('mousedown', '.buttonDown', function () { Venda.mcd.scrollStart('down'); })
      .on('mouseup', '.buttonDown, .buttonUp', function () { Venda.mcd.scrollStop(); })
      .on('click', '.js-minicart, #minicartClose', function () { Venda.mcd.toggleVisibility(); })
      .on('click', '#continue', function () { Venda.mcd.removeNotify(); Venda.mcd.resetForm(); });

    $(document).on('click', function (e) {
      if ($('#basketSection').length > 0) {
        var nodeInBasket = $.contains($('#basketSection')[0], e.target);
        if (!nodeInBasket && Venda.mcd.visible) {
          Venda.mcd.toggleVisibility();
        }
      }
    });

    $(document).on('keypress','#qty', function(e) {
      if (e.which == '13') {
        $('.js-addproduct').trigger('click');
        return false;
      }
    });

    $(document).on('click', '.js-addproduct', function (e) {
      e.preventDefault();
      var $productStatus;
      if($("#addproductform").valid()) {
        Venda.mcd.addProduct(this);
      }
      // clear feedback asking the user to select an attribute combination (something to draw the eye towards it)
      if ($('.js-addproduct').css('opacity') === '0.5') {
        $productStatus = $('.js-stockFeedbackBox #productstatus');
        if ($productStatus.length > 0 && $productStatus.is(':visible')) {
          $productStatus.effect('pulsate', { times: 2 }, 700);
        }
      }
    });

    $(document).on('change', '#addproductform select', function () {
      if ($('#addproductform #notify').exists()) { Venda.mcd.removeNotify(); }
    });

    $(document).on('click', '#addproductform .js-attributeSwatch', function () {
      if ($('#addproductform #notify').exists()) { Venda.mcd.removeNotify(); }
    });

    $(document).on('click', '.js-removeItem', function (e) {
      e.preventDefault();
      Venda.mcd.removeItem(this);
    });

    $(document).on('click', '#checkAllProducts', function () {
      Venda.mcd.toggleAllProducts(this);
    });

    $(document).on('click', '.js-addToCheckBox', function () {
      var checked;
      checked = $(this).attr('checked') === 'checked' ? true : false;
      if (checked) {
        Venda.mcd.enableCheckbox(this);
      } else {
        Venda.mcd.disableCheckbox(this);
      }
    });

  });

}(Venda, jQuery));