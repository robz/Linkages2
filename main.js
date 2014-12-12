(function () {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.translate(300, 100);
  ctx.arc(0,0,10,0,Math.PI*2,false);
  ctx.fill();

  var linkage = Object.create(FivebarExt.prototype);
  var applyVector = Function.prototype.apply.bind(FivebarExt, linkage);
  var calcPath = linkage.calcPath.bind(linkage, 100, 2, 0);
 
  var initialVector = [50, 150, 350, 150, 40, 200, 200, 50, Math.PI/6, 80];

  function update(vector) {
    applyVector(vector);
    calcPath();
    ctx.putImageData(buffer, 0, 0);
    linkage.drawPath(ctx);
    pathBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height)
  }

  var buffer = ctx.getImageData(0, 0, canvas.width, canvas.height)
  update(initialVector);

  (function (vector) {
    var MAX_OPTIMIZE_STEPS = 10000;
    var count = 0;

    var linkage = Object.create(FivebarExt.prototype);
    var optimize = makeBarOptimizer(
      Function.prototype.apply.bind(FivebarExt, linkage),
      linkage.calcPath.bind(linkage, 100, 2, 0),
      [{pE:{x:0, y:0}}]
    );

    setTimeout(function f() {
      var res = optimize(vector, count, MAX_OPTIMIZE_STEPS);
      vector = res.vector;
      update(vector);

      if (res.error > 1) {
        setTimeout(f, 10);
        count += res.count;
      }
    }, 10);
  }(initialVector));

  var theta = 0; 
  (function f() {
    theta += .01;
    ctx.putImageData(pathBuffer, 0, 0);
    linkage.calcPoints(theta, theta*2);
    linkage.draw(ctx);
    requestAnimationFrame(f);
  }());
}());
