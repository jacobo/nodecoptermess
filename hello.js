console.log("hello world");

var util        = require('util');
var spawn       = require('child_process').spawn;

spawn('ffmpeg', [
  '-i' ,'-',
  '-f', 'image2pipe',
  '-vcodec', 'png',
  '-r', 5,
  '-',
]);