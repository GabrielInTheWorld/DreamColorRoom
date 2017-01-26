package com.websocket;

import java.util.Arrays;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.websocket.server.ServerContainer;
import javax.websocket.server.ServerEndpointConfig;

import com.decoder.MessageDecoder;
import com.encoder.MessageEncoder;
import com.encoder.NodeEncoder;

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
							MessageDecoder.class))
					.encoders(Arrays.asList( //
							MessageEncoder.class, //
							NodeEncoder.class))

					.build();

			container.addEndpoint(config);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
