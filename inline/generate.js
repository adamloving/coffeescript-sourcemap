fs = require('fs');
CoffeeScript = require('coffee-script');

answer = CoffeeScript._compileFile('inline/test.coffee', true);
code = fs.readFileSync('inline/test.coffee', { encoding: 'utf-8' });

mapJSON = answer.sourceMap.generate({
  sourceFiles: ['test.coffee'],
  generatedFile: ['test.js'],
  inline: true
}, code)

console.log('map: ----------');
console.log(mapJSON);
console.log('base64: ----------');
console.log(Buffer(mapJSON).toString('base64'));