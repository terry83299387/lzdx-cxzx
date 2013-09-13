package cn.edu.lzu.common.config.bean;

import java.util.ArrayList;
import java.util.List;

public class Config {
	private String id;
	private String text;
	private String link;
	boolean leaf;
	private List<Config> nodes;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public boolean isLeaf() {
		return leaf;
	}

	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}
	public String getLink() {
		return link;
	}
	public void setLink(String link) {
		this.link = link;
	}

	/**
	 * @param nodes
	 *            the nodes to set
	 */
	public void setNodes(List<Config> nodes) {
		this.nodes = nodes;
	}

	/**
	 * @return the nodes
	 */
	public List<Config> getNodes() {
		if (nodes == null) {
			nodes = new ArrayList<Config>();
		}
		return nodes;
	}

}
