var arDrone = require('ar-drone');
var client  = arDrone.createClient();

var rawStream = arDrone.createRawStream({frameRate:5});

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
  // var upperleft = 0;
  // var upperright = 0;
  // var lowerleft = 0;
  // var lowerright = 0;

  var rav = 0;
  var gav = 0;
  var bav = 0;

  // var rgrid = [[]];
  var ggrid = [];
  // var bgrid = [[]];

  for (var y = 0; y < 360; y++) {
    var ywhich = y / 10;
    for (var x = 0; x < 640; x++) {
      var xwhich = x / 10;

      var rgot = buf[i+0];
      var ggot = buf[i+1];
      var bgot = buf[i+2];

      // if(!rgrid[ywhich]){
      //   rgrid[ywhich] = [];
      // }
      if(!ggrid[ywhich]){
        ggrid[ywhich] = [];
      }
      if(!ggrid[ywhich][xwhich]){
        ggrid[ywhich][xwhich] = 0;
      }
      // if(!bgrid[ywhich]){
      //   bgrid[ywhich] = [];
      // }

      // console.log(ggrid);

      // rgrid[ywhich][xwhich] = rgrid[ywhich][xwhich] + rgot;
      ggrid[ywhich][xwhich] = ggrid[ywhich][xwhich] + ggot;
      // bgrid[ywhich][xwhich] = bgrid[ywhich][xwhich] + bgot;
      // rav = rav + rgot;
      // gav = gav + ggot;
      // bav = bav + bgot;

      // if((x % 10 == 0) && (y % 10 == 0)){
      //   // var r = rav / 
      //   // var g =
      //   // var b =
      //   // get the r,g,b values of every pixel
      //   // var total = r + g + b;
      // 
      //   // console.log("rgb");
      //   // console.log(r);
      //   // console.log(g);
      //   // console.log(b);
      // 
      //   // if(r > g && r > b){
      //   //   m += "R";
      //   // }
      //   // else if(g > b && g > r){
      //   //   m += "G";
      //   // }
      //   // else if(b > g && b > r){
      //   //   m += "B";
      //   // } else {
      //   //   m += "O";
      //   // }
      //   if(g > 200 && r < 200 && b < 200){
      //     m += "X"
      //   }else if(g > 100 && r < 100 && b < 100){
      //     m += "."
      //   }else{
      //     m += " "
      //   }
      // }

      i += 3;
    }
    // if(y % 10 == 0){
    //   m += "\n";
    // }
  }

  for (var y = 0; y < 36; y++) {
    for (var x = 0; x < 64; x++) {
      var val = ggrid[y][x];
      console.log(val);
      // if(val > 100){
      //   m += "X";
      // }else{
      //   m += " ";
      // }
    }
    // m += "\n";
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
