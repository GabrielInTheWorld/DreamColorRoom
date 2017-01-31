package com.objects;

import java.awt.Point;
import java.util.List;

import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;

public class FreeHand {
	private String type;
	private List<Point> freeStylePoints;
	private int size;

	@JsonCreator
	public FreeHand( //
			@JsonProperty("freeStylePoints") List<Point> freeStylePoints, //
			@JsonProperty("size") int size) {
		this.freeStylePoints = freeStylePoints;
		this.size = size;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<Point> getFreeStylePoints() {
		return freeStylePoints;
	}

	public void setFreeStylePoints(List<Point> freeStylePoints) {
		this.freeStylePoints = freeStylePoints;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

}
