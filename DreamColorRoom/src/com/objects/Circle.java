package com.objects;

import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;

public class Circle {
	private String id;
	private int x, y;
	private float radius, arc;
	private String type;

	@JsonCreator
	public Circle( //
			@JsonProperty("x") int x, //
			@JsonProperty("y") int y, //
			@JsonProperty("radius") float radius, //
			@JsonProperty("arc") float arc) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.arc = arc;
	}

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
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

	public float getRadius() {
		return radius;
	}

	public void setRadius(float radius) {
		this.radius = radius;
	}

	public float getArc() {
		return arc;
	}

	public void setArc(float arc) {
		this.arc = arc;
	}

}
