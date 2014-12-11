(function () {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.translate(300, 100);
  ctx.arc(0,0,10,0,Math.PI*2,false);
  ctx.fill();

  var linkage = Object.create(FivebarExt.prototype);

  var applyVector = Function.prototype.apply.bind(FivebarExt, linkage);
  var calcPath = linkage.calcPath.bind(linkage, 100, 2, 0);
 
  var obj = {buffer:null}; 
  var vector = [50, 150, 350, 150, 40, 200, 200, 50, Math.PI/6, 80];
  function update(vector) {
    applyVector(vector);
    calcPath();
    linkage.drawPath(ctx);
  }

  var buffer = ctx.getImageData(0, 0, canvas.width, canvas.height)
  update(vector);

  var optimize = makeBarOptimizer(applyVector, calcPath, [{pE:{x:0, y:0}}]);
  setInterval(function () {
    vector = optimize(vector);
    update(vector);
  }, 10);

  var theta = 0; 
  (function f() {
    theta += .01;
    ctx.putImageData(buffer, 0, 0);
    linkage.drawPath(ctx);
    linkage.calcPoints(theta, theta*2);
    linkage.draw(ctx);
    requestAnimationFrame(f);
  }());
}());
