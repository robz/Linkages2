var Fourbar = function (p1x, p1y, p4x, p4y, a, b, c) {
  this.p1x = p1x;
  this.p1y = p1y;
  this.p4x = p4x;
  this.p4y = p4y;
  this.a = a;
  this.b = b;
  this.c = c;
};
        
Fourbar.prototype.calcPoints = (function {
  function acos(x) {
    if (x > 1 + 1e-6 || x < -1 - 1e-6) { throw "acos(" + x + ")"; }
    return Math.acos(x);
  }
            
  function sqrt(x) {
    if (x < 0) { throw "sqrt(" + x + ")"; }
    return Math.sqrt(x);
  }

  function euclid(p1x, p1y, p2x, p2y) {
    var dx = p2x - p1x;
    var dy = p2y - p1y;
    return Math.sqrt(dx*dx + dy*dy);
  }

  return function (theta1) {
    // convienence definitions
    var a = this.a;
    var b = this.b;
    var c = this.c;
    var d = euclid(this.p1x, this.p1y, this.p2x, this.p2y);

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
    
    // now calculate the points 
    var p2x = p1x + a * Math.cos(zeta + theta2);
    var p2y = p1y + a * Math.sin(zeta + theta2);
    
    var p3x = p2x + b * Math.cos(zeta + theta3);
    var p3y = p2y + b * Math.sin(zeta + theta3);
    
    // consistency check
    var p3x_2 = p4x + c * Math.cos(zeta + theta4);
    var p3y_2 = p4y + c * Math.sin(zeta + theta4);
    
    if (Math.abs(p3x_2 - p3x) > 1e-6
        || Math.abs(p3y_2 - p3y) > 1e-6) 
    {
        throw "error: consistency calculation for p3 failed";
    }

    // optimization: save theta3 for FourbarExt calcPoints
    // this.P23angle = theta3;

    return {p2:{x:p2x, y:p2y}, p3:{x:p3x, y:p3y}};
  };
}());


var FourbarExt = function (p1x, p1y, p4x, p4y, a, b, c, thetaExt, dExt) {
  Fourbar.call(this, p1x, p1y, p4x, p4y, a, b, c);
  
  this.dExt = dExt;
  this.thetaExt = thetaExt;
};

FourbarExt.prototype = new Fourbar();
FourbarExt.prototype.constructor = FourbarExt;

FourbarExt.prototype.calcPoints = function (input1) {
  var points = Fourbar.prototype.calcPoints.call(input1);

  // recalculate theta3 from Fourbar calcPoints
  this.P23angle = Math.atan2(points[3] - points[1], points[2] - points[0]);

  var pEx = points[0] + this.dExt * Math.cos(this.thetaExt + this.P23angle);
  var pEy = points[1] + this.dExt * Math.sin(this.thetaExt + this.P23angle);
  points.pE = {x:pEx, y:pEy};
  
  return points;
};

