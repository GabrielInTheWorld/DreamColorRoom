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

function onMessage(event){
	document.getElementById("messages").innerHTML += "<br/>" + event.data;
}

function onOpen(event){
	document.getElementById("messages").innerHTML += "Connection established";
}

function onError(event){
	alert("Error occurred: ", event.data);
}

function start(){
	var text = document.getElementById("userInput").value;
	webSocket.send(text);
	return false;
}