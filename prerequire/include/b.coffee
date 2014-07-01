require('source-map-support').install();

requireCSwithMap = require('../requireCSwithMap').requireCSwithMap
c = requireCSwithMap('./include/c.coffee').c

exports.b = ->
  console.log('B')
  c()
