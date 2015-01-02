/**
 * @providesModule LinkageOptimizer
 */

(function () {
  var optimizeStep = require('optimizeStep');

  function LinkageOptimizer(LinkageClass, numPoints, state) {
    if (!(this instanceof LinkageOptimizer)) { throw Error('lacking new'); }

    this.MAX_OPTIMIZE_STEPS = 3000;
    this.PERIOD = 10;
   
    this.isOptimizing = false;
    this.numPoints = numPoints;
    this.state = state;

    this.linkage = Object.create(LinkageClass.prototype);
    this.applyVector = Function.prototype.apply.bind(LinkageClass, this.linkage);
  }

  LinkageOptimizer.prototype.start = function (
    desiredPath, 
    initialVector, 
    update,
    randomizeValue
  ) {
    if (this.isOptimizing) {
      console.log('not done with previous optimization!');
      return;
    }
    
    this.calcPath = this.linkage.calcPath.bind(
      this.linkage, 
      this.numPoints, 
      this.state.theta1rate, 
      this.state.theta2rate, 
      this.state.theta2phase
    );

    this.isOptimizing = true;

    var vector = initialVector.slice();

    var linkageOptimizeStep = makeLinkageOptimizeStep(
      this.applyVector,
      this.calcPath,
      desiredPath,
      randomizeValue 
    );
      
    var count = 0;

    var f = function () {
      var res = linkageOptimizeStep(vector, count, this.MAX_OPTIMIZE_STEPS);
      vector = res.vector;
      update({vector:vector});

      count += res.count;

      if (this.isOptimizing && res.error > 1 && count < this.MAX_OPTIMIZE_STEPS) {
        setTimeout(f, this.PERIOD);
      } else {
        this.isOptimizing = false;
      }
    }.bind(this);
    
    setTimeout(f, this.PERIOD);
  };

  function makeLinkageOptimizeStep(applyVector, calcPath, desiredPath, scale) {
    var desiredAverage = averagePoint(desiredPath);

    function measureError(path) {
      var average = averagePoint(path); 
      var errorAverage = 
        Math.abs(desiredAverage.x - average.x) + 
        Math.abs(desiredAverage.y - average.y);

      //var d1 = calcMinDistSum(path, desiredPath);
      //var d2 = calcMinDistSum(desiredPath, path);
      //return d1 + d2;

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
    scales = scales.map(function (e) { return e * scale; });

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
  }

  addModule('LinkageOptimizer', LinkageOptimizer);
}());
