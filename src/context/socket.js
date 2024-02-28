import io from "socket.io-client"

var sHOST = "https://rejekt.biz";
var sPORT = 3006;

//var sHOST = 'http://192.168.1.223'; 
//var sPORT = 3007;

const socket = io.connect(sHOST + ':' + sPORT, {
    extraHeaders: {
      "hmtest": "hi"
    }
  });
console.log(socket)




export { socket };