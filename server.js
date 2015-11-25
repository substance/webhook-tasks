#!/usr/bin/env node

var express = require('express');
var app     = express();
var async   = require('async');
var buildDocs = require('./src/build_docs');

var githubMiddleware = require('github-webhook-middleware')({
  secret: process.env.GITHUB_SECRET
});

var queue = async.queue(function (task, cb) {
  buildDocs(cb);
});

queue.drain = function() {
  console.log('All requests have been processed');
}

// Receive webhook post
app.post('/hooks/docs', githubMiddleware, function(req, res) {
  // Only respond to github push events
  if (req.headers['x-github-event'] != 'push') {
    return res.status(200).end();
  }
  var payload = req.body;
  // console.log("#########################################################");
  // console.log('Received github event:', JSON.stringify(payload, null, 2));
  // console.log("#########################################################");
  // var repo = payload.repository.full_name;
  var branch = payload.ref.split('/').pop();
  // For now we only build pushes to 'master'
  if (branch === "docs-test") {
    console.log('Updating docs for branch "%s"', branch);
    // Queue request handler
    queue.push({}, function (err) {
      console.log('Documentation has been builded');
    });
  }
  // Close connection
  res.send(202);
});

// Start server
var port = process.env.PORT || 5000;
app.listen(port);
console.log('Listening on port ' + port);