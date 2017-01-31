package com.websocket;

import java.util.Arrays;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.websocket.server.ServerContainer;
import javax.websocket.server.ServerEndpointConfig;

import com.decoder.CircleDecoder;
import com.decoder.FreeHandDecoder;
import com.decoder.LineDecoder;
import com.decoder.MessageDecoder;
import com.decoder.PolygonDecoder;
import com.decoder.RectDecoder;
import com.encoder.ArrayEncoder;
import com.encoder.CircleEncoder;
import com.encoder.FreeHandEncoder;
import com.encoder.LineEncoder;
import com.encoder.MessageEncoder;
import com.encoder.NodeEncoder;
import com.encoder.PolygonEncoder;
import com.encoder.RectEncoder;

public class StartupListener implements ServletContextListener {

	private final static String uri = "/websocket";

	@Override
	public void contextDestroyed(ServletContextEvent event) {

	}

	@Override
	public void contextInitialized(ServletContextEvent event) {
		ServletContext context = event.getServletContext();
		ServerContainer container = (ServerContainer) context.getAttribute(ServerContainer.class.getName());

		try {
			ServerEndpointConfig config = ServerEndpointConfig.Builder.create(WebSocketImplementation.class, uri)
					.decoders(Arrays.asList( //
							MessageDecoder.class, //
							LineDecoder.class, //
							RectDecoder.class, //
							CircleDecoder.class, //
							PolygonDecoder.class, //
							FreeHandDecoder.class))
					.encoders(Arrays.asList( //
							MessageEncoder.class, //
							NodeEncoder.class, //
							LineEncoder.class, //
							RectEncoder.class, //
							CircleEncoder.class, //
							PolygonEncoder.class, //
							FreeHandEncoder.class, //
							ArrayEncoder.class))
					.build();

			container.addEndpoint(config);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
