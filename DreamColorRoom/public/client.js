/**
* variables
*/
var type = "line";
var idToDelete = null;

var canvas = null;
var context = null;

var previewCanvas = null;
var previewContext = null;

var pointer;
var isPressing = false;

var polygonPoints = [];
var x, y, x2, y2;
var idCounter = 0;

var historyMap = new Map();
var socket;

/**
* functions
*/
function init(){
	console.log("init() is called");
  socket = io.connect();
  console.log("socket: ", socket);

  /**
  * messages receiving from websocket
  */
  socket.on("chat", function(data){
    console.log("on socket - chat: ", data);
    onMessage(data);
  })

  socket.on("draw", function(data){
    console.log("on socket - draw: ", data);
    onMessage(data);
  })

  socket.on("remove", function(data){
    console.log("on socket - remove: ", data);
    onMessage(data)
  })
  /**
  * end of functions
  */

  canvas = document.getElementById("canvas");
  previewCanvas = document.getElementById("previewCanvas");

  addAction();
  context = canvas.getContext('2d');
  previewContext = previewCanvas.getContext('2d');

  var buttons = document.getElementsByClassName("canvasButton");
  for(var i = 0; i < buttons.length; ++i){
    buttons[i].setAttribute("state", "notActive");
  }
  var lineButton = document.getElementById("line");
  lineButton.setAttribute("state", "active");
}

function onMessage(message){
	console.log("onMessage() is called");
	console.log("data: ", message);
	// document.getElementById("messages").innerHTML += "<br/>" + event.data;
	var json = message;
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
		}else if(json.type == "clearHistory"){
			clearHistory();
		}else{
			onDraw(json.content);
			writeMessage(json.id, json.type, json.content);
		}

	}else{
		console.log("message is empty.");
	}
}

// function onOpen(event){
// 	console.log("onOpen is called");
// 	init();
// 	document.getElementById("chatBox").innerHTML += "Connection established <br/>";
// }
//
// function onClose(event){
// 	document.getElementById("chatBox").innerHTML += "Connection lost <br/>";
// 	document.getElementById("userInput").disabled = "true";
// }
//
// function onError(event){
// 	alert("Error occurred: ", event.data);
// }

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
  console.log("sendMessage is called");
	var textArea = document.getElementById("userInput");
	var username = document.getElementById("userName").value;
	var text = textArea.value;
	textArea.value = "";

	// var content = JSON.stringify({"username":username, "message":text}, null, "\t");
	// var c = JSON.parse(content);
	var message = {
    "type":"chat",
		"username":username,
		"message":text
	};
	console.log("message", message);
	// clearText(textArea);
	socket.emit("chat", message);
//	webSocket.send("nothing");
	return false;
}

/**
* functions for drawing on canvas
*/
function callToClear(){
	socket.emit("clearHistory", {type: "clearHistory"});
	clearHistory();
}

function clearHistory(){
	var parent = document.getElementById("history");
	historyMap.forEach(function(value, key, historyMap){
		// console.log("call clearHistory(): ", value, key);
		// idToDelete = key;
		// callRemoving();
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
	socket.emit("remove", removingObject);

	removeFromHistory();
}

function removeFromHistory(){
  console.log("history by removing one object: ", historyMap);
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

function drawFromHistory(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	// console.log("drawFromHistory: ", historyMap);
	historyMap.forEach(function(value, key, map){
		// console.log("value in history: ", value);
		// var content = JSON.parse(value);
		// console.log("value: ", content);
		onDraw(value);
	})
}

function toDraw(content){
	console.log("toDraw content: ", content);
	var id = "historyElement" + idCounter++;
	var message = {"id":id, "type":type, "content":content};
	// writeMessage(id, type, content);
	socket.emit("draw", message);
}

function addAction(){
	// console.log("add action: ", canvas);
	previewCanvas.addEventListener("mousemove", function(event){
		var mousePos = getMousePos(previewCanvas, event);

		if(isPressing){
			this.style.cursor = "pointer";
			onPreviewDraw(type, pointer, mousePos);
		}
	}, false);

	previewCanvas.addEventListener("mousedown", function(event){
		isPressing = true;
		pointer = getMousePos(previewCanvas, event);
		var p = getMousePos(previewCanvas, event);

		if(type == "polygon"){
			polygonPoints.push(p);
		}
	}, false);

	previewCanvas.addEventListener("mouseup", function(event){
		isPressing = false;
		this.style.cursor = "default";

		clearPreviewDraw();

		var pointer2 = getMousePos(previewCanvas, event);

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
			}

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

function onPreviewDraw(type, positionOne, currentPos){
	previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
	previewContext.strokeStyle = "#66AFE9";
	if(type == "line"){
		previewContext.beginPath();
		previewContext.moveTo(positionOne.x, positionOne.y);
		previewContext.lineTo(currentPos.x, currentPos.y);
		previewContext.closePath();
		previewContext.stroke();
	}else if(type == "rect"){
		var width = currentPos.x - positionOne.x;
		var height = currentPos.y - positionOne.y;

		previewContext.strokeRect(positionOne.x, positionOne.y, width, height);
	}else if(type == "circle"){
		var radius = Math.sqrt(Math.pow((currentPos.x - positionOne.x), 2) + Math.pow((currentPos.y - positionOne.y), 2));

		previewContext.beginPath();
		previewContext.arc(positionOne.x, positionOne.y, radius, 0, 2 * Math.PI);
		previewContext.closePath();
		previewContext.stroke();
	}
}

function clearPreviewDraw(){
	previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
}

// main function "onDraw"
// onType: which type will be drawn?
// content: the content includes the points to drawing
// sending: bool if the message to draw came from system or the user who drew
function onDraw(content){
	console.log("onDraw() is called: ", content);
	// console.log("context: ", context, content);
	var theType = null;
	if(content.type != null){
		theType = content.type;
	}else{
		theType = type;
	}

  // var content = json.content;
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
		}else if(theType == "rect"){
			var pointX = content.x;
			var pointY = content.y;
			var width = content.width;
			var height = content.height;

			context.strokeRect(pointX, pointY, width, height);

			loadImage();
		}else if(theType == "circle"){
			var radius = content.radius;

			context.beginPath();
			context.arc(content.x, content.y, content.radius, 0, 2 * Math.PI);
			context.closePath();
			context.stroke();

			loadImage();
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
		}
	}
}

/**
* functions to save data
*/

function loadImage(){
	// console.log("called loadImage()");
	var dataURL = canvas.toDataURL();
	document.getElementById("createdPicture").src = dataURL;
}

function savePicture(){
	var dataURL = canvas.toDataURL();
	var elemToSavePicture = document.getElementById("savePicture");
	elemToSavePicture.setAttribute("href", dataURL);
	elemToSavePicture.setAttribute("download", "DreamPicture.jpg");
}

function saveToFile(){
	console.log("begin saving json from map: ", historyMap);
	// var historyToDownload = JSON.stringify(historyMap);
	var historyToDownload = "History: \n";
	historyMap.forEach(function(value, key, historyMap){
			console.log("value in forEach loop: ", value);
			historyToDownload += JSON.stringify(value) + "\n";
	})
	// historyMap.forEach(value, key, historyMap){
	// }

	console.log("save: ", historyToDownload);
	var dataString = "data:text/json;charset=utf-8," + encodeURIComponent(historyToDownload);
	var elemToDownload = document.getElementById("saveToFile");
	// console.log("save string: ", dataString);
	elemToDownload.setAttribute("href", dataString);
	elemToDownload.setAttribute("download", "History.json");
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
