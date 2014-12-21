var makeLinkageOptimizer = (function () {
  var MAX_OPTIMIZE_STEPS = 10000;
  var SCALE = 20;
  
  var done = true;

  return function (desiredPath, initialVector, update) {
    var linkage = Object.create(FivebarExt.prototype);
    var optimize = makeLinkageOptimizeStep(
      Function.prototype.apply.bind(FivebarExt, linkage),
      linkage.calcPath.bind(linkage, 100, 2, 0),
      desiredPath 
    );
    
    var that = {};

    that.vector = initialVector;

    that.start = function () {
      if (!done) {
        console.log('not done with preview optimization!');
        return;
      }

      done = false;
    
      var count = 0;
    
      setTimeout(function f() {
        var res = optimize(that.vector, count, MAX_OPTIMIZE_STEPS);

        that.vector = res.vector;
        update(that.vector);

        count += res.count;

        if (!done && res.error > 1 && count < MAX_OPTIMIZE_STEPS) {
          setTimeout(f, 10);
        } else {
          done = true;
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

    function calcDist(p1, p2) {
      var dx = p2.x - p1.x;
      var dy = p2.y - p1.y;
      return Math.sqrt(dx*dx + dy*dy);
    }

    function calcMinDistSum(path1, path2) {
      var sum = 0;

      path1.forEach(function (e1) {
        var p1 = e1.pE;
        var minDist = Number.MAX_VALUE;
        
        path2.forEach(function (e2) {
          var p2 = e2.pE;
          var dist = calcDist(p1, p2);
          
          if (dist < minDist) {
            minDist = dist;
          }
        }); 
  
        sum += minDist;
      });

      return sum;
    }

    function calcMaxMinDist(path1, path2) {
      var maxMin = Number.MIN_VALUE;

      path1.forEach(function (e1) {
        var p1 = e1.pE;
        var minDist = Number.MAX_VALUE;
        
        path2.forEach(function (e2) {
          var p2 = e2.pE;
          var dist = calcDist(p1, p2);
          
          if (dist < minDist) {
            minDist = dist;
          }
        }); 
    
        if (minDist > maxMin) {
          maxMin = minDist;
        } 
      });

      return maxMin;
    }

    var desiredAverage = averagePoint(desiredPath);

    function measureError(path) {
      var average = averagePoint(path); 
      var errorAverage = 
        Math.abs(desiredAverage.x - average.x) + 
        Math.abs(desiredAverage.y - average.y);

      var d1 = calcMinDistSum(path, desiredPath);
      var d2 = calcMinDistSum(desiredPath, path);

      var maxMinDist1 = calcMaxMinDist(path, desiredPath);
      var maxMinDist2 = calcMaxMinDist(desiredPath, path);

      return maxMinDist2 + maxMinDist1;
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
    
    var scales = [1, 1, 1, 1, 1, 1, 1, 1, .01, .5];
    scales = scales.map(function (e) { return e * SCALE; });

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
