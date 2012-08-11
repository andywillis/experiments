
function CatMaker(name) {
    var age = 10;

    //construct an object on the fly with three methods.
    //All methods have access to age, but age cannot be
    //directly accessed outside of this function.
    return { 
        "sayHello": function () { //first method
            alert("Miaow");
        },
        "getAge": function (inCatYears) { //second method
            if (inCatYears) {
                return age * 7;
            }
            else {
                return age;
            }
        },
        "makeOlder": function () { //third method
            age++;
        }
    };
}

var mycat = CatMaker('Snuffles');
mycat.age = 0
var age = mycat.getAge(true)
mycat.makeOlder()
mycat.makeOlder()
var age2 = mycat.getAge(true)

console.log(mycat, age, age2);