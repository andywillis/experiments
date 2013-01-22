if(!Number.prototype.plus) {
	Number.prototype.plus = function(n) { return this + n; };
}
if(!Number.prototype.minus) {
	Number.prototype.minus = function(n) { return this - n; };	
}

function N() {
	var obj = {}
	var proto = Object.create(Number.prototype);
  obj.prototype = proto;
  return obj
}

var num = N();
console.log(num.plus(5).minus(2));