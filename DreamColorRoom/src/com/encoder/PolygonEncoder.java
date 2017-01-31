package com.encoder;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

import org.codehaus.jackson.map.ObjectMapper;

import com.objects.Polygon;

public class PolygonEncoder implements Encoder.Text<Polygon> {

	@Override
	public void destroy() {
		System.out.println("PolygonEncoder - destroy-method");
	}

	@Override
	public void init(EndpointConfig arg0) {
		System.out.println("PolygonEncoder - init-method");
	}

	@Override
	public String encode(Polygon polygon) throws EncodeException {
		System.out.println("MessageEncoder");
		ObjectMapper mapper = new ObjectMapper();
		String json = null;

		try {
			json = mapper.writeValueAsString(polygon);
		} catch (Exception e) {
			System.out.println("Exception in MessageEncoder");
			e.printStackTrace();
		}

		return json;
	}

}
