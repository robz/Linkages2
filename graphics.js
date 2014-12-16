var Graphics = (function () {
  var that = {};

  var OFFSET_X = 300;
  var OFFSET_Y = 100;

  var ctx = null;
  var defaultBuffer = null;
  var inputPathBuffer = null;

  var path = [];
  var mouseIsDown = false;

  function addToPath(e) {
    var x = e.clientX - OFFSET_X;
    var y = e.clientY - OFFSET_Y;
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

    ctx.beginPath();
    ctx.moveTo(path[0].pE.x, path[0].pE.y);
    path.forEach(function (e) {
      ctx.lineTo(e.pE.x, e.pE.y);
    });
    ctx.stroke();

    path.forEach(function (e) {
      ctx.beginPath();
      ctx.arc(e.pE.x, e.pE.y, 3, 0, Math.PI*2, false);
      ctx.fill();
    });
  }

  that.onPathDrawn = function () {};

  that.init = function (canvas) {
    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = document.body.clientHeight; //document.height is obsolete

    ctx = canvas.getContext('2d');
    ctx.translate(OFFSET_X, OFFSET_Y);

    defaultBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height)
    linkagePathBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height)

    canvas.onmousedown = onMouseDown;
    canvas.onmousemove = onMouseMove;
    canvas.onmouseup = onMouseUp;
  };

  that.setLinkagePath = function (linkage) {
    ctx.putImageData(defaultBuffer, 0, 0);
    linkage.drawPath(ctx);
    linkagePathBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height)
  };

  that.draw = function (linkage) {
    ctx.putImageData(linkagePathBuffer, 0, 0);
    linkage.draw(ctx);
    drawPath();
  };

  return that;
}());
