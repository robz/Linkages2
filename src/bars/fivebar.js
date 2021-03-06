/**
 * @providesModule Fivebar 
 * @providesModule FivebarExt
 */

(function () {
  var Fourbar = require('Fourbar');
  var FourbarExt = require('FourbarExt');

  var Fivebar = function (p1x, p1y, p5x, p5y, a, b, c, d) {
    if (!(this instanceof Fivebar)) { throw Error('lacking new'); }

    this.p1x = p1x;
    this.p1y = p1y;
    this.p5x = p5x;
    this.p5y = p5y;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.fourbarCalcPoints = Fourbar.prototype.calcPoints;
  };

  Fivebar.prototype.calcPoints = function (theta1, theta2) {
    // find p4 for Fourbar calcPoints and to find fourbar's input
    var P15angle = Math.atan2(this.p5y - this.p1y, this.p5x - this.p1x);
    var P45angle = theta2 + P15angle;
    this.p4x = this.p5x + this.d * Math.cos(P45angle);
    this.p4y = this.p5y + this.d * Math.sin(P45angle);
    
    // figure out what the internal fourbar's input should be
    var P14angle = Math.atan2(this.p4y - this.p1y, this.p4x - this.p1x);
    var diff = P14angle - P15angle;
    var fourbarTheta1 = (theta1 - diff + Math.PI * 2) % (Math.PI * 2);
    
    var points = this.fourbarCalcPoints(fourbarTheta1);  

    // add p4 (since it varies with theta2)
    points.p4 = {x:this.p4x, y:this.p4y};

    this.points = points;
    return points;
  };

  Fivebar.prototype.calcPath = function (numPoints, theta1rate, theta2rate, theta2phase) {
    var pointsList = [];
    var revs, ratio, theta1first;

    if (theta1rate <= theta2rate) {
      revs = theta1rate; 
      ratio = theta2rate / theta1rate;
      theta1first = true;
    } else {
      revs = theta2rate;
      ratio = theta1rate / theta2rate;
      theta1first = false;
    }

    var ii = 0;
    for (var rev = 0; rev < revs; rev++) {
      for (var jj = 0; jj < numPoints; jj++) {
        var theta1 = Math.PI * 2 * ii / numPoints;
        var theta2 = theta1 * ratio;
        if (theta1first) {
          pointsList.push(this.calcPoints(theta1, theta2 + theta2phase));
        } else {
          pointsList.push(this.calcPoints(theta2, theta1 + theta2phase));
        }
        ii += 1; 
      }
    }

    pointsList.forEach(function (e, i) {
      if (isNaN(e.pE.x) || isNaN(e.pE.y)) {
        throw Error('got a NaN'); // wat
      }
    });

    this.path = pointsList;
    return pointsList;
  };

  var FivebarExt = function(p1x, p1y, p5x, p5y, a, b, c, d, thetaExt, dExt) {
    if (!(this instanceof FivebarExt)) { throw Error('lacking new'); }

    Fivebar.call(this, p1x, p1y, p5x, p5y, a, b, c, d);

    this.dExt = dExt;
    this.thetaExt = thetaExt;
    this.fourbarCalcPoints = FourbarExt.prototype.calcPoints;
  };

  FivebarExt.prototype = new Fivebar();
  FivebarExt.prototype.constructor = FivebarExt;

  addModule('Fivebar', Fivebar);
  addModule('FivebarExt', FivebarExt);
}());
