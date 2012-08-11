var r = 255
	,	g = 255
	,	b = 255
	,	rgb = 3*r+4*g+b
	,	avg = rgb >>> 3

console.log(rgb);
console.log(avg);

/*
var counter = function () {
  var i = 0;
  return function counter () { i++; return i; };
};

counter()
counter()

var counter = (function (i) {
  return function counter () { return ++i }
})(0);

counter()
counter()
console.log(counter()) //returns 1
console.log(counter()) //returns 2
*/