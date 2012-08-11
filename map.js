function User(props) {
	for (prop in props) {
		this[prop] = props[prop]
	}
}

function Site(array) {
	var users = array
	this.__defineGetter__("names", function(){
		return users.map(function(user){
			return user.name;
		});
  });
	this.__defineGetter__("totalAge", function(){
		return 'Combined age: ' + users
			.map(function(user){ return user.age })
			.reduce(function(p,c){ return Math.round(p) + Math.round(c) })
	});
}

var users = []

users.push(new User({name: 'Andy', age: '28'}))
users.push(new User({name: 'Carl', age: 68}))

var site = new Site(users)

console.log(site.totalAge);