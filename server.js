#!/usr/bin/env node

var express = require('express');
var app     = express();
var queue   = require('queue-async');
var tasks   = queue(1);
var buildDocs = require('./src/build_docs');

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
  // console.log("#########################################################");
  // console.log('Received github event:', JSON.stringify(payload, null, 2));
  // console.log("#########################################################");
  // var repo = payload.repository.full_name;
  var branch = payload.ref.split('/').pop();
  // For now we only build pushes to 'master'
  if (branch === "master") {
    console.log('Updating docs for branch "%s"', branch);
    // Queue request handler
    tasks.defer(function(req, res, cb) {
      buildDocs(cb);
    }, req, res);
  }
  // Close connection
  res.send(202);
});

// Start server
var port = process.env.PORT || 5000;
app.listen(port);
console.log('Listening on port ' + port);
