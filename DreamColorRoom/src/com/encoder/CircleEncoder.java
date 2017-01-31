package com.encoder;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

import org.codehaus.jackson.map.ObjectMapper;

import com.objects.Circle;

public class CircleEncoder implements Encoder.Text<Circle> {

	@Override
	public void destroy() {
		System.out.println("CircleEncoder - destroy-method");
	}

	@Override
	public void init(EndpointConfig arg0) {
		System.out.println("CircleEncoder - init-method");
	}

	@Override
	public String encode(Circle circle) throws EncodeException {
		System.out.println("MessageEncoder");
		ObjectMapper mapper = new ObjectMapper();
		String json = null;

		try {
			json = mapper.writeValueAsString(circle);
		} catch (Exception e) {
			System.out.println("Exception in MessageEncoder");
			e.printStackTrace();
		}

		return json;
	}

}
