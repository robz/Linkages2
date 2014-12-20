window.onload = function () {
  Graphics.init(
    document.getElementById('my_canvas'),
    document.getElementById('outputTA'),
    document.getElementById('inputTA'),
    document.getElementById('controls')
  );

  var linkage = Object.create(FivebarExt.prototype);
  var applyVector = Function.prototype.apply.bind(FivebarExt, linkage);
  var calcPath = linkage.calcPath.bind(linkage, 100, 2, 0);
 
  var vector = [-150, 0, 150, 0, 40, 200, 200, 50, Math.PI/6, 80];

  function update(v) {
    applyVector(v);
    calcPath();
    Graphics.setLinkagePath(linkage);
    vector = v;
  }
  
  update(vector);
  
  Graphics.onPathDrawn = function (path) {
    var optimizer = makeLinkageOptimizer(path, vector, update);
    optimizer.start();
  };

  // from -100 to 100
  var f_bar = function (x) { return x * 300; };
  var f_bar_inverse = function (x) { return x / 300; };
  var f_pos_x = function (x) { return (x - .5) * 2 * Graphics.OFFSET_X; };
  var f_pos_x_inverse = function (x) { return x / 2 / Graphics.OFFSET_X + .5; };
  var f_pos_y = function (x) { return (x - .5) * 2 * Graphics.OFFSET_Y; };
  var f_pos_y_inverse = function (x) { return x / 2 / Graphics.OFFSET_Y + .5; };
  var f_angle = function (x) { return x * Math.PI * 2; };
  var f_angle_inverse = function (x) { return x / Math.PI * 2; };

  [
    { id: 'c1',  f: f_pos_x, f_inverse: f_pos_x_inverse },
    { id: 'c2',  f: f_pos_y, f_inverse: f_pos_y_inverse },
    { id: 'c3',  f: f_pos_x, f_inverse: f_pos_x_inverse },
    { id: 'c4',  f: f_pos_y, f_inverse: f_pos_y_inverse },
    { id: 'c5',  f: f_bar, f_inverse: f_bar_inverse },
    { id: 'c6',  f: f_bar, f_inverse: f_bar_inverse },
    { id: 'c7',  f: f_bar, f_inverse: f_bar_inverse },
    { id: 'c8',  f: f_bar, f_inverse: f_bar_inverse },
    { id: 'c9',  f: f_angle, f_inverse: f_angle_inverse },
    { id: 'c10',  f: f_bar, f_inverse: f_bar_inverse },
  ].forEach(function (info, index) {
    var elem = document.getElementById(info.id);
    elem.value = info.f_inverse(vector[index]) * 100;
    elem.oninput = function (e) {
      var value = info.f(e.target.valueAsNumber / 100);
      var oldValue = vector[index];
      var newVector = vector.slice();
      newVector[index] = value;
      try {
        update(newVector);
      } catch (err) {
        update(vector);
        e.target.value = info.f_inverse(oldValue) * 100;
      }
    };
  });

  var theta = 0; 
  (function f() {
    theta += .01;
    linkage.calcPoints(theta, theta*2);
    Graphics.draw(linkage);
    requestAnimationFrame(f);
  }());
};
