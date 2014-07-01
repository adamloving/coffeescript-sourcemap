(function() {
  var c, requireCSwithMap;

  require('source-map-support').install();

  requireCSwithMap = require('../requireCSwithMap').requireCSwithMap;

  c = requireCSwithMap('./include/c.coffee').c;

  exports.b = function() {
    console.log('B');
    return c();
  };

}).call(this);

//# sourceMappingURL=b.temp.map