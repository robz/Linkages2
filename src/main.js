window.onload = function () {
  Graphics.init(
    document.getElementById('my_canvas'),
    document.getElementById('outputTA'),
    document.getElementById('inputTA'),
    document.getElementById('controls')
  );

  function updateOutput(taID) {
    document.getElementById(taID).value = JSON.stringify(state.vector);
  }

  var linkage = Object.create(FivebarExt.prototype);
  var applyVector = Function.prototype.apply.bind(FivebarExt, linkage);
  var calcPath = linkage.calcPath.bind(linkage, 100, state.theta1rate, state.theta2rate, 0);
 
  state.update = function (v) {
    applyVector(v);
    calcPath();
    Graphics.setLinkagePath(linkage);
    state.vector = v;
    controllers.forEach(function (controller, i) {
      document.getElementById(controller.id).value = 
        controller.f_inv(v, i) * 100;
    });
    updateOutput('outputTA');
  };

  var canvas = document.getElementById('my_canvas');
  state.canvasWidth = canvas.width;
  state.canvasHeight = canvas.height;

  var controllers = makeControllers(state);

  state.update(state.vector);

  var optimizer = new LinkageOptimizer(FivebarExt);
  
  Graphics.onPathDrawn = function (path) {
    optimizer.start(path, state.vector, state.update);
  };

  document.getElementById('importButton').onmousedown = function (e) {
    var inputText = document.getElementById('inputTA').value;

    try {
      var vector = JSON.parse(inputText);
    } catch (err) {
      console.log(err); 
      return;
    }

    state.update(vector);
  }

  var pi2 = Math.PI*2;
  function boundTheta(theta) {
    return theta % pi2;
  }

  var theta = 0; 
  (function f() {
    theta += .01;
    linkage.calcPoints(theta, theta * state.theta2rate / state.theta1rate);
    Graphics.draw(linkage);
    requestAnimationFrame(f);
  }());
};
