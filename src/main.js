window.onload = function () {
  Graphics.init(
    document.getElementById('my_canvas'),
    document.getElementById('outputTA'),
    document.getElementById('inputTA'),
    document.getElementById('controls')
  );

  var linkage = Object.create(FivebarExt.prototype);
  var applyVector = Function.prototype.apply.bind(FivebarExt, linkage);
  var calcPath = linkage.calcPath.bind(linkage, 100, 2, 0);
 
  var vector = [-150, 0, 150, 0, 40, 200, 200, 50, Math.PI/6, 80];

  var controllers = makeControllers(Graphics.OFFSET_X, Graphics.OFFSET_Y);
  
  controllers.forEach(
    function (info, index) {
      var elem = document.getElementById(info.id);
      elem.value = info.f_inv(vector, index) * 100;
      elem.oninput = function (e) {
        var value = info.f(e.target.valueAsNumber / 100);
        var oldValue = vector[index];
        var newVector = info.g(vector.slice(), value, index);
        try {
          update(newVector);
        } catch (err) {
          update(vector);
        }
      };
    }
  );

  function updateOutput(taID) {
    document.getElementById(taID).value = JSON.stringify(vector);
  }

  function update(v) {
    applyVector(v);
    calcPath();
    Graphics.setLinkagePath(linkage);
    vector = v;
    controllers.forEach(function (controller, i) {
      document.getElementById(controller.id).value = 
        controller.f_inv(v, i) * 100;
    });
    updateOutput('outputTA');
  }
  
  update(vector);

  var optimizer = new LinkageOptimizer(FivebarExt);
  
  Graphics.onPathDrawn = function (path) {
    optimizer.start(path, vector, update);
  };

  document.getElementById('importButton').onmousedown = function (e) {
    var inputText = document.getElementById('inputTA').value;
    try {
      var vector = JSON.parse(inputText);
    } catch (err) {
      console.log(err); 
      return;
    }
    update(vector);
  }

  var theta = 0; 
  (function f() {
    theta += .01;
    linkage.calcPoints(theta, theta*2);
    Graphics.draw(linkage);
    requestAnimationFrame(f);
  }());
};
