var makeCanvas = function (canvas, OFFSET_X, OFFSET_Y) {
  var that = {};

  var path = [];
  var mouseIsDown = false;
  var flagPathToBeCleared = false;
  
  canvas.onmousedown = onMouseDown;
  canvas.onmousemove = onMouseMove;
  canvas.onmouseup = onMouseUp;

  var ctx = canvas.getContext('2d');
  ctx.translate(OFFSET_X, OFFSET_Y);
  linkagePathBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height)

  that.setLinkagePath = function (linkage) {
    ctx.clearRect(-OFFSET_X, -OFFSET_Y, canvas.width, canvas.height);
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    linkage.drawPath(ctx);
    ctx.restore();
    linkagePathBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height)
  };

  that.draw = function (linkage) {
    // put the traced path on the butfer
    ctx.putImageData(linkagePathBuffer, 0, 0);

    // draw the axis lines
    drawLine(-canvas.width/2, 0, canvas.width/2, 0);
    drawLine(0, -canvas.height/2, 0, canvas.height/2);

    // draw the linkage itself
    linkage.draw(ctx);

    // draw the user-drawn path
    drawPath(path);
  };

  function addToPath(e) {
    var x = e.clientX - OFFSET_X - 200;
    var y = e.clientY - OFFSET_Y;
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
  };

  function drawPath(path) {
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

};
