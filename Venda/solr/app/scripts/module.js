function say (name) {
  return function () {
    console.log('hallo', name);
  }
}

var b = say('andy');

b();