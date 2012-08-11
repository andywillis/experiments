var merge = function merge(a, b){ if (a && b) { for (var key in b) { a[key] = b[key]; } } return a; }

var Base = function Base(){}

Base.prototype.extend = function extend() {

	var self, proto, props

	self = this
	props = arguments[0]
	proto = self.__proto__
	proto.extend = self.extend
	for (prop in props) {	proto[prop] = props[prop] }
	function Obj() {}
	Obj.prototype = proto
	return new Obj

}

Base.prototype.create = function create(props) {
	var self = this
	self = Object.create(self.__proto__)
	for (prop in props) {
		self[prop] = props[prop]
	}
	return self
}

/** **/

var object = new Base

console.log(list);

/*
var veg = object.extend({type: 'Not fucking fruit'})
var fruit = object.extend({type: 'Not vegetables'})
var englishFruit = fruit.extend({country: 'England'})
var apple = englishFruit.extend()
var pippin = apple.create({size: 'small', color: 'red'})
console.log(pippin);

var apple = englishFruit.extend()
var pippin = apple.create({type: 'crunchy'})
var englishFruit = fruit.extend({country: 'England'})
var carrots = veg.create({price: 0.50, per: 'lb'})
var grapes = englishFruit.create({price: 2.50, per: 'lb'})
console.log(grapes, grapes.__proto__)
console.log(carrots, carrots.__proto__)
Base.prototype.create = function create(props) {
	var self = this
	self = Object.create(self.__proto__)
	for (prop in props) {
		self[prop] = props[prop]
	}
	return self
}
Base.prototype.create = function create(props) {
	var self = this
	self = Object.create(self.__proto__)
	for (prop in props) {
		self[prop] = props[prop]
	}
	return self
}
*/