package com.encoder;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

import org.codehaus.jackson.map.ObjectMapper;

import com.objects.Rect;

public class RectEncoder implements Encoder.Text<Rect> {

	@Override
	public void destroy() {
		System.out.println("RectangleEncoder - destroy-method");
	}

	@Override
	public void init(EndpointConfig arg0) {
		System.out.println("RectangleEncoder - init-method");
	}

	@Override
	public String encode(Rect rect) throws EncodeException {
		System.out.println("MessageEncoder");
		ObjectMapper mapper = new ObjectMapper();
		String json = null;

		try {
			json = mapper.writeValueAsString(rect);
		} catch (Exception e) {
			System.out.println("Exception in MessageEncoder");
			e.printStackTrace();
		}

		return json;
	}

}
