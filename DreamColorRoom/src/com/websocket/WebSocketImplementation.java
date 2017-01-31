package com.websocket;

import java.awt.Point;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.objects.Circle;
import com.objects.Line;
import com.objects.MessageNode;
import com.objects.Polygon;
import com.objects.Rect;

@ServerEndpoint("/websocket")
public class WebSocketImplementation {

	static Set<Session> users = Collections.synchronizedSet(new HashSet<Session>());

	@OnMessage
	public void onMessage(String message, Session session)
			throws JsonParseException, JsonMappingException, IOException, EncodeException, JSONException {
		String type = null;
		String content = null;
		JSONObject json = null;
		Iterator<Session> iterator = users.iterator();
		try {
			System.out.println("received message: " + message);
			// session.getBasicRemote().sendText("Hello: " + message);
			json = new JSONObject(message);
			type = String.valueOf(json.get("type"));
			content = String.valueOf(json.get("content"));
			// System.out.println(content);
		} catch (Exception e) {
			e.printStackTrace();
		}

		ObjectMapper mapper = new ObjectMapper();

		if ("chat".equals(type)) {
			// System.out.println("userInput: " + content);

			MessageNode messageNode = mapper.readValue(content, MessageNode.class);

			String username = messageNode.getUsername();

			if (username == null)
				username = (String) session.getUserProperties().get("username");

			if (username == null) {
				session.getUserProperties().put("username", messageNode.getUsername());
				session.getBasicRemote()
						.sendObject(buildJsonData("System", "You are now connected as " + messageNode.getUsername()));
				username = messageNode.getUsername();
			}

			System.out.println("send object data: " + buildJsonData(username, messageNode.getMessage()));
			// System.out.println("send content: " + content);
			while (iterator.hasNext()) {
				iterator.next().getBasicRemote().sendObject(buildJsonData(username, messageNode.getMessage()));
				// iterator.next().getBasicRemote().sendObject(content);
			}
		} else {
			// the implementation of drawing on canvas
			System.out.println("No chat message: " + message);
			if ("line".equalsIgnoreCase(type)) {
				System.out.println("type is line: " + content);
				Line line = mapper.readValue(content, Line.class);

				line.setType(type);
				while (iterator.hasNext()) {
					iterator.next().getBasicRemote().sendObject(buildJsonData(line));
				}
			} else if ("rect".equalsIgnoreCase(type)) {
				System.out.println("type is rect: " + content);
				Rect rect = mapper.readValue(content, Rect.class);

				rect.setType(type);
				while (iterator.hasNext()) {
					iterator.next().getBasicRemote().sendObject(buildJsonData(rect));
				}
			} else if ("circle".equalsIgnoreCase(type)) {
				System.out.println("type is circle: " + content);
				Circle circle = mapper.readValue(content, Circle.class);

				circle.setType(type);
				while (iterator.hasNext()) {
					iterator.next().getBasicRemote().sendObject(buildJsonData(circle));
				}
			} else if ("polygon".equalsIgnoreCase(type)) {
				System.out.println("type is polygon: " + content);
				JSONObject polygonObject = json.getJSONObject("content");
				JSONArray array = polygonObject.getJSONArray("polygonPoints");
				System.out.println("polygonPoints: " + array);

				List<Point> polygonPoints = new ArrayList<>();
				for (int i = 0; i < array.length(); ++i) {
					JSONObject object = array.getJSONObject(i);
					int x = object.getInt("x");
					int y = object.getInt("y");
					polygonPoints.add(new Point(x, y));
				}

				Polygon polygon = new Polygon(polygonPoints);

				polygon.setType(type);
				try {
					while (iterator.hasNext()) {
						iterator.next().getBasicRemote().sendObject(buildJsonData(polygon));
					}
				} catch (Exception e) {
					e.printStackTrace();
				}

			} else if ("freeHand".equalsIgnoreCase(type)) {
				System.out.println("type is freeHand: " + content);
			}
		}
	}

	@OnOpen
	public void onOpen(Session session) {
		System.out.println("onOpen");
		users.add(session);
	}

	@OnClose
	public void onClose(Session session) {
		System.out.println("onClose");
		users.remove(session);
	}

	/*
	 * build json data - methods
	 */
	/**
	 * build a json object with passed string username and message
	 * 
	 * @param username
	 *            the user who sends the message
	 * @param message
	 *            is the message a user sends
	 * @return the json object
	 */
	private Object buildJsonData(String username, String message) {
		ObjectMapper mapper = new ObjectMapper();

		MessageNode node = new MessageNode(username, message);
		node.setType("chat");
		JsonNode json = null;
		try {
			json = mapper.valueToTree(node);
			System.out.println("json: " + json);
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		}

		return json;
	}

	private Object buildJsonData(Object objectToDraw) {
		ObjectMapper mapper = new ObjectMapper();

		JsonNode json = null;
		try {
			String jsonString = mapper.writeValueAsString(objectToDraw);
			System.out.println("jsonString: " + jsonString);

			json = mapper.valueToTree(objectToDraw);

			System.out.println("json when send: " + json);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return json;
	}

	private Object buildJsonData(Polygon objectToDraw) {
		List<Point> list = objectToDraw.getPolygonPoints();
		JSONArray array = new JSONArray();
		JSONObject o = new JSONObject();
		try {
			o.put("type", objectToDraw.getType());
			for (Point p : list) {
				JSONObject object = new JSONObject();
				object.put("x", p.getX());
				object.put("y", p.getY());

				array.put(object);
				System.out.println("Node: " + object);
			}
			o.put("content", array);
			System.out.println("Array: " + array);
			System.out.println("Object o: " + o);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return o;
	}
}
