

var X = function (x) {
	var arr = []
	arr['a'] = function(a){console.log(a+1); return arr}
	arr['b'] = function(a){console.log(a+2); return arr}
	arr['c'] = function(a){console.log(a+3); return arr}
	return arr
}

X().b(2).c(3).a(1)


/*
// Map

var array = [1,2,3,4]
array['string'] = 'blloook'
array.push(6)
console.log(array);
var obj = {
	increment: 4,
	fn: function(v) {
		return v + this.increment;
	}

}

console.log(array.map(obj.fn, obj))

// Reduce

var red = function(previous, current, index, array){
	return previous + current
}

var array = [1,2,3,4]

var out3 = array.reduce(red)

console.log(out3);

var b = {}
b.c = function(){console.log('cake')}
b['c']()
*/