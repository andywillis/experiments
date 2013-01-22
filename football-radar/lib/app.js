function Reversible(number) {
  this.upperLimit = number;
  this.name = 'Reversibles';
}

Reversibles.prototype.listReversible = function () {
  var reverse = 0
  for (var i = 0, len = this.upperLimit; i < len; i++) {
    number = i;
    reverse = this.reverseNumber(i);
  }
}

Reversibles.prototype.reverseNumber = function () {
  var str = number.toString();
}

Reversibles.prototype.idOdd = function () {
  return number % 2;
}

var result = new Reversible(10);

console.log(result);