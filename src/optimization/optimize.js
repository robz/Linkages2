/**
 * @providesModule optimizeStep 
 */

(function () {
  function stocasticHillClimbStep(
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

    // if our last attempt produced an invalid state, or a worse output, just 
    // return initial
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

  function hillClimbStep(
    initialVector, 
    calcOutput, 
    measureError, 
    initialStepSizes, 
    prevCount, 
    maxCount
  ) {
    var acceleration = 1; 
    var accelerations = [
      -acceleration,
      //-1/acceleration,
      0,
      //1/acceleration,
      acceleration,
    ];

    var vector = initialVector.slice();
    var stepSizes = initialStepSizes;

    var startOutput = calcOutput(vector);
    if (startOutput === null) {
      throw new Error("starting config can't be invalid!");
    }
    
    var startError = measureError(startOutput);
    
    var finalError = null;
    stepSizes.forEach(function (stepSize, i) {
      var initialValue = vector[i]; 

      var best = accelerations.reduce(function (best, accel) {
        vector[i] = initialValue + stepSize * accel;

        var output = calcOutput(vector);
        if (output === null) {
          return best;
        }

        var error = measureError(output);
        if (error === Number.MAX_VALUE) {
          throw new Error('wat');
        }
        if (error < best.error) {
          return {
            error: error,
            value: vector[i],
            accel: accel,
          }; 
        } 

        return best;
      }, {error: Number.MAX_VALUE});

      if (best.value === undefined) {
        throw new Error('no valid config found--starting config invalid?'); 
      }

      vector[i] = best.value;
      finalError = best.error;

      if (best.accel !== 0) {
        //stepSizes[i] *= best.accel;
      }
    });

    return {
      vector: vector,
      error: finalError,
      count: (startError - finalError < 1e-6) ? maxCount : 1,
      stepSizes: stepSizes,
    };
  }

  function testOptimizeStep(optimizeStep) {
    var desiredSum = 40;
    var calcOutput = function (arr) { 
      return arr.reduce(function (sum, e) { return sum + e; }, 0);
    }
    var measureError = function (v) { return Math.abs(desiredSum - v); };
    var vector = [Math.random(), Math.random(), Math.random()];
    var scales = [10, 5, 1];
    vector = vector.map(function (e, i) { return e * scales[i]; });

    for (var ii = 0; ii < 50; ii++) {
      var res = optimizeStep(vector, calcOutput, measureError, scales);
      vector = res.vector;
    }
  } 

  //testOptimizeStep(hillClimbStep);

  addModule('OptimizeStepper', {
    stocasticHillClimbStep: stocasticHillClimbStep,
    hillClimbStep: hillClimbStep,
  });
}());
