/**
* variables
*/
var type = "line";
var idToDelete = null;

var canvas = null;
var context = null;
// var context = canvas.getContext("2d");
var pointer;
var isPressing = false;

var polygonPoints = [];
var x, y, x2, y2;
var idCounter = 0;

var historyMap = new Map();

/**
 * connecting to websocket
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

webSocket.onclose = function(event){
	onClose(event);
}

webSocket.onmessage = function(event){
	onMessage(event);
}

/**
*	functions
*/

function init(){
	console.log("init() is called");
	canvas = document.getElementById("canvas");
	// i = 0;
	// console.log("call function init(): ", canvas);
	addAction();
	context = canvas.getContext('2d');

	var buttons = document.getElementsByClassName("canvasButton");
	// console.log("all buttons for canvas: ", buttons);
	for(var i = 0; i < buttons.length; ++i){
		buttons[i].setAttribute("state", "notActive");
	}
	// console.log("buttons after for-loop: ", buttons);
	var lineButton = document.getElementById("line");
	// console.log("button for drawing the line: ", lineButton);
	lineButton.setAttribute("state", "active");
	// console.log("lineButton after setting an attribute: ", lineButton);
}

function onMessage(message){
	console.log("onMessage() is called");
	// console.log("data: ", message.data);
	// document.getElementById("messages").innerHTML += "<br/>" + event.data;
	var json = JSON.parse(message.data);
	console.log("json in onMessage: ", json);
	if(json != null){
		if(json.type == "chat"){
			document.getElementById("chatBox").innerHTML += json.username + ": " + json.message + "<br/>";
		}else if(json.history){
			++idCounter;
			onDraw(json.content);
			writeMessage(json.id, json.type, json.content);
		}else if(json.type == "remove"){
			getFocus(json.idToDelete);
			removeFromHistory();
		}else{
			onDraw(json);
			writeMessage(json.id, json.type, json);
		}
		// if(json.type == "line"){
		// 	console.log("line: ", json);
		// 	onDraw(json);
		// }else if(json.type == "rect"){
		// 	console.log("rect: ", json);
		// }else if(json.type == "circle"){
		// 	console.log("circle: ", json);
		// }else if(json.type == "polygon"){
		// 	console.log("polygon: ", json);
		// }else if(json.type == "freeHand"){
		// 	console.log("freeHand: ", json);
		// }
	}else{
		console.log("message is empty.");
	}
}

function onOpen(event){
	console.log("onOpen is called");
	init();
	document.getElementById("chatBox").innerHTML += "Connection established <br/>";
}

function onClose(event){
	document.getElementById("chatBox").innerHTML += "Connection lost <br/>";
	document.getElementById("userInput").disabled = "true";
}

function onError(event){
	alert("Error occurred: ", event.data);
}

function writeMessage(id, type, content){
	// console.log("i: ", idCounter);
	// var id = "historyElement" + idCounter++;

	var para = document.createElement("p");
	para.setAttribute("id", id);
	// console.log("id: ", id);
	para.setAttribute("onclick", "getFocus(id)");
	para.setAttribute("tabindex", "0");
	para.setAttribute("class", "historyElement");

	var text = "Type: " + type + "\t";
	if(type == "line"){
		text += "[startX: " + content.startX + ", startY: " + content.startY + ", to endX: " + content.endX + ", and endY: " + content.endY + "]";
	}else if(type == "rect"){
		text += "[x: " + content.x + ", y: " + content.y + ", width: " + content.width + ", height: " + content.height + "]";
	}else if(type == "circle"){
		text += "[x: " + content.x + ", y: " + content.y + ", radius: " + content.radius + "]";
	}else if(type == "polygon"){
		// var node = document.createTextNode(content);
		// para.appendChild(node);
		text += "<br/>[points: <br/>";
		// console.log("polygonPoints.length: ", content.polygonPoints.length);
		for(var i = 0; i < content.content.length; ++i){
			text += "x: " + content.content[i].x + ", y: " + content.content[i].y + "<br/>";
		}
		text += "]";
	}

	para.innerHTML = text;

	// console.log("para element: ", para);
	var parent = document.getElementById("history");
	parent.appendChild(para);
	if(content.type == "polygon"){console.log("polygonPoints.length: ", content.content.length);}
	// console.log("from writeMessage: ", content);
	if(!(type == "polygon")){
		// console.log("not the type of polygon");
		toHistory(id, content);
	}else{
		var polygonPoints = [];
		for(var i = 0; i < content.content.length; ++i){
			var point = content.content[i];
			var p = {
				"x": point.x,
				"y": point.y
			}
			polygonPoints.push(p);
		}
		// console.log("new polygonPoints: ", polygonPoints);
		var newContent = {
			"type": "polygon",
			"content": polygonPoints
		}
		toHistory(id, newContent);
	}
}

