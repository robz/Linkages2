window.onload = function () {
  var NUM_POINTS = 100;

  var state = {
    vector: [-150, 0, 150, 0, 40, 200, 200, 50, Math.PI/6, 80],
    theta1rate: 1,
    theta2rate: 3,
  };

  var ui = makeUI(
    document.getElementById('my_canvas'),
    document.getElementById('outputTA'),
    document.getElementById('inputTA'),
    document.getElementById('importButton'),
    state
  );
  
  var linkage = Object.create(FivebarExt.prototype);
  function updateLinkage(newVector) {
    state.vector = newVector;

    // set the linkage being drawn to have the new vector
    FivebarExt.apply(linkage, state.vector);

    // calculate the traced path
    linkage.calcPath(NUM_POINTS, state.theta1rate, state.theta2rate, 0);

    // update ui elements
    ui.setLinkagePath(linkage);
    ui.update(state);
  };

  ui.onControllerUpdate = updateLinkage;
  
  updateLinkage(state.vector);

  var optimizer = new LinkageOptimizer(FivebarExt, NUM_POINTS, state);
  ui.onPathDrawn = function (path) {
    optimizer.start(path, state.vector, updateLinkage);
  };

  //document.getElementById('importButton').onmousedown = function (e) {
  //  var inputText = document.getElementById('inputTA').value;
  ui.onImportButtonPressed = function (inputText) {
    try {
      var vector = JSON.parse(inputText).vector;
    } catch (err) {
      console.log(err); 
      return;
    }

    updateLinkage(vector);
  }

  var theta = 0; 
  (function f() {
    theta += .01;
    linkage.calcPoints(theta, theta * state.theta2rate / state.theta1rate);
    ui.draw(linkage);
    requestAnimationFrame(f);
  }());
};
