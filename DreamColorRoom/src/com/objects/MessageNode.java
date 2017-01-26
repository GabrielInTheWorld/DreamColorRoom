package com.objects;

import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;

public class MessageNode {
	private String username, message;
	private String type;

	public MessageNode() {

	}

	@JsonCreator
	public MessageNode(@JsonProperty("username") String username, @JsonProperty("message") String message) {
		this.username = username;
		this.message = message;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getUsername() {
		return username;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getMessage() {
		return message;
	}

	public String asText() {
		return "{\"username\" : \"" + username + "\", \"message\" : \"" + message + "\"}";
	}
}
