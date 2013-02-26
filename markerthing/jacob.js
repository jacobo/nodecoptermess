var arDrone = require('ar-drone');
var client  = arDrone.createClient();

var realthing = true;

if(realthing){
  console.log("takeoff");
  client.takeoff();
}

var rawStream = arDrone.createRawStream({frameRate:1});

//We can use spawn("speak") to have the computer say things when the copter reacts to things

var frameCount = 0;
var vidF = 1;
var moveF = 1;
var xThreshold = 12;
var yThreshold = 5;
var timesNotFound = 0;
var timesFound = 0;
var rgrid = [[]];
var ggrid = [[]];
var bgrid = [[]];
var holdCount = 0;

rawStream.on('data', function(buf) {
  if(frameCount == 0){
    console.log("got first buffer");
  }
  frameCount++;
  if(frameCount < 6){
    console.log("wait");
    client.up(0.1);
    return;
  }

  var i = 0;

  if(frameCount % moveF == 0){
    rgrid = [[]];
    ggrid = [[]];
    bgrid = [[]];
  }

  var initifempty = function(arr, y, x){
    if(!arr[y]){
      arr[y] = [];
    }
    if(!arr[y][x]){
      arr[y][x] = 0;
    }
  }

  for (var y = 0; y < 360; y++) {
    var ywhich = Math.floor(y / 5);
    for (var x = 0; x < 640; x++) {
      var xwhich = Math.floor(x / 5);

      var rgot = buf[i+0];
      var ggot = buf[i+1];
      var bgot = buf[i+2];

      initifempty(rgrid, ywhich, xwhich);
      initifempty(ggrid, ywhich, xwhich);
      initifempty(bgrid, ywhich, xwhich);

      rgrid[ywhich][xwhich] += rgot;
      ggrid[ywhich][xwhich] += ggot;
      bgrid[ywhich][xwhich] += bgot;

      i += 3;
    }
  }

  var matchedcount = 0;
  var xval = 0;
  var xstrength = 0;
  var yval = 0;
  var ystrength = 0;
  var movedrone = function(x, y, t){
    if(t > 2){
      matchedcount++;
      if(t > xstrength){
        xstrength = t;
        xval = x;
      }
      if(t > ystrength){
        ystrength = t;
        yval = y;
      }
    }
  }

  if(frameCount % moveF == 0){
    var m = '';
    var detected = false;
    // var darknesscount = 0;
    for (var y = 0; y < 72; y++) {
      for (var x = 0; x < 128; x++) {
        var r = rgrid[y][x] / 25;
        var g = ggrid[y][x] / 25;
        var b = bgrid[y][x] / 25;

        var t = 0;
        if(g > (r + 15) && g > (b + 15) && g > 100){
          t = Math.floor(g / 25.5);
          m += t;
          detected = true;
        }else{
          m += " ";
        }
        movedrone(x, y, t);
      }
      m += "\n";
    }

    if(yval > 0){
      yval = yval - 36;
    }
    if(xval > 0){
      xval = xval - 64;
    }

    console.log(m);
    console.log("xval: " + xval + " yval " + yval);

    if(xval > xThreshold){
      holdCount = 0;
      console.log("go right");
      client.right(0.1);
      // client.counterClockwise(0.1);
    }else if(xval < -xThreshold){
      holdCount = 0;
      console.log("go left");
      client.left(0.1);
      // client.clockwise(0.1);
    }else if(yval > yThreshold){
      holdCount = 0;
      console.log("go down");
      client.down(0.1);
    }else if(yval < -yThreshold){
      holdCount = 0;
      console.log("go up");
      client.up(0.1);
    }else{
      console.log("hold " + holdCount);
      client.stop();
      if(matchedcount == 0){
        holdCount++;
      }
    }
    if(holdCount > 5){
      client.land();
    }

  }

  // console.log("darknesscount "+ darknesscount);
  // if(frameCount % moveF == 0){
  //   if(xsum > xThreshold){
  //     //positive xsum = go right
  //     console.log("going right");
  //     if(realthing){
  //       client.right(0.1);
  //     }
  //     timesNotFound = 0;
  //     timesFound += 1;
  //   }else if(xsum < (0 - xThreshold)){
  //     //negative xsum = go left
  //     console.log("going left");
  //     if(realthing){
  //       client.left(0.1);
  //     }
  //     timesNotFound = 0;
  //     timesFound += 1;
  //   }else{
  //     console.log("x is steady");
  //     if(ysum > yThreshold){
  //       //positive ysum = go down
  //       console.log("going down");
  //       if(realthing){
  //         client.down(0.1);
  //       }
  //       timesNotFound = 0;
  //       timesFound += 1;
  //     }else if(ysum < (0 - yThreshold)){
  //       //negative ysum = go up
  //       console.log("going up");
  //       if(realthing){
  //         client.up(0.1);
  //       }
  //       timesNotFound = 0;
  //       timesFound += 1;
  //     }else{
  //       console.log("y is steady");
  //       client.stop();
  //       // if(detected){
  //       //   if(timesFound > 5){
  //       //     console.log("going forward");
  //       //     if(realthing){
  //       //       client.front(0.1);
  //       //       client.stop();
  //       //     }
  //       //   }
  //       //   timesNotFound = 0;
  //       //   timesFound += 1;
  //       // }else{
  //       //   timesNotFound += 1;
  //       //   timesFound = 0;
  //       //   if(timesNotFound > 10){
  //       //     if(Math.floor(timesNotFound / 10) % 2 == 0){
  //       //       console.log("search pattern 1");
  //       //       if(realthing){
  //       //         client.back(0.1);
  //       //         client.clockwise(0.1);
  //       //       }
  //       //     }else{
  //       //       console.log("search pattern 2");
  //       //       if(realthing){
  //       //         client.counterClockwise(0.1);
  //       //       }
  //       //     }
  //       //   }else{
  //       //     console.log("holding pattern");
  //       //     if(realthing){
  //       //       client.stop();
  //       //     }
  //       //   }
  //       //   // if(darknesscount > 300){
  //       //   //   client.back();
  //       //   //   console.log("retreating from darkness");
  //       //   // }
  //       //   // client.clockwise(0.4);
  //       //   // client.counterClockwise(0.1);
  //       //   // console.log("searching... darknesscount: " + darknesscount);
  //       // }
  //     }
  //   }
  // }

});
