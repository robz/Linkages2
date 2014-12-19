(function () {
  Graphics.init(document.getElementById('canvas'));

  var linkage = Object.create(FivebarExt.prototype);
  var applyVector = Function.prototype.apply.bind(FivebarExt, linkage);
  var calcPath = linkage.calcPath.bind(linkage, 1000, 2, 0);
 
  var vector = [50, 150, 350, 150, 40, 200, 200, 50, Math.PI/6, 80];

  function update(v) {
    applyVector(v);
    calcPath();
    Graphics.setLinkagePath(linkage);
    vector = v;
  }
  
  update(vector);
  
  Graphics.onPathDrawn = function (path) {
    var optimizer = makeLinkageOptimizer(path, vector, update);
    optimizer.start();
  };

  var theta = 0; 
  (function f() {
    theta += .01;
    linkage.calcPoints(theta, theta*2);
    Graphics.draw(linkage);
    requestAnimationFrame(f);
  }());
}());
