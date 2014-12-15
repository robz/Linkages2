var makeLinkageOptimizer = (function () {
  return function (desiredPath, initialVector, update) {
    var MAX_OPTIMIZE_STEPS = 10000;

    var linkage = Object.create(FivebarExt.prototype);
    var optimize = makeLinkageOptimizeStep(
      Function.prototype.apply.bind(FivebarExt, linkage),
      linkage.calcPath.bind(linkage, 100, 2, 0),
      desiredPath 
    );
    
    var count = 0;

    var that = {};

    that.done = true;
  
    that.vector = initialVector;

    that.start = function () {
      if (!that.done) {
        console.log('not done with preview optimization!');
        return;
      }

      that.done = false;
    
      setTimeout(function f() {
        var res = optimize(that.vector, count, MAX_OPTIMIZE_STEPS);

        that.vector = res.vector;
        update(that.vector);

        count += res.count;
        //console.log(count);

        if (!that.done && res.error > 1 && count < MAX_OPTIMIZE_STEPS) {
          setTimeout(f, 10);
        } else {
          that.done = true;
        }
      }, 10);
    };

    return that;
  }

  function makeLinkageOptimizeStep(applyVector, calcPath, desiredPath) {
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
}());
