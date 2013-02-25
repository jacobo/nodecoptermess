console.log("let's go");

var arDrone = require('ar-drone');
var http    = require('http');
var fs      = require('fs');

var client  = arDrone.createClient();

// client.config('video:video_channel', '1');

// require('ar-drone-png-stream')(client, { port: 8000 });

// var rawStream = arDrone.createRawStream({frameRate:5});
// 
// var dataThing = null;
// 
// rawStream.on('data', function(rawBuffer) {
//   if(!dataThing){
//     dataThing = rawBuffer;
//   }
// });

client.createRepl();

// client.takeoff();
// client.down(0.1);
// client.stop()