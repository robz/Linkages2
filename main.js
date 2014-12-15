(function () {
  var OFFSET_X = 300;
  var OFFSET_Y = 100;

  var canvas = document.getElementById('canvas');
  canvas.width = document.body.clientWidth; //document.width is obsolete
  canvas.height = document.body.clientHeight; //document.height is obsolete

  var ctx = canvas.getContext('2d');
  ctx.translate(OFFSET_X, OFFSET_Y);
  var defaultBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height)
  ctx.arc(0,0,10,0,Math.PI*2,false);
  ctx.fill();
  var inputPathBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height)

  var linkage = Object.create(FivebarExt.prototype);
  var applyVector = Function.prototype.apply.bind(FivebarExt, linkage);
  var calcPath = linkage.calcPath.bind(linkage, 100, 2, 0);
 
  var initialVector = [50, 150, 350, 150, 40, 200, 200, 50, Math.PI/6, 80];

  function update(vector) {
    applyVector(vector);
    calcPath();
    ctx.putImageData(inputPathBuffer, 0, 0);
    linkage.drawPath(ctx);
    pathBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height)
  }
  
  update(initialVector);
  
  var optimizer = makeLinkageOptimizer([{pE:{x:0, y:0}}], initialVector, update);
  optimizer.start();

  var inputPath = [];
  var mouseIsDown = false;

  canvas.onmousedown = function (e) {
    mouseIsDown = true;
    inputPath = [];
    ctx.putImageData(defaultBuffer, 0, 0); 
    inputPathBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height)
  };

  canvas.onmousemove = function (e) {
    if (mouseIsDown) {
      var x = e.clientX - OFFSET_X;
      var y = e.clientY - OFFSET_Y;
      ctx.beginPath();
      ctx.putImageData(inputPathBuffer, 0, 0); 
      ctx.arc(x, y, 10, 0, Math.PI*2,false);
      ctx.fill();
      inputPathBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height)
      inputPath.push({pE:{x:x, y:y}});
    }
  };

  canvas.onmouseup = function () {
    mouseIsDown = false;
    optimizer = makeLinkageOptimizer(inputPath, optimizer.vector, update);
    optimizer.start();
  };
  
  var theta = 0; 
  (function f() {
    theta += .01;
    ctx.putImageData(pathBuffer, 0, 0);
    linkage.calcPoints(theta, theta*2);
    linkage.draw(ctx);
    requestAnimationFrame(f);
  }());
}());
