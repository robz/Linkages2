function makeBarOptimizer(applyVector, calcPath, desiredPath) {
  function averagePoint(path) {
    var sumX = 0, sumY = 0;

    path.forEach(function (p) {
      sumX += p.pE.x;
      sumY += p.pE.y;
    });

    return {
      x: sumX / path.length,
      y: sumY / path.length,
    };
  }

  var desiredAverage = averagePoint(desiredPath);

  function measureError(path) {
    var average = averagePoint(path); 
    var errorAverage = 
      Math.abs(desiredAverage.x - average.x) + 
      Math.abs(desiredAverage.y - average.y);

    return errorAverage;
  }

  var calcOutput = function (vector) {
    var res;

    try {
      applyVector(vector);
      res = calcPath();
    } catch (e) {
      return null;
    }

    return res;
  };
  
  var scales = [1, 1, 1, 1, 1, 1, 1, 1, .1, 1];
  scales = scales.map(function (e) { return e * 10; });

  return function (vector, prevCount, maxCount) {
    return optimizeStep(
      vector, 
      calcOutput, 
      measureError, 
      scales, 
      prevCount, 
      maxCount
    );
  };
};
