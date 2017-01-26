/**
 *
 */


var loc = window.location, uri;
if(loc.protocol == "https:"){
	uri = "wss://";
}else{
	uri = "ws://";
}
uri += loc.host + loc.pathname;
uri += "websocket";
var webSocket = new WebSocket(
		uri
);

webSocket.onerror = function(event){
	onError(event);
}

webSocket.onopen = function(event){
	onOpen(event);
}

webSocket.onmessage = function(event){
	onMessage(event);
}

function onMessage(message){
	console.log("data: ", message.data);
	// document.getElementById("messages").innerHTML += "<br/>" + event.data;
	var json = JSON.parse(message.data);
	console.log("json in onMessage: ", json);
	if(json != null){
		if(json.type == "chat"){
			document.getElementById("chatBox").innerHTML += json.username + ": " + json.message + "<br/>";
		}
	}
}

function onOpen(event){
	document.getElementById("chatBox").innerHTML += "Connection established <br/>";
}

function onError(event){
	alert("Error occurred: ", event.data);
}

function start(){
	var textArea = document.getElementById("userInput");
	var username = document.getElementById("userName").value;
	var text = textArea.value;
	textArea.value = "";

	// var content = JSON.stringify({"username":username, "message":text}, null, "\t");
	// var c = JSON.parse(content);
	var message = JSON.stringify({"type":"chat", "content":{
		"username":username,
		"message":text
	}}, null, "\t");
	console.log("message", message);
	// clearText(textArea);
	webSocket.send(message);
//	webSocket.send("nothing");
	return false;
}
