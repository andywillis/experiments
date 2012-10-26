var callbacks = []
var people = ['andy','joe','moose']

for (var i = 0; i < people.length; i++){
	
	(function(person){
		callbacks.push(function(){ console.log(person); })
	}(people[i]))
	
}
callbacks.forEach(function(callback){
	callback()
})