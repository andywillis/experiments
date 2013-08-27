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
 * 1.0  First implementation.
 * ---------
 * DEPENDANCIES
 * ---------
 * jQuery.1.8.3.js, util-0.0.1.js, chosen.
 * ---------
 */
(function(Venda, $) {
  'use strict';

  var MCD, options, Atts;

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
    autoload: true,
    animOpen: true,
    largeDeviceSmoothScroll: true
  };

  MCD = Venda.MinicartDetail = {};

  MCD.init = function (options) {
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

  Atts = Venda.Attributes;

  /**
   * Because this code is to be used in conjunction with the offCanvas code,
   * and because both minicarts share the same class, the 'loaded' variable
   * serves to check how many minicarts have been loaded so the dropdown cart
   * doesn't go mental if showAfterAddProd is true.
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

  MCD.highlightProduct = function (highlight) {
    var $el, position;
    $el = $(this.node.dropdown.details).find('li.minicart-' + highlight);
    $el.addClass('minicartHighlight');
    position = $el.position();
    this.scrollMinicartDetails(null, position.top);
  };

  /**
   * Due to a 'feature' of the code code that changes the product ids of
   * items in the minicart when it's reloaded, in order to get the 'remove item'
   * functionality to work, the product ids need to be cached when the
   * minicart is first initialised. These product ids are then populated to a
   * new form when an item is removed.
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
          global: false,
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

  MCD.prepareElements = function () {
    var elements, i, l;
    elements = Array.prototype.slice.call(arguments);
    for (i = 0, l = elements.length; i < l; i++) {
      elements[i].css({ opacity: 0, visibility: 'visible'});
    }
  };

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

  MCD.toggleMinicart = function (type) {
    if (type === 'show') { this.showMinicart(); }
    if (type === 'close') { this.hideMinicart(); }
  };

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

  MCD.setPosition = function (type) {
    if (this.visible) {
      this.positionContent();
      this.positionFooter();
      this.positionMinicartDetail(type);
      this.toggleDirectionButtons();
    }
  };

  MCD.positionContent = function () {
    var $content, $header, detailsHeight, height, mainHeight, headerLowerPos, $attachedTo;
    $content = $(this.node.dropdown.content);
    $header = $(this.node.dropdown.header);
    $attachedTo = $(this.node.dropdown.attachedTo);
    detailsHeight = $(this.node.dropdown.details).outerHeight() + 10;
    mainHeight = $(window).height() - $attachedTo.outerHeight() - 450;
    if (mainHeight > detailsHeight) { height = detailsHeight; }
    else { height = (mainHeight < 120) ? 120 : mainHeight; }
    headerLowerPos = $header.offset().top + $header.outerHeight();
    $content.offset({top: headerLowerPos});
    $content.height(height);
  };

  MCD.positionFooter = function () {
    var contentLowerPos, $content, $footer;
    $footer = $(this.node.dropdown.footer);
    $content = $(this.node.dropdown.content);
    contentLowerPos = $content.offset().top + $content.height();
    $footer.offset({top: contentLowerPos});
  };

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

  MCD.enableButton = function (button, text, type) {
    var $button;
    $button = $(button);
    if (type && type === 'anchor') { $button.html(text); }
    else { $button.val(text); }
    $button.removeAttr('disabled');
    $button.css({ opacity: 1.0 });
    $button.find('i').remove();
  };

  MCD.disableButton = function (button, text, type) {
    var $button;
    $button = $(button);
    if (type && type === 'anchor') { $button.html(text); }
    else { $button.val(text); }
    $button.append('<i class="icon-loader icon-spin icon-small thinpad-side"></i>');
    $button.attr('disabled', 'disabled');
    $button.css({ opacity: 0.5 });
  };

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

  MCD.processNotifications = function (html, $form) {
    var $html, $alert, templateObject, hasAlert;
    $html = $(html);
    $alert = $html.find('.alert-box[data-alert]');
    hasAlert = $alert.length > 0 ? true : false;
    if (this.showNotifications) {
      if (hasAlert) {
        templateObject = { alert: $alert.html() };
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

  MCD.createProductNotify = function($form) {
    var product, quantity, details, attribute, attr, labels, obj,
        $choice, select, label, i, l, o, template;
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

  MCD.removeNotify = function () {
    $(this.node.notify)
      .animate({ height: 0 }, {
        duration: this.duration1,
        complete: function() { $(this).remove(); }
      });
  };

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

  MCD.scrollStop = function () {
    if (this.largeDeviceSmoothScroll) {
      clearInterval(this.scrollInterval);
    }
  };

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

  MCD.initCheckboxes = function () {
    $('.js-addToCheckBoxLabel').css('display', 'block');
    $('.js-addToCheckBox').each(function () {
      $(this).removeAttr('checked');
    });
    $('#checkAllProducts').removeAttr('checked');
  };

  MCD.addCheckAllBox = function () {
    var text, label, template;
    text = $('#attributes-addAllProduct').text();
    template = this.template('multicheckbox');
    label = util.applyTemplate(template, { text: text });
    $('.js-buyControlsMulti').prepend(label);
  };

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

  MCD.enableCheckbox = function (el) {
    var obj;
    obj = this.getCheckboxUid(el);
    this.checkboxes[obj.uid] = true;
    $('#itemlist_' + obj.id).removeAttr('disabled');
    $('#qtylist_' + obj.id).removeAttr('disabled');
    this.checkCheckAllBox();
  };

  MCD.disableCheckbox = function (el) {
    var obj;
    obj = this.getCheckboxUid(el);
    this.checkboxes[obj.uid] = false;
    $('#itemlist_' + obj.id).attr('disabled', true);
    $('#qtylist_' + obj.id).attr('disabled', true);
    this.checkCheckAllBox();
  };

  MCD.checkCheckAllBox = function () {
    var prop, check;
    check = true;
    for (prop in this.checkboxes) {
      if (this.checkboxes.hasOwnProperty(prop)) {
        if (!this.checkboxes[prop]) { check = false; }
      }
    }
    if (check) { $('#checkAllProducts').attr('checked', true); }
    else { $('#checkAllProducts').removeAttr('checked'); }
  };

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

  MCD.init(options);

  $(window)
    .on('resize', function () { MCD.updateDisplay(); })
    .on('load', function() { $('.js-minicart a').on('click'); })

  $(document).ready(function () {

    MCD.checkMultipage($('.js-attributesForm').attr('id'));

    $('.js-minicart a').off('click');

    $(document)

      .on('touchstart', '.buttonUp', function () { MCD.scrollStart('up'); })
      .on('touchstart', '.buttonDown', function () { MCD.scrollStart('down'); })
      .on('touchend', '.buttonDown, .buttonUp', function () { MCD.scrollStop(); })
      .on('mousedown', '.buttonUp', function () { MCD.scrollStart('up'); })
      .on('mousedown', '.buttonDown', function () { MCD.scrollStart('down'); })
      .on('mouseup', '.buttonDown, .buttonUp', function () { MCD.scrollStop(); })
      .on('click', '.js-minicart, #minicartClose', function () { MCD.toggleVisibility(); })
      .on('click', '#continue', function () { MCD.removeNotify(); MCD.resetForm(); })

      .on('click', function (e) {
        if ($('#basketSection').length > 0) {
          var nodeInBasket = $.contains($('#basketSection')[0], e.target);
          if (!nodeInBasket && MCD.visible) {
            MCD.toggleVisibility();
          }
        }
      })

      .on('keypress','#qty', function(e) {
        if (e.which === '13') {
          $('.js-addproduct').trigger('click');
          return false;
        }
      })

      .on('click', '.js-addproduct', function (e) {
        e.preventDefault();
        var $productStatus;
        if($("#addproductform").valid()) { MCD.addProduct(this); }
        if ($('.js-addproduct').css('opacity') === '0.5') {
          $productStatus = $('.js-stockFeedbackBox #productstatus');
          if ($productStatus.length > 0 && $productStatus.is(':visible')) {
            $productStatus.effect('pulsate', { times: 2 }, 700);
          }
        }
      })

      .on('change', '#addproductform select', function () {
        if ($('#addproductform #notify').exists()) { MCD.removeNotify(); }
      })

      .on('click', '#addproductform .js-attributeSwatch', function () {
        if ($('#addproductform #notify').exists()) { MCD.removeNotify(); }
      })

      .on('click', '.js-removeItem', function (e) {
        e.preventDefault();
        MCD.removeItem(this);
      })

      .on('click', '#checkAllProducts', function () {
        MCD.toggleAllProducts(this);
      })

      .on('click', '.js-addToCheckBox', function () {
        var checked;
        checked = $(this).attr('checked') === 'checked' ? true : false;
        if (checked) { MCD.enableCheckbox(this); }
        else { MCD.disableCheckbox(this); }
      });

  });

}(window.Venda = window.Venda || {}, jQuery));