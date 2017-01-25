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

function clearText(element){
	// console.log("call clear function");
	element.value = "";
}

function start(){
	var textArea = document.getElementById("userInput");
	var text = textArea.value;
	textArea.value = "";
	// console.log("clear textArea");
	clearText(textArea);
	webSocket.send(text);
//	webSocket.send("nothing");
	return false;
}
