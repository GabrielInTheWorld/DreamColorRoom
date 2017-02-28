var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.configure(function(){
  app.use(express.static(__dirname + "/public"));
});

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket){
  console.log('A user connected');

  socket.emit("chat", {type: "chat", username: "System", message: "Du bist nun mit dem Server verbunden!"});
  socket.on("chat", function(data){
    socket.emit("chat", data)
  })

  socket.on("draw", function(data){
    socket.emit("draw", data)
  })

  socket.on("remove", function(data){
    socket.emit("remove", data)
  })
  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
