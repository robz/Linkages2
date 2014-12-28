addExport('optimizeStep',

(function () {
  return function(
    initialVector, 
    calcOutput, 
    measureError, 
    tweakScales, 
    prevCount, 
    maxCount
  ) {
    var initialOutput = calcOutput(initialVector);
    var initialError = measureError(initialOutput);
    var count = 0;

    do {
      // tweak vector
      var newVector = [];
      initialVector.forEach(function (elem, i) {
        newVector.push(elem + tweakScales[i] * (Math.random() - .5));
      });

      var newOutput = calcOutput(newVector);
      var newError = (newOutput !== null) && measureError(newOutput);

      count += 1;

      // continue until the tweaked vector is better
      // or the output is null (meaning the new vector is an invalid state)
      // and as long as we haven't tried too many times
    } while (
      (newOutput === null || newError > initialError) && 
      count + prevCount < maxCount
    );

    // if our last attempt produced an invalid state, or a worse output, just return initial
    if (newOutput === null || newError > initialError) {
      return {
        vector: initialVector,
        error: initialError,
        count: count,
      };
    } else {
      return {
        vector: newVector,
        error: newError,
        count: count,
      };
    }
  }

  function testOptimizeStep() {
    var desiredSum = 40;
    var calcOutput = function (arr) { 
      return arr.reduce(function (sum, e) { return sum + e; }, 0);
    }
    var measureError = function (v) { return Math.abs(desiredSum - v); };
    var vector = [0, 0, 0];
    var scales = [10, 5, 1];

    for (var ii = 0; ii < 50; ii++) {
      vector = optimizeStep(vector, calcOutput, measureError, scales);
      console.log(vector, calcOutput(vector));
    }
  }

  return optimizeStep;
}()));
