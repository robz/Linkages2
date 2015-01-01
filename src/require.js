// these should be the only globals added by this entire app
var require;
var addModule;

(function () {
  var modules = {};

  require = function (moduleName) {
    if (!modules[moduleName]) { 
      throw Error('module ' + moduleName + ' does not exist'); 
    }

    return modules[moduleName];
  };

  addModule = function (moduleName, module) {
    if (modules[moduleName]) { 
      throw Error('module ' + moduleName + ' already added'); 
    }
    
    modules[moduleName] = module;
  };
}());
