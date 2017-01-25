package com.websocket;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/websocket")
public class WebSocketImplementation {

	@OnMessage
	public void onMessage(String message, Session session) {
		try {
			System.out.println("received message: " + message);
			session.getBasicRemote().sendText("Hello: " + message);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@OnOpen
	public void onOpen() {
		System.out.println("onOpen");
	}

	@OnClose
	public void onClose() {
		System.out.println("onClose");
	}

}
