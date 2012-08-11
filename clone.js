var newapp = function(){

	var proto = (function(){
		return {
			extend: function extend(args) {
				var proto, name
				if (args && args.proto) {	proto = args.proto; delete args.proto	} else { proto = {} }
				function Obj () {};
				Obj.prototype = Object.create(proto)
				Obj.prototype.extend = this.extend
				Obj.prototype.create = function create(props) {
					var self = this
					self = Object.create(self.__proto__)
					for (prop in props) {
						self[prop] = props[prop]
					}
					return self
				}
				for (prop in args) { Obj.prototype[prop] = args[prop]	}
				return new Obj()
			},
			proto: function(c) {return this[c].__proto__}
		}
	}());

	var utils = (function(){
		var utils = {}
		utils.merge = function merge(a, b){
		  if (a && b) {
		    for (var key in b) {
		      a[key] = b[key];
		    }
		  }
		  return a;
		}
		return utils
	}());

	var block = {}
	var args = arguments[0]
	block.stack = []
	for (prop in args) { block[prop] = args[prop]}
	utils.merge(block, proto)
	return block

}

var inventory = newapp({ name: 'Mum\'s Shopping List', version: 0.1 })
var vegetable = inventory.extend()

console.log(vegetable.__proto__);

/*
var baskedGood = inventory.extend({name: 'bakedGood'})

var carrots = vegetable.create({ name: 'carrots', price: 20, per: 'lb' })
var potatoes = vegetable.create({	name: 'potatoes', price: 30, per: 'lb' })

console.log(carrots.__proto__);
*/

/*
var carrot = app.extend({ })
var danishCarrot = carrot.create({ color: 'orange' })
var item = block.extend({ proto: base, type: 'item', price: 0 })
var carrot = block.extend({ proto: item, type: 'carrot' })
var danishCarrot = block.extend({proto: carrot, color: 'orange' })
var originalCarrot = block.extend({ proto: carrot, color: 'purple' })

console.log(danishCarrot.color);
console.log(originalCarrot.color);
*/