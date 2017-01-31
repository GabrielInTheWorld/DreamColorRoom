package com.objects;

import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;

public class Rect {
	private String type;
	private int x, y, width, height;

	@JsonCreator
	public Rect( //
			@JsonProperty("x") int x, //
			@JsonProperty("y") int y, //
			@JsonProperty("width") int width, //
			@JsonProperty("height") int height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

}
