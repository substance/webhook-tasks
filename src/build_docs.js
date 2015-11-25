var exec = require('./exec');

module.exports = function buildDocs(cb) {
  exec("./build.sh", function(err) {
    if (err) {
      console.log('Failed to build documentation', err);
      if (typeof cb === 'function') cb(err);
      return;
    } else {
    	if (typeof cb === 'function') cb();
    }
  });
};
