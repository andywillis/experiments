function mostOften ( A ) {
  var arrColl = {}
    , max = 1
    , arrRet = []
    , el
    ;

  if (A.length === 0) return 'Array empty'

  // Build dictionary of values
  for (var i = 0, l = A.length; i < l; i++) {
    el = A[i];

    if (arrColl[el]) {
      arrColl[el]++
      if (arrColl[el] > max) {
        max = arrColl[el]
        maxel = el
      }
    } else {
      arrColl[el] = 1
    }

  }

  // Match values against max and return array of keys
  for (var k in arrColl) {
    if (arrColl[k] === max) {
      arrRet.push(k)
    }
  }

  return arrRet

}

var A = [100,100,100,100,20, 10, 10,10,30, 30, 40, 10, 20, 100, 200, 30, 20, 10]
//var A = [10,20,30,40,30]
console.log(mostOften(A))