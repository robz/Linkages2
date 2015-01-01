window.onload = function () {
  var FivebarExt = require('FivebarExt');
  var LinkageOptimizer = require('LinkageOptimizer');
  var makeUI = require('makeUI');

  var NUM_POINTS = 100;

  var randomizeValue = 20;
  var state = {
    vector: [-150, 0, 150, 0, 40, 200, 200, 50, Math.PI/6, 80],
    theta1rate: 2,
    theta2rate: 1,
    theta2phase: 0,
  };

  var linkage = Object.create(FivebarExt.prototype);
  var optimizer = new LinkageOptimizer(FivebarExt, NUM_POINTS, state);
  var ui = makeUI(
    {
      canvas: 'my_canvas',
      exportTextarea: 'outputTA',
      importTextarea: 'inputTA',
      importButton: 'importButton',
      pathOptimizeButton: 'pathOptimizeButton',
      exploreController: 'exploreRange',
      stopOptmizationButton: 'stopOptmizationButton',
      stateControllers: (function () {
        var arr = [];
        for (var i = 1; i <= 18; i++) { arr.push('c' + i); } 
        return arr;
      }())
    },
    state
  );
  
  ui.onExploreChange = function (value) {
    randomizeValue = value;
  };

  ui.onStopOptmize = function () {
    optimizer.isOptimizing = false;
  };
  
  // range inputs update the linkage
  ui.onControllerUpdate = function (state) {
    updateLinkage(state);
  };
 
  // run the optimizer after drawing a single stroke 
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
      newState.theta2phase === undefined ||
      newState.vector === undefined
    ) {
      console.log('import does not contain required properties:', newState);
      return;
    }
 
    try {
      updateLinkage(newState);
    } catch (err) {
      console.log('error while importing: invalid configuration', err); 
      updateLinkage(state);
    }
  };

  function updateLinkage(newState) {
    theta1rate = newState.theta1rate || state.theta1rate;
    theta2rate = newState.theta2rate || state.theta2rate;
    theta2phase = (newState.theta2phase !== undefined) 
      ? newState.theta2phase
      : state.theta2phase;

    // set the linkage being drawn to have the new vector
    FivebarExt.apply(linkage, newState.vector);

    // calculate the traced path
    // if the linkage was in an invalid configuration, this will throw
    linkage.calcPath(NUM_POINTS, theta1rate, theta2rate, theta2phase);

    // update "global" state
    state.vector = newState.vector;
    state.theta1rate = theta1rate; 
    state.theta2rate = theta2rate; 
    state.theta2phase = theta2phase; 

    // update ui elements
    ui.setLinkagePath(linkage);
    ui.update(state);
  };
  
  updateLinkage(state);

  var theta = 0; 
  (function f() {
    theta += .01;
    var theta2 = theta * state.theta2rate / state.theta1rate + state.theta2phase;
    linkage.calcPoints(theta, theta2);
    ui.draw(linkage);
    requestAnimationFrame(f);
  }());
};
