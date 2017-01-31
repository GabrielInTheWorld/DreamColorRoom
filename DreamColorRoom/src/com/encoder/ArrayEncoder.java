package com.encoder;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jettison.json.JSONObject;

public class ArrayEncoder implements Encoder.Text<JSONObject> {

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	@Override
	public void init(EndpointConfig arg0) {
		// TODO Auto-generated method stub

	}

	@Override
	public String encode(JSONObject object) throws EncodeException {
		System.out.println("ArrayEncoder: " + object);
		ObjectMapper mapper = new ObjectMapper();
		String json = null;

		try {
			// json = mapper.writeValueAsString(array);
			json = object.toString();
			System.out.println("json: " + json);
		} catch (Exception e) {
			System.out.println("Exception in ArrayEncoder");
			e.printStackTrace();
		}

		return json;
	}

}