function sendMessage(){
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
	// console.log("message", message);
	// clearText(textArea);
	webSocket.send(message);
//	webSocket.send("nothing");
	return false;
}

/**
* functions for drawing on canvas
*/
function clearHistory(){
	var parent = document.getElementById("history");
	historyMap.forEach(function(value, key, historyMap){
		historyMap.delete(key);
		var child = document.getElementById(key);
		parent.removeChild(child);
	});
	// console.log("historyLength: ", historyMap.size);
	context.clearRect(0, 0, canvas.width, canvas.height);
	loadImage();
}

function toHistory(id, content){
	console.log("toHistory is called: ", historyMap.size);
	console.log("historyMap: ", historyMap);
	historyMap.set(id, content);
}

function callRemoving(){
	var removingObject = {
		"type": "remove",
		"idToDelete": idToDelete
	}
	webSocket.send(JSON.stringify(removingObject));

	removeFromHistory();
}

function removeFromHistory(){
	// if(sending){
	// 	var removingObject = {
	// 		"type": "remove",
	// 		"idToDelete": idToDelete
	// 	}
	// }
	// console.log("removingObject: ", removingObject);

	historyMap.delete(idToDelete);

	var parent = document.getElementById("history");
	var child = document.getElementById(idToDelete);
	// console.log("child which will destroyed: ", child);
	if(child){
		parent.removeChild(child);
	}
	// webSocket.send(JSON.stringify(removingObject));

	drawFromHistory();

	idToDelete = null;
	loadImage();
}

function getPolygonElement(id, content){
	// return(
	// 	<div class="box panel panel-default">
	// 		<div class="panel-heading">
	// 			<h4 class="panel-title">
	// 				<a class="accordion-toggle collapsed" data-toggle="collapse" data-target={"#" + id}></a>
	// 			</h4>
	// 		</div>
	// 		<div id={id} class="panel-collapse collapse" aria-expanded="false">
	// 			<div class="panel-body">
	// 				{
	// 					// var data = []
	// 					// var points = content.points;
	// 					// for(var i = 0; i < points.length; ++i){
	// 					//
	// 					// }
	// 					content.points
	// 				}
	// 			</div>
	// 		</div>
	// 	</div>
	// )
}

function drawFromHistory(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	// console.log("drawFromHistory: ", historyMap);
	historyMap.forEach(function(value, key, map){
		// console.log("value in history: ", value);
		// var content = JSON.parse(value);
		// console.log("value: ", content);
		onDraw(value, false);
	})
}

function toDraw(content){
	// console.log("toDraw content: ", content);
	var id = "historyElement" + idCounter++;
	var message = JSON.stringify({"id":id, "type":type, "content":content}, null, "\t");
	// writeMessage(id, type, content);
	webSocket.send(message);
}

