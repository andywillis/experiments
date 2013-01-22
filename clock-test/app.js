// Constructor
function Reversible(number) {
  this.upperLimit = number;
}

// Returns the result.
Reversible.prototype.listReversible = function () {
  var reverse = 0, result = [];
  for (var i = 1, len = this.upperLimit; i <= len; i++) {
    number = i;
    // Returns an array [1: the number, 2: whether there is a leading zero]
    reverse = this.reverseNumber(number);
    // If there is no leading number
    if (reverse[1]) {
      sum = number + reverse[0];
      odd = this.isOdd(sum);
      if (odd) result.push(number);
    }
  }
  return result;
};


// Reverse the number
Reversible.prototype.reverseNumber = function () {
  var revStr = number.toString().split('').reverse().join(''), num = parseInt(revStr, 10), noleading = true;
  // Check to see if there's a leading number.
  if (revStr[0] === '0') noleading = false;
  return [num, noleading];
};


// Is the number an odd number?
Reversible.prototype.isOdd = function (number) {
  var str = number.toString(), even = 0, l = 0, len = str.length;
  // While loop slightly more efficient.
  while(len--) {
    chr = parseInt(str[len], 10);
    if (chr % 2 === 0) even++;
  }
  odd = (even > 0) ? false : true;
  return odd;
};


// New object instancea
var reversible = new Reversible(1000)
  , result = reversible.listReversible();

console.log(result, 'Length: ' + result.length);