require('source-map-support').install();

exports.c = ->
  debugger
  console.log('C')
  throw new Error 'Example error in CoffeeScript!'