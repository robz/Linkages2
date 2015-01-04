/**
 * @providesModule makeUI
 */

addModule('makeUI', 
  
function (elementIDs, state) {
  var makeControllers = require('makeControllers');
  var makeController = require('makeController');

  // elements
  var canvas = document.getElementById(elementIDs.canvas);
  var exportTextarea = document.getElementById(elementIDs.exportTextarea);
  var importTextarea = document.getElementById(elementIDs.importTextarea);
  var importButton = document.getElementById(elementIDs.importButton);
  var pathOptimizeButton = document.getElementById(elementIDs.pathOptimizeButton);
  var stopOptmizationButton = document.getElementById(elementIDs.stopOptmizationButton);

  var IMPORT_BUTTON_HEIGHT = importButton.clientHeight;
  var TA_WIDTH = 200; 

  var that = {};

  // empty event handlers
  that.onPathDrawn = function () {};
  that.onImportButtonPressed = function () {};
  that.onControllerUpdate = function () {};
  that.onOptimizePressed = function () {};
  that.onExploreChange = function () {};
  that.onStopOptmize = function () {};

  canvas.width = document.body.clientWidth - TA_WIDTH*2;
  canvas.height = document.body.clientHeight;
  canvas.onmousedown = onMouseDown;
  canvas.onmousemove = onMouseMove;
  canvas.onmouseup = onMouseUp;

  that.canvasWidth = canvas.width;
  that.canvasHeight = canvas.height;
  that.OFFSET_X = canvas.width/2;
  that.OFFSET_Y = canvas.height/2;
  
  var controllers = makeControllers(
    elementIDs.stateControllers,
    state, 
    that.canvasWidth, 
    that.canvasHeight, 
    function (state) { 
      that.onControllerUpdate(state); 
    }
  );

  [exportTextarea, importTextarea].forEach(function (ta) { 
    ta.style.height = (document.body.clientHeight - 10*IMPORT_BUTTON_HEIGHT)/2;
    ta.style.width = TA_WIDTH;
  });
  
  var ctx = canvas.getContext('2d');
  ctx.scale(1, -1);
  ctx.translate(that.OFFSET_X, -that.OFFSET_Y);
  linkagePathBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height)

  importButton.onmousedown = function () {
    that.onImportButtonPressed(importTextarea.value);
  };

  pathOptimizeButton .onmousedown = function () {
    that.onOptimizePressed(path.slice());
    flagPathToBeCleared = true;
  };

  stopOptmizationButton.onmousedown = function () {
    that.onStopOptmize();
  };

  makeController(
    elementIDs.exploreController, 
    20, 
    function (value) {
      return value*100;
    }, 
    function (value) {
      return value/100;
    }, 
    function (value) {
      that.onExploreChange(value);
    }
  );

  var path = [];
  var mouseIsDown = false;
  var flagPathToBeCleared = false;

  function addToPath(e) {
    var x = e.clientX - that.OFFSET_X - 200;
    var y = e.clientY - that.OFFSET_Y;
    path.push({pE:{x:x, y:y}});
  }

  function onMouseDown(e) {
    mouseIsDown = true;
    if (flagPathToBeCleared) {
      path = [];
      flagPathToBeCleared = false;
    }
    addToPath(e);
  };

  function onMouseMove(e) {
    if (mouseIsDown) {
      addToPath(e);
    }
  };

  function onMouseUp() {
    mouseIsDown = false;
    that.onPathDrawn(path);
  };

  function drawPath() {
    if (path.length === 0) {
      return;
    }
    
    ctx.save();    

    ctx.strokeStyle = 'blue';
    ctx.fillStyle = 'blue';

    ctx.beginPath();
    ctx.moveTo(path[0].pE.x, path[0].pE.y);
    path.forEach(function (e) {
      ctx.lineTo(e.pE.x, e.pE.y);
    });
    ctx.stroke();

    path.forEach(function (e) {
      ctx.beginPath();
      ctx.arc(e.pE.x, e.pE.y, 1, 0, Math.PI*2, false);
      ctx.fill();
    });

    ctx.restore();
  }

  that.setLinkagePath = function (linkage) {
    ctx.clearRect(-that.OFFSET_X, -that.OFFSET_Y, canvas.width, canvas.height);
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    linkage.drawPath(ctx);
    ctx.restore();
    linkagePathBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height)
  };

  function drawLine(p1x, p1y, p2x, p2y) {
    ctx.save();
    ctx.strokeStyle = 'darkGray';
    ctx.lineWidth = 2;  
    ctx.beginPath(); 
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.stroke(); 
    ctx.restore();
  }

  that.draw = function (linkage) {
    // put the traced path on the butfer
    ctx.putImageData(linkagePathBuffer, 0, 0);

    // draw the axis lines
    drawLine(-canvas.width/2, 0, canvas.width/2, 0);
    drawLine(0, -canvas.height/2, 0, canvas.height/2);

    // draw the linkage itself
    linkage.draw(ctx);

    // draw the user-drawn path
    drawPath();
  };

  that.update = function (state) {
    // range inputs
    controllers.forEach(function (controller, i) {
      controller.elem.value = controller.f_inv(state.vector[i]) * 100;
    });

    // export text area
    exportTextarea.value = JSON.stringify(state);
  }

  return that;
});
