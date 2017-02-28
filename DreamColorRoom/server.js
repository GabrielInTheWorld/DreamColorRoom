var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var historyMap = new Map();

app.configure(function(){
  app.use(express.static(__dirname + "/public"));
});

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket){
  console.log('A user connected');

  historyMap.forEach(function(value, key, map){
    console.log("new connected user: ", value);
    socket.emit("draw", value)
  })
  socket.emit("chat", {type: "chat", username: "System", message: "Du bist nun mit dem Server verbunden!"});

  socket.on("chat", function(data){
    socket.emit("chat", data)
  })

  socket.on("draw", function(data){
    addToHistory(data);
    socket.emit("draw", data)
  })

  socket.on("remove", function(data){
    console.log("command - remove: ", data);
    removeFromHistory(data.idToDelete)
    socket.emit("remove", data)
  })

  socket.on("clearHistory", function(data){
    console.log("command - clearHistory: ", data);
    socket.emit("clearHistory", data)
    clearHistory();
  })
  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function addToHistory(json){
  json.history = "true";
  console.log("addToHistory - json: ", json);
  historyMap.set(json.id, json);
}

function removeFromHistory(id){
  historyMap.delete(id);
}

function clearHistory(){
  historyMap.clear();
}
