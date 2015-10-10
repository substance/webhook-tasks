var spawn   = require('child_process').spawn;

module.exports = function exec(command, cb) {
  var _process = spawn(command);
  _process.stdout.on('data', function (data) {
    console.log('' + data);
  });
  _process.stderr.on('data', function (data) {
    console.warn('' + data);
  });
  _process.on('exit', function (code) {
    var err = null;
    if (code !== 0) {
      err = "Build script returned with exit code " + code;
    }
    if (typeof cb === 'function') cb(err);
  });
};
