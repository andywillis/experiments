function count_div ( A,B,K ) {
  var low = A
    , high = B
    , div = K
    , count = 0
    ;

  if (low > high) return 'A must be lower in value than B.'
  if (div < 1) return 'K must be greater than 0.'

  for (var i = low, l = high; i <= l; i++) {
    if (i % div === 0) {
      count += 1
    }
  }

  return count;

}

console.log(count_div(120,240,14))