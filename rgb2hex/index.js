// Dependancies
var fs = require('fs')
  , rgb2hex = require('rgb2hex')
  ;

// Variables
var rgbArr = require('./data')
	,	fname = 'grandmaster.smd'

rgb2hex(rgbArr, function(buffer) {
  fs.writeFile(fname, buffer);
})

