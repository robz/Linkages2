(function () {
  var Fourbar = function (p1x, p1y, p4x, p4y, a, b, c) {
    if (!(this instanceof Fourbar)) { throw Error('lacking new'); }
    this.p1x = p1x;
    this.p1y = p1y;
    this.p4x = p4x;
    this.p4y = p4y;
    this.a = a;
    this.b = b;
    this.c = c;
  };
          
  Fourbar.prototype.calcPoints = (function () {
    // acos and sqrt will detect if the linkage goes into an invalid configuation
    function acos(x) {
      if (x > 1 + 1e-6 || x < -1 - 1e-6) { 
        throw Error("acos(" + x + ")"); 
      }
      return Math.acos(x);
    }
              
    function sqrt(x) {
      if (x < 0) { 
        throw Error("sqrt(" + x + ")"); 
      }
      return Math.sqrt(x);
    }

    function euclid(p1x, p1y, p2x, p2y) {
      var dx = p2x - p1x;
      var dy = p2y - p1y;
      return Math.sqrt(dx*dx + dy*dy);
    }

    return function (theta1) {
      // wrap theta1 (errors arise if it goes outside of [0,2pi])
      theta1 = (theta1%(Math.PI*2) + Math.PI*2)%(Math.PI*2);

      // convenience definitions
      var a = this.a;
      var b = this.b;
      var c = this.c;
      var d = euclid(this.p1x, this.p1y, this.p4x, this.p4y);

      // position analysis (using geometric method)
      var f = sqrt(a * a + d * d - 2 * a * d * Math.cos(theta1));
      var phi = acos((f * f + d * d - a * a) / (2 * f * d));
      var gamma = acos((f * f + c * c - b * b) / ( 2 * f * c));

      if (theta1 < Math.PI) {
          var theta3 = Math.PI - (gamma + phi);
      } else {
          var theta3 = Math.PI - (gamma - phi);
      }

      var alpha = acos((b * b + c * c - f * f)/(2 * b * c));
      
      var theta2 = theta3 - alpha;
      var zeta = Math.atan2(this.p4y - this.p1y, this.p4x - this.p1x);
      
      // now calculate the points 
      var p2x = this.p1x + a * Math.cos(zeta + theta1);
      var p2y = this.p1y + a * Math.sin(zeta + theta1);
      
      var p3x = p2x + b * Math.cos(zeta + theta2);
      var p3y = p2y + b * Math.sin(zeta + theta2);
      
      // consistency check
      var p3x_2 = this.p4x + c * Math.cos(zeta + theta3);
      var p3y_2 = this.p4y + c * Math.sin(zeta + theta3);
      
      if (Math.abs(p3x_2 - p3x) > 1e-6 || Math.abs(p3y_2 - p3y) > 1e-6) {
          throw Error("error: consistency calculation for p3 failed", p3x_2, p3x, p3y_2, p3y);
      }

      this.points = {p2:{x:p2x, y:p2y}, p3:{x:p3x, y:p3y}};
      return this.points;
    };
  }());

  Fourbar.prototype.calcPath = function (numPoints) {
    var pointsList = [];

    for (var i = 0; i < numPoints; i++) {
      pointsList.push(this.calcPoints(Math.PI * 2 * i / numPoints));
    }

    this.path = pointsList; 
    return pointsList;
  };


  var FourbarExt = function (p1x, p1y, p4x, p4y, a, b, c, thetaExt, dExt) {
    if (!(this instanceof FourbarExt)) { throw Error('lacking new'); }
    
    Fourbar.call(this, p1x, p1y, p4x, p4y, a, b, c);
    
    this.dExt = dExt;
    this.thetaExt = thetaExt;
  };

  FourbarExt.prototype = new Fourbar();
  FourbarExt.prototype.constructor = FourbarExt;

  FourbarExt.prototype.calcPoints = function (input1) {
    var points = Fourbar.prototype.calcPoints.call(this, input1);

    this.P23angle = Math.atan2(
      points.p3.y - points.p2.y, 
      points.p3.x - points.p2.x);

    this.pEx = points.p2.x + this.dExt * Math.cos(this.thetaExt + this.P23angle);
    this.pEy = points.p2.y + this.dExt * Math.sin(this.thetaExt + this.P23angle);
    points.pE = {x:this.pEx, y:this.pEy};
   
    this.points = points; 
    return points;
  };

  addExport('Fourbar', Fourbar);
  addExport('FourbarExt', FourbarExt);
}());
