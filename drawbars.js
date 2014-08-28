// usage: 
//  bar.calcPath(numPoints);
//  bar.draw(ctx);

(function () {
  var radius = 3;

  function drawLines(ctx) {
    for (var i = 1; i < arguments.length-3; i += 2) {
      ctx.beginPath();
      ctx.moveTo(arguments[i], arguments[i+1]);
      ctx.lineTo(arguments[i+2], arguments[i+3]);
      ctx.closePath();
      ctx.stroke();
    }
  }

  function drawCircle(ctx, x, y) {
    ctx.beginPath(); 
    ctx.arc(x, y, radius, 0, Math.PI*2, false);
    ctx.fill();
  }

  function drawPath(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.path[0].pE.x, this.path[1].pE.y);
    this.path.forEach(function (e) {
      ctx.lineTo(e.pE.x, e.pE.y);
    });
    ctx.lineTo(this.path[0].pE.x, this.path[1].pE.y);
    ctx.stroke();
  }

  function drawExt(ctx) {
    drawCircle(ctx, this.pEx, this.pEy);

    drawLines(ctx,
      this.points.p2.x, this.points.p2.y,
      this.points.pE.x, this.points.pE.y,
      this.points.p3.x, this.points.p3.y);
  }

  Fourbar.prototype.draw = function (ctx) {
    drawCircle(ctx, this.p1x, this.p1y);
    drawCircle(ctx, this.points.p2.x, this.points.p2.y);
    drawCircle(ctx, this.points.p3.x, this.points.p3.y);
    drawCircle(ctx, this.p4x, this.p4y);

    drawLines(ctx,
      this.p1x, this.p1y,
      this.points.p2.x, this.points.p2.y,
      this.points.p3.x, this.points.p3.y,
      this.p4x, this.p4y);
  };

  FourbarExt.prototype.draw = function (ctx) {
    Fourbar.prototype.draw.call(this, ctx);
    drawExt.call(this, ctx);
  };

  Fivebar.prototype.draw = function (ctx) {
    drawCircle(ctx, this.p1x, this.p1y);
    drawCircle(ctx, this.points.p2.x, this.points.p2.y);
    drawCircle(ctx, this.points.p3.x, this.points.p3.y);
    drawCircle(ctx, this.points.p4.x, this.points.p4.y);
    drawCircle(ctx, this.p5x, this.p5y);

    drawLines(ctx,
      this.p1x, this.p1y,
      this.points.p2.x, this.points.p2.y,
      this.points.p3.x, this.points.p3.y,
      this.points.p4.x, this.points.p4.y,
      this.p5x, this.p5y);
  };

  FivebarExt.prototype.draw = function (ctx) {
    Fivebar.prototype.draw.call(this, ctx);
    drawExt.call(this, ctx);
  };

  FourbarExt.prototype.drawPath = drawPath;
  FivebarExt.prototype.drawPath = drawPath;
}());
