window.onload = function () {
  var NUM_POINTS = 100;
  var randomizeValue = 20;

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
    document.getElementById('pathOptimizeButton'),
    'exploreRange',
    document.getElementById('stopOptmizationButton'),
    state
  );
  
  var linkage = Object.create(FivebarExt.prototype);
  function updateLinkage(newVector, theta1rate, theta2rate) {
    theta1rate = theta1rate || state.theta1rate;
    theta2rate = theta2rate || state.theta2rate;

    // set the linkage being drawn to have the new vector
    FivebarExt.apply(linkage, newVector);

    // calculate the traced path
    linkage.calcPath(NUM_POINTS, theta1rate, theta2rate, 0);

    // update ui elements
    state.vector = newVector;
    state.theta1rate = theta1rate; 
    state.theta2rate = theta2rate; 
    ui.setLinkagePath(linkage);
    ui.update(state);
  };
  
  updateLinkage(state.vector);

  // range inputs update the linkage
  ui.onControllerUpdate = function (state) {
    updateLinkage(state.vector, state.theta1rate, state.theta2rate);
  };
 
  // run the optimizer after drawing a single stroke 
  var optimizer = new LinkageOptimizer(FivebarExt, NUM_POINTS, state);
  ui.onOptimizePressed = function (path) {
    optimizer.start(path, state.vector, updateLinkage, randomizeValue);
  };

  // update the linkage when importing, after validation
  ui.onImportButtonPressed = function (inputText) {
    try {
      var newState = JSON.parse(inputText);
    } catch (err) {
      console.log('error while importing', err); 
      return;
    }
   
    if (
      newState.theta1rate === undefined || 
      newState.theta2rate === undefined ||
      newState.vector === undefined
    ) {
      console.log('import does not contain required properties:', newState);
      return;
    }
 
    try {
      updateLinkage(newState.vector, newState.theta1rate, newState.theta2rate);
    } catch (err) {
      console.log('error while importing: invalid configuration', err); 
      updateLinkage(state.vector);
    }
  };

  ui.onExploreChange = function (value) {
    randomizeValue = value;
  };

  ui.onStopOptmize = function () {
    optimizer.isOptimizing = false;
  };

  var theta = 0; 
  (function f() {
    theta += .01;
    linkage.calcPoints(theta, theta * state.theta2rate / state.theta1rate);
    ui.draw(linkage);
    requestAnimationFrame(f);
  }());
};
