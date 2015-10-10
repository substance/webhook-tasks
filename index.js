#!/usr/bin/env node

var express = require('express');
var app     = express();
var queue   = require('queue-async');
var tasks   = queue(1);
var spawn   = require('child_process').spawn;

var githubMiddleware = require('github-webhook-middleware')({
  secret: process.env.GITHUB_SECRET
});

// Receive webhook post
app.post('/hooks/docs', githubMiddleware, function(req, res) {
  // Only respond to github push events
  if (req.headers['x-github-event'] != 'push') {
    return res.status(200).end();
  }
  var payload = req.body;
  var repo = payload.repository.full_name;
  var branch = payload.ref.split('/').pop();
  // For now we only build pushes to 'master'
  if (branch === "master") {
    console.log('Updating docs for branch "%s"', branch);
    // Queue request handler
    tasks.defer(function(req, res, cb) {
      // Run build script
      exec("./build.sh", function(err) {
        if (err) {
          console.log('Failed to build documentation');
          if (typeof cb === 'function') cb();
          return;
        }
      });
    }, req, res);
  }
  // Close connection
  res.send(202);
});

// Start server
var port = process.env.PORT || 5000;
app.listen(port);
console.log('Listening on port ' + port);

function exec(command, cb) {
  var process = spawn(command);
  process.stdout.on('data', function (data) {
    console.log('' + data);
  });
  process.stderr.on('data', function (data) {
    console.warn('' + data);
  });
  process.on('exit', function (code) {
    if (typeof cb === 'function') cb(code !== 0);
  });
}
