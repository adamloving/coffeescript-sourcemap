CoffeeScript = require('coffee-script');
path = require('path');
fs = require('fs');

/*
  Generate a .temp.js and .temp.map file for .coffee file at require time
*/
exports.requireCSwithMap = function(coffeeFilePath) {
  coffeeFilePath = path.resolve(path.dirname(module.parent.filename), coffeeFilePath);

  var baseCoffeeFileName = path.basename(coffeeFilePath);
  
  var answer;

  answer = CoffeeScript._compileFile(coffeeFilePath, true);

  sourceMap = answer.sourceMap.generate({
    sourceRoot: "", 
    generatedFile: baseCoffeeFileName.replace('.coffee', '.temp.js'),
    sourceFiles: [ baseCoffeeFileName ]
  }); 

  fs.writeFileSync(coffeeFilePath.replace('.coffee', '.temp.map'), sourceMap);

  answer.js += '\n//# sourceMappingURL=' + baseCoffeeFileName.replace('.coffee', '.temp.map');

  fs.writeFileSync(coffeeFilePath.replace('.coffee', '.temp.js'), answer.js);

  return require(coffeeFilePath.replace('.coffee', '.temp.js'))
};
