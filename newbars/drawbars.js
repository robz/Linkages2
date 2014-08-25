// usage: 
//  bar.calcPath(numPoints);
//  bar.draw(ctx);

(function () {
  var radius = 2;

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
    ctx.beginPath(); 
    ctx.moveTo(this.points.p2.x, this.points.p2.y);
    ctx.lineTo(this.points.pE.x, this.points.pE.y);
    ctx.lineTo(this.points.p3.x, this.points.p3.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.pEx, this.pEy, radius, 0, Math.PI*2, false);
    ctx.stroke();
  }

  Fourbar.prototype.draw = function (ctx) {
    ctx.beginPath(); 
    ctx.moveTo(this.p1x, this.p1y);
    ctx.lineTo(this.points.p2.x, this.points.p2.y);
    ctx.lineTo(this.points.p3.x, this.points.p3.y);
    ctx.lineTo(this.p4x, this.p4y);
    ctx.stroke();
   
    ctx.beginPath(); 
    ctx.arc(this.p1x, this.p1y, radius, 0, Math.PI*2, false);
    ctx.fill();
    
    ctx.beginPath(); 
    ctx.arc(this.points.p2.x, this.points.p2.y, radius, 0, Math.PI*2, false);
    ctx.fill();
    
    ctx.beginPath(); 
    ctx.arc(this.points.p3.x, this.points.p3.y, radius, 0, Math.PI*2, false);
    ctx.fill();
   
    ctx.beginPath(); 
    ctx.arc(this.p4x, this.p4y, radius, 0, Math.PI*2, false);
    ctx.fill();
  }

  FourbarExt.prototype.draw = function (ctx) {
    Fourbar.prototype.draw.call(this, ctx);
    drawExt.call(this, ctx);
  };

  Fivebar.prototype.draw = function (ctx) {
    ctx.moveTo(this.p1x, this.p1y);
    ctx.lineTo(this.points.p2.x, this.points.p2.y);
    ctx.lineTo(this.points.p3.x, this.points.p3.y);
    ctx.lineTo(this.points.p4.x, this.points.p4.y);
    ctx.lineTo(this.p5x, this.p5y);
    ctx.stroke();
    
    ctx.beginPath(); 
    ctx.arc(this.p1x, this.p1y, radius, 0, Math.PI*2, false);
    ctx.stroke();
    
    ctx.beginPath(); 
    ctx.arc(this.points.p2.x, this.points.p2.y, radius, 0, Math.PI*2, false);
    ctx.stroke();
    
    ctx.beginPath(); 
    ctx.arc(this.points.p3.x, this.points.p3.y, radius, 0, Math.PI*2, false);
    ctx.stroke();
    
    ctx.beginPath(); 
    ctx.arc(this.points.p4.x, this.points.p4.y, radius, 0, Math.PI*2, false);
    ctx.stroke();
    
    ctx.beginPath(); 
    ctx.arc(this.p5x, this.p5y, radius, 0, Math.PI*2, false);
    ctx.stroke();
  };

  FivebarExt.prototype.draw = function (ctx) {
    Fivebar.prototype.draw.call(this, ctx);
    drawExt.call(this, ctx);
  };

  FourbarExt.prototype.drawPath = drawPath;
  FivebarExt.prototype.drawPath = drawPath;
}());
