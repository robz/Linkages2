function optimizeStep(initialVector, calcOutput, measureError, tweakScales) {
  var initialOutput = calcOutput(initialVector);

  // tweak vector
  var newVector = [];
  initialVector.forEach(function (elem, i) {
    newVector.push(elem + tweakScales[i] * (Math.random() - .5));
  });

  var newOutput = calcOutput(newVector);

  // if the output was falsy, then the vector is not a valid state
  if (!newOutput) {
    return initialVector;
  }

  // return tweaked vector if its better
  return (measureError(newOutput) < measureError(initialOutput))
    ? newVector
    : initialVector;
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
