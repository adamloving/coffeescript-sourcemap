(function() {
  require('source-map-support').install();

  exports.c = function() {
    debugger;
    console.log('C');
    throw new Error('Example error in CoffeeScript!');
  };

}).call(this);

//# sourceMappingURL=c.temp.map