function addAction(){
	// console.log("add action: ", canvas);
	canvas.addEventListener("mousemove", function(event){
		var mousePos = getMousePos(canvas, event);
		if(isPressing && type == "freeHand"){
			this.style.cursor = "pointer";
			var content = {
				"type": "freeHand",
				"x": mousePos.x,
				"y": mousePos.y
			};
			onDraw(content, true);
			// toDraw(content);
		}
	}, false);

	canvas.addEventListener("mousedown", function(event){
		isPressing = true;
		pointer = getMousePos(canvas, event);
		var p = getMousePos(canvas, event);

		if(type == "polygon"){
			polygonPoints.push(p);
		}
	}, false);

	canvas.addEventListener("mouseup", function(event){
		isPressing = false;
		var pointer2 = getMousePos(canvas, event);

		x = pointer.x;
		y = pointer.y;

		x2 = pointer2.x;
		y2 = pointer2.y;
		if(type != "polygon"){
			var content = null;
			if(type == "line"){
				content = {
					"type": type,
					"startX": x,
					"startY": y,
					"endX": x2,
					"endY": y2
				};
			}else if(type == "rect"){
				var pointX, pointY, width, height;
				if(x < x2){
					pointX = x;
					width = x2 - x;
				}else{
					pointX = x2;
					width = x - x2;
				}

				if(y < y2){
					pointY = y;
					height = y2 - y;
				}else{
					pointY = y2;
					height = y - y2;
				}
				// var width = x < x2 ? (x2 - x) : (x - x2);
				// var height = y < y2 ? (y2 - y) : (y - y2);
				content = {
					"type": type,
					"x": pointX,
					"y": pointY,
					"width": width,
					"height": height
				};
			}else if(type == "circle"){
				var radius = Math.sqrt(Math.pow((x2 - x), 2) + Math.pow((y2 - y), 2));
				content = {
					"type": type,
					"x": x,
					"y": y,
					"radius": radius
				};
			}else if(type == "freeHand"){
				content = {
					"type": type,
					"x": x,
					"y": y
				};
			}
			// content = JSON.parse(content);
			// onDraw(content, true);
			toDraw(content);
		}else if(polygonPoints.length == 5){
			// onDraw(null, true);
			// console.log("type is polygon");
			var content = {
				"type": type,
				"content": polygonPoints
			}
			// console.log("content is: ", content);
			toDraw(content);
		}
	}, false);
}

// main function "onDraw"
// onType: which type will be drawn?
// content: the content includes the points to drawing
// sending: bool if the message to draw came from system or the user who drew
function onDraw(content, sending){
	console.log("onDraw() is called: ", content);
	// console.log("context: ", context, content);
	var theType = null;
	if(content.type != null){
		theType = content.type;
	}else{
		theType = type;
	}

	// content = JSON.parse(content);
	if(context && theType){
		// console.log("type: ", theType);
		// console.log("content: ", content);
		if(theType == "line"){
			context.beginPath();
			context.moveTo(content.startX, content.startY);
			context.lineTo(content.endX, content.endY);
			context.closePath();
			context.stroke();

			loadImage();
			// writeMessage(type, content);
			// if(sending){
			// 	toDraw(content);
			// }
		}else if(theType == "rect"){
			var pointX = content.x;
			var pointY = content.y;
			var width = content.width;
			var height = content.height;

			context.strokeRect(pointX, pointY, width, height);

			loadImage();
			// writeMessage(theType, content);
			// if(sending){
			// 	toDraw(content);
			// }
		}else if(theType == "circle"){
			var radius = content.radius;

			context.beginPath();
			context.arc(content.x, content.y, content.radius, 0, 2 * Math.PI);
			context.closePath();
			context.stroke();

			loadImage();
			// writeMessage(theType, content);
			// if(sending){
			// 	toDraw(content);
			// }
		}else if(theType == "polygon"){
			console.log("content for drawing polygon: ", content);
			context.beginPath();
			context.moveTo(content.content[0].x, content.content[0].y);

			for(var i = 1; i < content.content.length; ++i){
				// console.log("points: ", content.content[i]);
				context.lineTo(content.content[i].x, content.content[i].y);
			}
			context.closePath();
			context.stroke();

			loadImage();

			while(polygonPoints.length > 0){
				polygonPoints.pop();
			}
		}else if(theType == "freeHand"){
			context.fillRect(content.x, content.y, 1, 1);

			loadImage();
			// if(sending){
			// 	toDraw(content);
			// }
		}
	}
}

function loadImage(){
	// console.log("called loadImage()");
	var dataURL = canvas.toDataURL();
}

// getters & setters

function setType(event){
	// console.log("event: ", event);
	if(event.id == "polygon"){
		alert("Click five times until the polygon is drawn.");
	}
	type = event.id;
	var buttons = document.getElementsByClassName("canvasButton");
	for(var i = 0; i < buttons.length; ++i){
		buttons[i].setAttribute("state", "notActive");
	}
	var activeButton = document.getElementById(event.id);
	activeButton.setAttribute("state", "active");
}

function getMousePos(canvas, event){
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}

function getFocus(elementID){
	// console.log("elementID: ", elementID);
	var element = document.getElementById(elementID);
	// document.getElementById(elementID).focus();
	if(element){
		element.focus();
	}
	idToDelete = elementID;
}
