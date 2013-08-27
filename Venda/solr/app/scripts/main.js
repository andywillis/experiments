/*global util, jQuery: true */
/*jslint browser: true */
/*jslint white: true */
/*jslint bitwise: true */
/*jslint plusplus: true */
/*jslint indent: 2 */

/**
 * Solr configuration interface
 * Copyright Venda 2013.
 * ---------
 * VERSION
 * 0.1
 * ---------
 * REVISIONS
 * 150813 - AJW - Changed from constructor to a simple object literal.
 * 070813 - AJW - Created
 * ---------
 * DEPENDANCIES
 * jQuery.1.8.3.js, util-0.0.1.js.
 * ---------
 * Add save functionality.
 * Integrate into VCP.
 * Highlighting of ranges.
 * Ensure that id params are resolved to this.router.hash where applicable.
 */
(function (Venda, $) {
  'use strict';

  var solr, solrOptions;

  Venda.solr = solr = {};

  solr.init = function (options) {
    util.merge(this, options);
    this.historyInit();
    this.getJSON().processJSON().writeJSON();
    this.getHash().route();
    this.buildTypes().updateTypes();
    return this;
  };

  solr.dataInit = function () {
    this.data = {core: [], backup: undefined, json: undefined};
    return this;
  };

  solr.historyInit = function () {
    this.history = {data: [], pointer: undefined};
    return this;
  };

  solr.setHash = function (hash) {
    window.location.href = '/#' + hash.split(' ')[0];
    return this;
  };

  solr.getHash = function () {
    var hash;
    hash = window.location.hash.split(' ')[0].slice(1);
    this.router.hash = this.router.routes.contains(hash) ? hash : 'home';
    return this;
  };

  solr.route = function () {
    this.showTemplate();
    return this;
  };

  solr.defaults = {
    weightings: [
      'type', 'sku', 'name', 'sell', 'cost', 'was', 'msrp', 'desc1', 'desc2',
      'desc3', 'desc4', 'description', 'publish', 'featured', 'eta', 'release',
      'onhand', 'warehouse', 'supplier', 'brand', 'atrattrvalue1',
      'atrattrvalue2', 'atrattrvalue3', 'atrattrvalue4', 'usersalesrank',
      'dailysalesrank', 'categories'
    ],
    fields: [
      'type', 'brand', 'atrattrvalue1', 'atrattrvalue2', 'atrattrvalue3',
      'atrattrvalue4', 'categories'
    ],
    ranges: ['price', 'dailysalesrank', 'usersalesrank']
  };

  solr.buildTypes = function () {
    var prop;
    this.types = {};
    for (prop in this.defaults) {
      if (this.defaults.hasOwnProperty(prop)) {
        this.types[prop] = util.objToDefault(this.defaults[prop], false);
      }
    }
    return this;
  };

  solr.updateTypes = function () {
    var prop, prop2, data, types;
    for (prop in this.types) {
      if (this.types.hasOwnProperty(prop)) {
        data = this.lookupDict(prop);
        types = this.types[prop];
        for (prop2 in types) {
          if (types.hasOwnProperty(prop2)) {
            if (prop === 'fields') {
              if (data.contains(prop2)) {
                types[prop2] = true;
              } else {
                types[prop2] = false;
              }
            } else {
              if (data[prop2]) {
                types[prop2] = true;
              } else {
                types[prop2] = false;
              }
            }
          }
        }
      }
    }
    return this;
  };

  solr.getAvailableTypes = function (id) {
    var arr, obj, prop;
    arr = [];
    obj = this.types[id];
    for (prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (!obj[prop]) { arr.push(prop); }
      }
    }
    return arr;
  };

  solr.showAvailableTypes = function (el, id) {
    var div, join, arr, $el, empty, html;
    $el = $(el);
    arr = this.getAvailableTypes(id).sort();
    div = '<div class="row">#{join}</div>';
    empty = '<div>No types available</div>';
    join = '</div><div class="row">';
    html = arr.length > 0 ? div.replace('#{join}', arr.join(join)) : empty;
    $('.floater')
      .data('id', id)
      .css({
        top: $el.offset().top + $el.outerHeight(),
        left: $el.offset().left
      })
      .html(html)
      .show();
    return this;
  };

  solr.dismissTypes = function () {
    $(this.node.floater).hide();
    return this;
  };

  solr.isVendaGroup = function () {
    return $(this.node.vendagroup).html() === 'false' ? false : true;
  };

  solr.removeQueryOptions = function () {
    this.copyData = this.data.query_options;
    delete this.data.query_options;
    $(this.node.queryoptionsButton).remove();
    return this;
  };

  solr.addQueryOptions = function () {
    this.data.query_options = this.copyData;
    return this;
  };

  solr.lookupDict = function (hash) {
    var obj;
    hash = hash || this.router.hash;
    obj = {
      root: this.data,
      query_options: this.data.query_options,
      weightings: this.data.weightings,
      fields: this.data.facets.fields,
      ranges: this.data.facets.ranges
    };
    return obj[hash];
  };

  solr.templates = {
    form: [
      '<form class="form">',
      '<fieldset>',
      '<div><button class="showtypes">Show types</button></div>',
      '<div class="green">',
      '<input class="label" placeholder="Label" data-id="#{id}"></input>',
      '<input class="value" data-id="#{id}" placeholder="Value">',
      '</input>',
      '<span class="add">New</span></div><br/>',
      '<br/>#{fieldset}',
      '</fieldset>',
      '</form>'
    ],
    normalLine: [
      '<label data-id="#{id}">#{label}</label>',
      '<input class="update" data-id="#{id}" data-label="#{label}"',
      ' value="#{input}"></input>',
      '<span class="cross #{label}">X</span><br/>'
    ],
    fields: [
      '<label data-id="#{id}">Array item</label>',
      '<input class="update" data-id="#{id}" data-index="#{index}"',
      ' value="#{input}"></input>',
      '<span class="cross #{label}">X</span><br/>'
    ],
    ranges: [
      '<label data-id="#{id}">#{label}</label>',
      '<input class="update" data-id="#{id}" data-label="#{label}"',
      ' value="#{input}"></input>',
      '<span class="cross #{label}">X</span><br/>'
    ]
  };

  solr.getJSON = function () {
    this.json = $(this.node.json).html();
    return this;
  };

  solr.parseJSON = function () {
    this.data = JSON.parse(this.json);
    return this;
  };

  solr.writeJSON = function () {
    $(this.node.output).html(this.formatJSON(this.data));
    return this;
  };

  solr.formatJSON = function () {
    return JSON.stringify(this.data, null, '\t');
  };

  solr.processJSON = function () {
    this.parseJSON().addToHistory();
    if (!this.isVendaGroup()) { this.removeQueryOptions(); }
    return this;
  };

  solr.addToHistory = function () {
    this.history.data.push(this.cloneData());
    if (this.history.pointer >= 0) {
      this.history.pointer += 1;
    } else {
      this.history.pointer = 0;
    }
    this.updateHistorySpan();
    return this;
  };

  solr.updateHistorySpan = function () {
    var html;
    html = '(#{pointer} of #{amount})'
      .replace('#{pointer}', this.history.pointer + 1)
      .replace('#{amount}', this.history.data.length);
    $(this.node.history).html(html);
    if (this.history.pointer > 0) {
      this.updateHistoryButtons('.back', 'enable');
    } else {
      this.updateHistoryButtons('.back', 'disable');
    }
    if (this.history.pointer < this.history.data.length - 1) {
      this.updateHistoryButtons('.forward', 'enable');
    } else {
      this.updateHistoryButtons('.forward', 'disable');
    }
    return this;
  };

  solr.updateHistoryButtons = function (el, type) {
    var $el;
    $el = $(el);
    if (type === 'disable') {
      $el.css({opacity: 0.3});
      $el.removeClass('enabled');
    } else {
      $el.css({opacity: 1});
      $el.addClass('enabled');
    }
    return this;
  };

  solr.cloneData = function () {
    return JSON.parse(JSON.stringify(this.data));
  };

  solr.travelHistory = function (direction) {
    this.history.pointer += direction;
    this.data = this.history.data[this.history.pointer];
    this.refreshPage();
    this.updateHistorySpan();
    return this;
  };

  solr.checkFields = function (fields) {
    var i, l;
    for (i = 0, l = fields.length; i < l; i++) {
      if (util.toType(this.data[fields[i]]) !== 'string') {
        fields.splice(i, 1);
        l--;
        i--;
      }
    }
    return fields;
  };

  solr.buildForm = function (fields, lookup) {
    var i, l, form, line, fieldset, from, to, hash;
    hash = this.router.hash;
    form = this.templates.form.join('').replace(/#\{id\}/g, hash);
    fieldset = '';
    for (i = 0, l = fields.length; i < l; i++) {
      if (hash !== 'fields' && hash !== 'ranges') {
        line = this.templates.normalLine.join('');
        fieldset += line
          .replace(/#\{id\}/g, hash)
          .replace(/#\{label\}/g, fields[i])
          .replace(/#\{input\}/g, lookup[fields[i]]);
      }
      if (hash === 'fields') {
        line = this.templates.fields.join('');
        fieldset += line
          .replace(/#\{index\}/g, i)
          .replace(/#\{id\}/g, hash)
          .replace(/#\{input\}/g, lookup[i]);
      }
      if (hash === 'ranges') {
        line = this.templates.ranges.join('');
        from = lookup[fields[i]].from;
        to = lookup[fields[i]].to;
        fieldset += line
          .replace(/#\{id\}/g, hash)
          .replace(/#\{label\}/g, fields[i])
          .replace(/#\{input\}/g, from + '...' + to);
      }
    }
    form = form.replace(/#\{fieldset\}/g, fieldset);
    $('.template.' + hash + ' .details').append(form);
    return this;
  };

  solr.getFields = function () {
    var fields, lookup, hash;
    hash = this.router.hash;
    lookup = this.lookupDict();
    fields = hash === 'fields' ? lookup : Object.keys(lookup);
    if (hash === 'root') { fields = this.checkFields(fields); }
    this.removeHighlights().addHighlights();
    this.clearForms().buildForm(fields, lookup);
    return this;
  };

  solr.clearForms = function () {
    $('.template .form').remove();
    return this;
  };

  solr.removeHighlights = function () {
    $('.highlight').each(function () {
      var text = $(this).text();
      $(this).replaceWith(text);
    });
    return this;
  };

  solr.addHighlights = function () {
    var html, line, replacedText, replacedLine;
    if (this.highlight) {
      html = $(this.node.output).html();
      line = '<span class="highlight">#{replace}</span>';
      replacedLine = line.replace('#{replace}', this.highlight);
      replacedText = html.replace(this.highlight, replacedLine);
      $(this.node.output).html(replacedText);
    }
    return this;
  };

  solr.updateData = function (label, value) {
    var updated, hash;
    hash = this.router.hash;
    updated = false;
    if (this.validate(label, value)) {
      switch(hash) {
      case 'fields':
        this.lookupDict().push(value);
        updated = true;
        break;
      case 'ranges':
        value = value.split('...');
        this.lookupDict()[label] = {from: value[0], to: value[1] };
        updated = true;
        break;
      default:
        this.lookupDict()[label] = value;
        updated = true;
        break;
      }
    } else {
      this.notify('Input invalid. Please check both the label and value.');
    }
    if (updated) {
      this.createHighlightObject(label, value);
      this.addToHistory().updateTypes().refreshPage();
    }
    return this;
  };

  solr.validate = function (label, value) {
    var foundType, foundPdxt, type, regex, split, test;
    type = this.router.hash === 'fields' ? value : label;
    foundType = this.defaults.weightings.contains(type);
    foundPdxt = String(type).substring(0, 4) === 'pdxt';
    regex = /([0-9]{1})\.\.\.([0-9]{1})|\*/g;
    split = value.split('...');
    test = regex.test(value);
    switch(this.router.hash) {
    case 'fields':
    case 'weightings':
      if (!foundType && !foundPdxt) { return false; }
      break;
    case 'ranges':
      if (!foundType || !test || split[0] < 0 || split[0] >= split[1]) { return false; }
      break;
    default:
      break;
    }
    return true;
  };

  solr.notify = function (text) {
    $(this.node.notification).html(text).show().delay(3000).fadeOut(300);
  };

  solr.createHighlightObject = function (label, value) {
    var json, highlight;
    if (this.router.hash === 'fields') {
      this.highlight = '"' + value + '"';
    } else {
      highlight = {};
      highlight[label] = value;
      json = JSON.stringify(highlight, null, '\t');
      json = json.replace(/[{}\t]/gim, '');
      this.highlight = json.trim();
    }
    return this;
  };

  solr.refreshPage = function () {
    this.clearForms().updateChangedDocument().writeJSON();
    this.getFields().removeElements();
    return this;
  };

  solr.removeElements = function () {
    var hash;
    hash = this.router.hash;
    if (hash === 'fields') { $('.label').hide(); }
    if (['query_options', 'root'].contains(hash)) { $('.showtypes').hide(); }
    return this;
  };

  solr.deleteItem = function (specifier) {
    var obj;
    obj = this.lookupDict();
    switch(this.router.hash) {
    case 'fields':
      obj.splice(specifier, 1);
      break;
    default:
      delete obj[specifier];
      break;
    }
    this.addToHistory().updateTypes().refreshPage();
    return this;
  };

  solr.saveChanges = function (callback) {
    var json;
    json = JSON.stringify(this.data);
    callback();
  };

  solr.updateChangedDocument = function () {
    this.changed = true;
    $('.save').show();
    return this;
  };

  solr.showTemplate = function () {
    var hash;
    hash = this.router.hash;
    $('.template').hide();
    this.clearForms();
    $('button').removeClass('on');
    if (hash !== 'home') {
      $('button.' + hash).addClass('on');
      this.getFields();
      $('.template.' + hash).show();
      this.removeElements();
    } else {
      this.removeHighlights();
      $('.template.home').show();
    }
    return this;
  };

  solrOptions = {
    router: {
      routes: [
        'home', 'root', 'query_options',
        'weightings', 'fields', 'ranges'
      ]
    },
    node: {
      json: '#json',
      output: '#codeView',
      vendagroup: '#vendagroup',
      queryoptionsButton: 'button.query_options',
      history: 'span.history',
      notification: '.notification',
      floater: '.floater'
    }
  };

  solr.init(solrOptions);

  $(function () {

    $(window).on('hashchange', function () { solr.getHash().route(); });
    $(window).on('resize', function() { solr.dismissTypes(); });
    $(document).on('click', '.home', function () { solr.setHash(''); });

    $(document).on('click', 'button:not(.home, .save, .showtypes)', function () {
      var id;
      id = $(this).attr('class');
      solr.dismissTypes();
      solr.setHash(id);
    });

    $(document).on('click', '.cross', function () {
      var label, id, index;
      id = $(this).prev().data('id');
      solr.dismissTypes();
      $('.showtypes').removeClass('on');
      switch(id){
      case 'fields':
        index = $(this).prev().data('index');
        solr.deleteItem(index);
        break;
      default:
        label = $(this).prev().data('label');
        solr.deleteItem(label);
        break;
      }
    });

    $('.save').click(function () {
      var self = this;
      $(this).html('Saving...').attr('disabled', 'disabled');
      solr.saveChanges(function () {
        $(self).html('Save changes').removeAttr('disabled').hide();
      });
    });

    $(document).on('click', '.add', function () {
      var $parent, label, value;
      $parent = $(this).parent();
      label = $parent.find('.label').val();
      value = $parent.find('.value').val();
      solr.updateData(label, value);
    });

    $(document).on('change', '.update', function () {
      var label, value;
      label = $(this).data('label');
      value = $(this).val();
      solr.updateData(label, value);
    });

    $(document).on('click', '.back', function () {
      if (solr.history.pointer > 0) {
        solr.travelHistory(-1);
      }
    });

    $(document).on('click', '.showtypes', function (e) {
      var id, el;
      e.preventDefault();
      if ($(this).hasClass('open')) {
        $(this).html('Show types').removeClass('open');
        solr.dismissTypes();
      } else {
        id = $('.label').data('id');
        $(this).addClass('open').html('Hide types');
        el = id === 'fields' ? '.value': '.label';
        solr.showAvailableTypes(el, id);
      }
    });

    $(document).on('click', '.forward', function () {
      if (solr.history.pointer < solr.history.data.length - 1) {
        solr.travelHistory(1);
      }
    });

    $(document).on('click', '.row', function () {
      var type, id;
      id = $(this).parent().data('id');
      type = $(this).html();
      if (id === 'fields') {
        $('.value').val(type);
      } else {
        $('.label').val(type);
      }
      $('.floater').hide();
      $('.showtypes').html('Show types').removeClass('open');
    });

  });

}(window.Venda = window.Venda || {}, jQuery));