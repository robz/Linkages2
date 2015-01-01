/**
 * @providesModule makeController
 */

addModule('makeController',

function (elemID, startValue, f, f_inv, onInput) {
  var elem = document.getElementById(elemID);
  elem.value = f_inv(startValue) * 100;
  elem.oninput = function () {
    onInput(f(elem.valueAsNumber / 100));
  };
  return elem;
});
