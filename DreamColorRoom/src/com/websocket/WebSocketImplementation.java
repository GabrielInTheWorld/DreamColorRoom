package com.websocket;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
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
import org.codehaus.jettison.json.JSONObject;

import com.objects.MessageNode;

@ServerEndpoint("/websocket")
public class WebSocketImplementation {

	static Set<Session> users = Collections.synchronizedSet(new HashSet<Session>());

	@OnMessage
	public void onMessage(String message, Session session)
			throws JsonParseException, JsonMappingException, IOException, EncodeException {
		String type = null;
		String content = null;
		Iterator<Session> iterator = users.iterator();
		try {
			System.out.println("received message: " + message);
			// session.getBasicRemote().sendText("Hello: " + message);
			JSONObject json = new JSONObject(message);
			type = String.valueOf(json.get("type"));
			content = String.valueOf(json.get("content"));
			System.out.println(content);
		} catch (Exception e) {
			e.printStackTrace();
		}

		ObjectMapper mapper = new ObjectMapper();

		if ("chat".equals(type)) {
			System.out.println("userInput: " + content);

			MessageNode messageNode = mapper.readValue(content, MessageNode.class);

			String username = messageNode.getUsername();

			if (username == null)
				username = (String) session.getUserProperties().get("username");

			if (username == null) {
				session.getUserProperties().put("username", messageNode.getUsername());
				session.getBasicRemote()
						.sendObject(buildJsonData("System", "You are now connected as " + messageNode.getUsername()));
				username = messageNode.getUsername();
				// while (iterator.hasNext()) {
				// iterator.next().getBasicRemote().sendObject(buildJsonData(username,
				// messageNode.getMessage()));
				// }
			} else {
				// while (iterator.hasNext()) {
				// iterator.next().getBasicRemote().sendObject(buildJsonData(username,
				// messageNode.getMessage()));
				// }
			}
			System.out.println("send object data: " + buildJsonData(username, messageNode.getMessage()));
			while (iterator.hasNext()) {
				iterator.next().getBasicRemote().sendObject(buildJsonData(username, messageNode.getMessage()));
			}
		} else {
			// the implementation of drawing on canvas
			System.out.println("No chat message");
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

}
