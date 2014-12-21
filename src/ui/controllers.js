var makeControllers = function (CENTER_X, CENTER_Y) {
  var pi2 = Math.PI * 2;
  var MAX_BAR_LEN = 500;

  var f_bar = function (x) { return x * MAX_BAR_LEN; };
  var f_bar_neg = function (x) { return (x - .5) * 2 * MAX_BAR_LEN; };
  var f_pos_x = function (x) { return (x - .5) * 2 * CENTER_X; };
  var f_pos_y = function (x) { return (x - .5) * 2 * CENTER_Y; };
  var f_angle = function (x) { return x * pi2; };
  
  var f_bar_inverse = function (v, i) { return v[i] / MAX_BAR_LEN; };
  var f_bar_neg_inverse = function (v, i) { return v[i] / MAX_BAR_LEN/ 2 + .5; };
  var f_pos_x_inverse = function (v, i) { return v[i] / 2 / CENTER_X + .5; };
  var f_pos_y_inverse = function (v, i) { return v[i] / 2 / CENTER_Y + .5; };
  var f_angle_inverse = function (v, i) { return (v[i] + pi2) % pi2 / pi2; };

  var g_regular = function (vector, value, i) { 
    vector[i] = value;
    return vector;
  };
  var g_translate_x = function (vector, value) {
    var diff = value - vector[0];
    vector[0] += diff;
    vector[2] += diff;
    return vector;
  };
  var g_translate_y = function (vector, value) {
    var diff = value - vector[1];
    vector[1] += diff;
    vector[3] += diff;
    return vector;
  };
  var g_rotate_p2 = function (vector, value) {
    var angle = value;
    var dx = vector[2] - vector[0];
    var dy = vector[3] - vector[1];
    var dist = Math.sqrt(dx*dx + dy*dy);
    vector[2] = vector[0] + dist * Math.cos(angle);
    vector[3] = vector[1] + dist * Math.sin(angle);
    return vector; 
  };
  var g_p12dist = function (vector, value) {
    var angle = Math.atan2(vector[3] - vector[1], vector[2] - vector[0]);
    var dist = value;
    vector[2] = vector[0] + dist * Math.cos(angle);
    vector[3] = vector[1] + dist * Math.sin(angle);
    return vector;
  };

  var g_translate_x_inverse = function (v, i) {
    return f_pos_x_inverse(v, 0);
  };
  var g_translate_y_inverse = function (v, i) {
    return f_pos_y_inverse(v, 1);
  };
  var g_rotate_p2_inverse = function (v, i) {
    var angle = Math.atan2(v[3] - v[1], v[2] - v[0]);
    return (angle + pi2) % pi2 / pi2;
  };
  var g_p12dist_inverse = function (v, i) {
    var dx = v[2] - v[0];
    var dy = v[3] - v[1];
    var dist = Math.sqrt(dx*dx + dy*dy);
    return dist / MAX_BAR_LEN;
  };

  var controllers = [
    { id: 'c1',  f: f_pos_x,   f_inv: f_pos_x_inverse,       g: g_regular },
    { id: 'c2',  f: f_pos_y,   f_inv: f_pos_y_inverse,       g: g_regular },
    { id: 'c3',  f: f_pos_x,   f_inv: f_pos_x_inverse,       g: g_regular },
    { id: 'c4',  f: f_pos_y,   f_inv: f_pos_y_inverse,       g: g_regular },
    { id: 'c5',  f: f_bar,     f_inv: f_bar_inverse,         g: g_regular },
    { id: 'c6',  f: f_bar,     f_inv: f_bar_inverse,         g: g_regular },
    { id: 'c7',  f: f_bar,     f_inv: f_bar_inverse,         g: g_regular },
    { id: 'c8',  f: f_bar,     f_inv: f_bar_inverse,         g: g_regular },
    { id: 'c9',  f: f_angle,   f_inv: f_angle_inverse,       g: g_regular },
    { id: 'c10', f: f_bar_neg, f_inv: f_bar_neg_inverse,     g: g_regular },
    { id: 'c11', f: f_pos_x,   f_inv: g_translate_x_inverse, g: g_translate_x },
    { id: 'c12', f: f_pos_y,   f_inv: g_translate_y_inverse, g: g_translate_y },
    { id: 'c13', f: f_angle,   f_inv: g_rotate_p2_inverse,   g: g_rotate_p2 },
    { id: 'c14', f: f_bar,     f_inv: g_p12dist_inverse,     g: g_p12dist },
  ];
  
  return controllers;
};
