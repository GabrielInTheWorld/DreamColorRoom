package com.encoder;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

import org.codehaus.jackson.map.ObjectMapper;

import com.objects.FreeHand;

public class FreeHandEncoder implements Encoder.Text<FreeHand> {

	@Override
	public void destroy() {
		System.out.println("FreeHandEncoder - destroy-method");
	}

	@Override
	public void init(EndpointConfig arg0) {
		System.out.println("FreeHandEncoder - init-method");
	}

	@Override
	public String encode(FreeHand freeHand) throws EncodeException {
		System.out.println("MessageEncoder");
		ObjectMapper mapper = new ObjectMapper();
		String json = null;

		try {
			json = mapper.writeValueAsString(freeHand);
		} catch (Exception e) {
			System.out.println("Exception in MessageEncoder");
			e.printStackTrace();
		}

		return json;
	}

}
