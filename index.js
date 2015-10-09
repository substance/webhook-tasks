#!/usr/bin/env node

var express = require('express');
var app     = express();
var queue   = require('queue-async');
var tasks   = queue(1);
var spawn   = require('child_process').spawn;

// Receive webhook post
app.post('/hooks/docs', function(req, res) {
    // Close connection
    res.send(202);

    // Queue request handler
    tasks.defer(function(req, res, cb) {

        // Run build script
        run("./build.sh", function(err) {
            if (err) {
                console.log('Failed to build documentation');
                if (typeof cb === 'function') cb();
                return;
            }
        });
    }, req, res);

});

// Start server
var port = process.env.PORT || 5000;
app.listen(port);
console.log('Listening on port ' + port);

function run(file, params, cb) {
    var process = spawn(file);

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