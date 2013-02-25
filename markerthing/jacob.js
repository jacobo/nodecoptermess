var arDrone = require('ar-drone');
var client  = arDrone.createClient();

var rawStream = arDrone.createRawStream({frameRate:1});

var dataThing = null;

//We can use spawn("speak") to have the computer say things when the copter reacts to things

rawStream.on('data', function(buf) {
  console.log("got buffer");
  // if(!dataThing){
  //   // dataThing = rawBuffer;
  //   // console.log(dataThing);
  //   // client.createRepl();
  //   for (var y = 0; y < 360; y++) {
  //     for (var x = 0; x < 640; x++) {
  //       var r = buf[i+0];
  //      var g = buf[i+1];
  //      var b = buf[i+2];
  //      
  // }
  var i = 0;
  var m = '';

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
    // console.log(arr);
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

  for (var y = 0; y < 36; y++) {
    for (var x = 0; x < 64; x++) {
      var r = rgrid[y][x] / 100;
      var g = ggrid[y][x] / 100;
      var b = bgrid[y][x] / 100;
      var t = (r + g + b);
      if(t > 50){ //} && g > (r + 15) && g > (b + 15)){
        m += Math.floor(t / 78);
      }else{
        m += " ";
      }
      // if (g > 125 && r < 150 && b < 150){
      //   m += "X";
      // }else if (g > 100 && r < 150 && b < 150){
      //   m += "x";
      // }else if (g > 75 && r < 150 && b < 150){
      //   m += ".";
      // }else{
      //   m += " ";
      // }
      // if(val > 150){
      //   m += "X";
      // }else if(val > 75){
      //   m += ".";
      // }else{
      //   m += " ";
      // }
    }
    m += "\n";
  }

  console.log(m);

  // for (var y = 0; y < yMax; y++) {
  //   var m = '';
  //   for (var x = 0; x < xMax; x++) {
  //     var s = 0;
  //     var c = 0;
  //     for (var yi = 0; yi < h; yi++) {
  //       for (var xi = 0; xi < w; xi++) {
  //         var i = ((y*h+yi)*640 + (x*w+xi))*3;
  //         s += buf[i];
  //         c++;
  //       }
  //     }
  //     s = Math.round(20*s/(255*c));
  //     if (s > 5) s = 5;
  //     m += " .-+O#".charAt(s);
  //   }
  //   console.log(m);
  // }



});
