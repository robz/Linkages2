var Graphics = (function () {
  var that = {};

  var ctx = null;
  var canvas = null;
  var inputPathBuffer = null;

  var path = [];
  var mouseIsDown = false;

  function addToPath(e) {
    var x = e.clientX - that.OFFSET_X - 200;
    var y = e.clientY - that.OFFSET_Y;
    path.push({pE:{x:x, y:y}});
  }

  function onMouseDown(e) {
    mouseIsDown = true;
    path = [];
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

  that.onPathDrawn = function () {};

  that.init = function (_canvas, _outputTA, _inputTA, _controls) {
    canvas = _canvas;

    canvas.width = document.body.clientWidth - 400;
    canvas.height = document.body.clientHeight;
    that.OFFSET_X = canvas.width/2;
    that.OFFSET_Y = canvas.height/2;
  
    [_outputTA, _inputTA].forEach(function (ta) { 
      ta.style.width = 200;
      ta.style.height = (document.body.clientHeight - 40)/2;
    });
    
    ctx = canvas.getContext('2d');
    ctx.translate(that.OFFSET_X, that.OFFSET_Y);
    linkagePathBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height)

    canvas.onmousedown = onMouseDown;
    canvas.onmousemove = onMouseMove;
    canvas.onmouseup = onMouseUp;
  };

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
    console.log('hi');
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
    ctx.putImageData(linkagePathBuffer, 0, 0);
    drawLine(-canvas.width/2, 0, canvas.width/2, 0);
    drawLine(0, -canvas.height/2, 0, canvas.height/2);
    linkage.draw(ctx);
    drawPath();
  };

  return that;
}());
