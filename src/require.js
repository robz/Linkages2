var require;
var addExport;

(function () {
  var Modules = {};

  require = function require(moduleName) {
    if (!Modules[moduleName]) { 
      throw Error('module ' + moduleName + ' does not exist'); 
    }

    return Modules[moduleName];
  };

  addExport = function addExport(moduleName, module) {
    if (Modules[moduleName]) { 
      throw Error('module ' + moduleName + ' already added'); 
    }
    
    Modules[moduleName] = module;
  };
}());
