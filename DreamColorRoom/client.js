var socket;

function init(){
  socket = io.connect();
  console.log("socket: ", socket);
}
