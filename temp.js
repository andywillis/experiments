function Log() {
	this.type = 'Logger'
	this.store = []
	this.name = arguments[0]
}

var l = new Log();

l('d')