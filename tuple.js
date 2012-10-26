function Tuple() {
  var tuple = Array.prototype.slice.call(arguments)
  Object.freeze(tuple)
  return tuple
}

var tPoint = new Tuple('100','2')

console.log(tPoint, tPoint.length);