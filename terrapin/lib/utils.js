// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var utils = {};

/**
 * [processImageList description]
 * Returns an object describing the
 */
utils.processImageList = function (data) {
  return data.map(function (el) {
    return {
      url: el.images.standard_resolution.url,
      link: el.link,
      id: el.id.split('_')[0]
    };
  });
};

exports = module.exports = utils;
