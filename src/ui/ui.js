var makeUI = function (
  _canvas, 
  _outputTA, 
  _inputTA, 
  _importButton, 
  _optimizeButton, 
  _explorationInputId,
  _stopOptmizeButton,
  state
) {
  var IMPORT_BUTTON_HEIGHT = _importButton.clientHeight;
  var TA_WIDTH = 200; 

  var that = {};

  // empty event handlers
  that.onPathDrawn = function () {};
  that.onImportButtonPressed = function () {};
  that.onControllerUpdate = function () {};
  that.onOptimizePressed = function () {};
  that.onExploreChange = function () {};
  that.onStopOptmize = function () {};

  _canvas.width = document.body.clientWidth - TA_WIDTH*2;
  _canvas.height = document.body.clientHeight;
  _canvas.onmousedown = onMouseDown;
  _canvas.onmousemove = onMouseMove;
  _canvas.onmouseup = onMouseUp;

  that.canvasWidth = _canvas.width;
  that.canvasHeight = _canvas.height;
  that.OFFSET_X = _canvas.width/2;
  that.OFFSET_Y = _canvas.height/2;
  
  var controllers = makeControllers(
    state, 
    that.canvasWidth, 
    that.canvasHeight, 
    function (state) { 
      that.onControllerUpdate(state); 
    }
  );

  [_outputTA, _inputTA].forEach(function (ta) { 
    ta.style.height = (document.body.clientHeight - 10*IMPORT_BUTTON_HEIGHT)/2;
    ta.style.width = TA_WIDTH;
  });
  
  var ctx = _canvas.getContext('2d');
  ctx.translate(that.OFFSET_X, that.OFFSET_Y);
  linkagePathBuffer = ctx.getImageData(0, 0, _canvas.width, _canvas.height)

  _importButton.onmousedown = function () {
    that.onImportButtonPressed(_inputTA.value);
  };

  _optimizeButton.onmousedown = function () {
    that.onOptimizePressed(path.slice());
    flagPathToBeCleared = true;
  };

  _stopOptmizeButton.onmousedown = function () {
    that.onStopOptmize();
  };

  makeController(
    _explorationInputId, 
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
    ctx.clearRect(-that.OFFSET_X, -that.OFFSET_Y, _canvas.width, _canvas.height);
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    linkage.drawPath(ctx);
    ctx.restore();
    linkagePathBuffer = ctx.getImageData(0, 0, _canvas.width, _canvas.height)
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
    drawLine(-_canvas.width/2, 0, _canvas.width/2, 0);
    drawLine(0, -_canvas.height/2, 0, _canvas.height/2);

    // draw the linkage itself
    linkage.draw(ctx);

    // draw the user-drawn path
    drawPath();
  };

  that.update = function (state) {
    // range inputs
    controllers.forEach(function (controller, i) {
      document.getElementById(controller.id).value = 
        controller.f_inv(state.vector[i]) * 100;
    });

    // export text area
    _outputTA.value = JSON.stringify(state);
  }

  return that;
};
