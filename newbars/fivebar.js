var Fivebar = function (p1x, p1y, p5x, p5y, a, b, c, d) {
  this.p1x = p1x;
  this.p1y = p1y;
  this.p5x = p5x;
  this.p5y = p5y;
  this.a = a;
  this.b = b;
  this.c = c;
  this.d = d;
  this.Fourbar = Fourbar;
};

Fivebar.prototype.calcPoints = function (theta1, theta2) {
  var P14angle = Math.atan2(p4y - p1y, p4x - p1x);
  var P15angle = Math.atan2(p5y - p1y, p5x - p1x);
  var diff = P14angle - P15angle;
  var fourbarTheta1 = (theta1 - diff + Math.PI * 2) % (Math.PI * 2);
  
  var P45angle = theta2 + P15angle;
  this.p4x = this.p5x + this.d * Math.cos(P45angle);
  this.p4y = this.p5y + this.d * Math.sin(P45angle);

  var points = this.Fourbar.prototype.calcPoints.call(this, fourbarTheta1);
  points.p4 = {x:p4x, y:p4y};
  return points;
};


var FivebarExt = function(p1x, p1y, p5x, p5y, a, b, c, d, thetaExt, dExt) {
  Fivebar.call(this, p1x, p1y, p5x, p5y, a, b, c, d);

  this.dExt = dExt;
  this.thetaExt = thetaExt;
  this.Fourbar = FourbarExt;
};

FivebarExt.prototype = new Fivebar();
FivebarExt.prototype.constructor = FivebarExt;

