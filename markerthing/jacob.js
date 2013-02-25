var arDrone = require('ar-drone');
var client  = arDrone.createClient();

var realthing = false;

if(realthing){
  client.takeoff();
}

var rawStream = arDrone.createRawStream({frameRate:1});

//We can use spawn("speak") to have the computer say things when the copter reacts to things

var frameCount = 0;
var vidF = 1;
var moveF = 1;
rawStream.on('data', function(buf) {
  if(frameCount == 0){
    console.log("got first buffer");
  }
  frameCount++;

  var i = 0;

  var rav = 0;
  var gav = 0;
  var bav = 0;

  var rgrid = [[]];
  var ggrid = [[]];
  var bgrid = [[]];

  var initifempty = function(arr, y, x){
    if(!arr[y]){
      arr[y] = [];
    }
    if(!arr[y][x]){
      arr[y][x] = 0;
    }
  }

  for (var y = 0; y < 360; y++) {
    var ywhich = Math.floor(y / 10);
    for (var x = 0; x < 640; x++) {
      var xwhich = Math.floor(x / 10);

      var rgot = buf[i+0];
      var ggot = buf[i+1];
      var bgot = buf[i+2];

      initifempty(rgrid, ywhich, xwhich);
      initifempty(ggrid, ywhich, xwhich);
      initifempty(bgrid, ywhich, xwhich);


      rgrid[ywhich][xwhich] = rgrid[ywhich][xwhich] + rgot;
      ggrid[ywhich][xwhich] = ggrid[ywhich][xwhich] + ggot;
      bgrid[ywhich][xwhich] = bgrid[ywhich][xwhich] + bgot;

      i += 3;
    }
  }

  var callback = function(x, y, t){
    if(frameCount % vidF == 0){
      drawthing(x, y, t);
    }
    if(frameCount % moveF == 0){
      movedrone(x, y, t);
    }
  }

  var m = '';
  var drawthing = function(x, y, t){
    if(t < 2){
      m += t;
    }else{
      m += " ";
    }
    if(x == 0){
      m += "\n";
    }
  }

  var xsum = 0;
  var ysum = 0;
  var movedrone = function(x, y, t){
    if(t < 2){
      if(y < 18){
        ysum--;
      }else{
        ysum++;
      }
      if(x < 32){
        xsum --;
      }else{
        xsum ++;
      }
    }
  }

  for (var y = 0; y < 36; y++) {
    for (var x = 0; x < 64; x++) {
      var r = rgrid[y][x] / 100;
      var g = ggrid[y][x] / 100;
      var b = bgrid[y][x] / 100;
      var t = Math.floor((r + g + b) / 78);
      callback(x, y, t);
    }
  }

  if(frameCount % vidF == 0){
    console.log(m);
    console.log("xsum: " + xsum + " ysum " + ysum);
  }

  if(frameCount % moveF == 0){
    if(xsum > 10){
      //positive xsum = go right
      console.log("going right");
      if(realthing){
        client.right(0.1);
      }
    }else if(xsum < -10){
      //negative xsum = go left
      console.log("going left");
      if(realthing){
        client.left(0.1);
      }
    }else{
      console.log("x is steady");
    }
    if(ysum > 10){
      //positive ysum = go down
      console.log("going down");
      if(realthing){
        client.down(0.1);
      }
    }else if(ysum < -10){
      //negative ysum = go up
      console.log("going up");
      if(realthing){
        client.up(0.1);
      }
    }else{
      console.log("y is steady");
    }
  }

});
