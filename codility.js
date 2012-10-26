equi([-7, 1, 5, 2, -4, 3, 0])

// pos in array and sum below = sum above

function equi ( A ) {

  var count = A.length
    , lSum = 0
    , uSum = 0
    , equis = []
    ;

  // Get array sum
  while(count--) {
    lSum += A[count];
	}

  count = A.length;
  
  while(count--) {

    uSum += A[count];

    console.log(lSum, uSum, count);

    if (lSum == uSum) {

      equis.push(count);
    }
    
    lSum -= A[count];

  }

  w = (equis.length) ? equis : -1;
	
	console.log(w)

}