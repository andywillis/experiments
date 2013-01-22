var code = 'VQBUP PVSPG GFPNU EDOKD XHEWT IYCLK XRZAP VUFSA WEMUX GPNIV QJMNJ JNIZY KBPNF RRHTB WWNUQ JAJGJ FHADQ LQMFL XRGGW UGWVZ GKFBC MPXKE KQCQQ LBODO QJVEL'
  , obj = {}
  , letter
  , arr = []
  , arr2 = []
  , oldnum = 0
  , num = 0
  , colors = require('colors')

msg = code
  .replace(/\s/g, 'S')
  .replace(/S/g, ' ')

for (var i = 0, len = msg.length; i < len; i++) {
  letter = msg[i]
  if (obj[letter]) { obj[letter]++ } else { obj[letter] = 1 }
}

for (var i = 0, len = msg.length; i < len; i++) {
  letter = msg[i]
  if (letter === ' ') arr.push(i)
}

for (var i = 0, len = arr.length; i < len; i++) {
  num = arr[i]
  arr2.push(num - oldnum)
  oldnum = num
}

//console.log(obj);
console.log(msg.red);
//console.log(arr.join(','))
//console.log(arr2.join(','))

