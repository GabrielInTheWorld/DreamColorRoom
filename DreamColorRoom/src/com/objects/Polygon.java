package com.objects;

import java.awt.Point;
import java.util.List;

import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;

public class Polygon {
	private String type;
	private List<Point> polygonPoints;

	@JsonCreator
	public Polygon(@JsonProperty("polygonPoints") List<Point> polygonPoints) {
		this.polygonPoints = polygonPoints;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<Point> getPolygonPoints() {
		return polygonPoints;
	}

	public void setPolygonPoints(List<Point> polygonPoints) {
		this.polygonPoints = polygonPoints;
	}
}
