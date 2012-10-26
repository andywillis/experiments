function bindFirstArg(fn, a) {
  return function(b) {
    return fn(a, b);
  };
}

function add(a, b) {
  return a + b;
}

log(add(1, 2));

function multiply(a, b) {
  return a * b;
}

function log(exp) {
  console.log(exp);
}

function str(fn){
  return fn.toString()
}

multiply(10, 2);

var addOne = bindFirstArg(add, 1);

log(str(addOne))

addOne(2);
addOne(3);
addOne(10);
addOne(9000);

var multiplyByTen = bindFirstArg(multiply, 10);
multiplyByTen(2);    // 20
multiplyByTen(3);    // 30
multiplyByTen(10);   // 100
multiplyByTen(9000); // 90000

var makeAdder = bindFirstArg(bindFirstArg, add);
log(str(makeAdder))