(function () {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var linkage = new FivebarExt(50, 50, 350, 50, 40, 200, 200, 50, Math.PI/6, 80);

  var theta = 0; 
  linkage.calcPath(100, 2, 0);
  linkage.drawPath(ctx);
  var buffer = ctx.getImageData(0, 0, canvas.width, canvas.height);

  (function f() {
    theta += .01;
    ctx.putImageData(buffer, 0, 0);
    linkage.calcPoints(theta, theta*2);
    linkage.draw(ctx);
    requestAnimationFrame(f);
  }());
}());
