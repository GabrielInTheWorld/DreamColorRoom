package com.decoder;

import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

import org.codehaus.jackson.map.ObjectMapper;

import com.objects.Circle;

public class CircleDecoder implements Decoder.Text<Circle> {

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	@Override
	public void init(EndpointConfig arg0) {
		// TODO Auto-generated method stub

	}

	@Override
	public Circle decode(String code) throws DecodeException {
		ObjectMapper mapper = new ObjectMapper();
		try {
			System.out.println("json: " + code);
			return mapper.readValue(code, Circle.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public boolean willDecode(String code) {
		return code != null;
	}

}
