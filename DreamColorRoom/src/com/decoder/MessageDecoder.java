package com.decoder;

import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

import org.codehaus.jackson.map.ObjectMapper;

import com.objects.MessageNode;

public class MessageDecoder implements Decoder.Text<MessageNode> {

	@Override
	public void destroy() {

	}

	@Override
	public void init(EndpointConfig arg0) {

	}

	@Override
	public MessageNode decode(String jsonMessage) throws DecodeException {
		ObjectMapper mapper = new ObjectMapper();
		try {
			System.out.println("json: " + jsonMessage);
			return mapper.readValue(jsonMessage, MessageNode.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public boolean willDecode(String jsonMessage) {
		return jsonMessage != null;
	}

}
