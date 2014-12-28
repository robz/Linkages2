addExport('makeControllers',

function (controllerIDs, state, canvasWidth, canvasHeight, onUpdate) {
  var makeController = require('makeController');

  var CENTER_X = canvasWidth/2;
  var CENTER_Y = canvasHeight/2;

  var pi2 = Math.PI * 2;
  var MAX_BAR_LEN = 500;

  var f_bar = function (x) { return x * MAX_BAR_LEN; };
  var f_bar_neg = function (x) { return (x - .5) * 2 * MAX_BAR_LEN; };
  var f_pos_x = function (x) { return (x - .5) * 2 * CENTER_X; };
  var f_pos_y = function (x) { return (x - .5) * 2 * CENTER_Y; };
  var f_angle = function (x) { return x * pi2; };
  var f_rate = function (x) { return Math.floor(x*10 + 1); }
  
  var f_bar_inverse = function (value) { return value / MAX_BAR_LEN; };
  var f_bar_neg_inverse = function (value) { return value / MAX_BAR_LEN/ 2 + .5; };
  var f_pos_x_inverse = function (value) { return value / 2 / CENTER_X + .5; };
  var f_pos_y_inverse = function (value) { return value / 2 / CENTER_Y + .5; };
  var f_angle_inverse = function (value) { return (value + pi2) % pi2 / pi2; };

  var g_regular = function (state, value, i) { 
    state.vector[i] = value;
    return state;
  };
  var g_translate_x = function (state, value) {
    var diff = value - state.vector[0];
    state.vector[0] += diff;
    state.vector[2] += diff;
    return state;
  };
  var g_translate_y = function (state, value) {
    var diff = value - state.vector[1];
    state.vector[1] += diff;
    state.vector[3] += diff;
    return state;
  };
  var g_rotate_p2 = function (state, value) {
    var angle = value;
    var dx = state.vector[2] - state.vector[0];
    var dy = state.vector[3] - state.vector[1];
    var dist = Math.sqrt(dx*dx + dy*dy);
    state.vector[2] = state.vector[0] + dist * Math.cos(angle);
    state.vector[3] = state.vector[1] + dist * Math.sin(angle);
    return state; 
  };
  var g_p12dist = function (state, value) {
    var angle = Math.atan2(
      state.vector[3] - state.vector[1], 
      state.vector[2] - state.vector[0]
    );
    var dist = value;
    state.vector[2] = state.vector[0] + dist * Math.cos(angle);
    state.vector[3] = state.vector[1] + dist * Math.sin(angle);
    return state;
  };
  var g_theta1rate = function (state, value) {
    state.theta1rate = value; 
    console.log(state);
    return state;
  }
  var g_theta2rate = function (state, value) {
    state.theta2rate = value; 
    return state;
  }

  var g_translate_x_inverse = function () {
    return f_pos_x_inverse(state.vector[0]);
  };
  var g_translate_y_inverse = function () {
    return f_pos_y_inverse(state.vector[1]);
  };
  var g_rotate_p2_inverse = function () {
    var angle = Math.atan2(
      state.vector[3] - state.vector[1], 
      state.vector[2] - state.vector[0]
    );
    return (angle + pi2) % pi2 / pi2;
  };
  var g_p12dist_inverse = function () {
    var dx = state.vector[2] - state.vector[0];
    var dy = state.vector[3] - state.vector[1];
    var dist = Math.sqrt(dx*dx + dy*dy);
    return dist / MAX_BAR_LEN;
  };
  var g_theta1rate_inverse = function () {
    return state.theta1rate/10;
  }
  var g_theta2rate_inverse = function () {
    return state.theta2rate/10;
  }

  var controllers = [
    { f: f_pos_x,   f_inv: f_pos_x_inverse,       g: g_regular },
    { f: f_pos_y,   f_inv: f_pos_y_inverse,       g: g_regular },
    { f: f_pos_x,   f_inv: f_pos_x_inverse,       g: g_regular },
    { f: f_pos_y,   f_inv: f_pos_y_inverse,       g: g_regular },
    { f: f_bar,     f_inv: f_bar_inverse,         g: g_regular },
    { f: f_bar,     f_inv: f_bar_inverse,         g: g_regular },
    { f: f_bar,     f_inv: f_bar_inverse,         g: g_regular },
    { f: f_bar,     f_inv: f_bar_inverse,         g: g_regular },
    { f: f_angle,   f_inv: f_angle_inverse,       g: g_regular },
    { f: f_bar_neg, f_inv: f_bar_neg_inverse,     g: g_regular },
    { f: f_pos_x,   f_inv: g_translate_x_inverse, g: g_translate_x },
    { f: f_pos_y,   f_inv: g_translate_y_inverse, g: g_translate_y },
    { f: f_angle,   f_inv: g_rotate_p2_inverse,   g: g_rotate_p2 },
    { f: f_bar,     f_inv: g_p12dist_inverse,     g: g_p12dist },
    { f: f_rate,    f_inv: g_theta1rate_inverse,  g: g_theta1rate },
    { f: f_rate,    f_inv: g_theta2rate_inverse,  g: g_theta2rate },
  ];

  function makeOnInput(info, index) {
    return function (value) {
      var newState = info.g({ 
        vector: state.vector.slice(), 
        theta1rate: state.theta1rate,
        theta2rate: state.theta2rate,
      }, value, index);

      try {
        onUpdate(newState);
      } catch (err) {
        onUpdate(state);
      }
    };
  }

  controllers.forEach(
    function (info, index) {
      controllers[index].elem = makeController(
        controllerIDs[index], 
        state.vector[index],
        info.f,
        info.f_inv,
        makeOnInput(info, index)
      );
    }
  );

  return controllers;
});
