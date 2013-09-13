package cn.edu.lzu.common.config.action;

import org.dom4j.Element;

import net.sf.json.JSONArray;
import cn.edu.lzu.common.action.BaseAction;
import cn.edu.lzu.common.config.bean.Config;
import cn.edu.lzu.config.BasicPropertiesWork;
import cn.edu.lzu.config.XmlParse;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;


public class ConfigAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = 8985468983791863577L;

	private java.util.List<Config> nodes=new java.util.ArrayList<Config>();
	
	protected final String physicalBaseDir= BasicPropertiesWork.getWebappsSitePath();
	private String nodesJson;
	private String root;
	
	
	public String getRoot() {
		return root;
	}

	public void setRoot(String root) {
		this.root = root;
	}

	public String getNodesJson() {
		return nodesJson;
	}

	public void setNodesJson(String nodesJson) {
		this.nodesJson = nodesJson;
	}

	public java.util.List<Config> getNodes() {
		return nodes;
		
	}

	public void setNodes(java.util.List<Config> nodes) {
		this.nodes = nodes;
	}

	public String showConfigNodes()
	{
		init() ;
		String nodeId=request.getParameter("node");
		String language=request.getParameter("language");
		if(language==null)
		{
			language="cn_name";
		}
		if(nodeId==null)
		{
			nodeId=root;
		}
		try {
			XmlParse xmlParse=new XmlParse(physicalBaseDir+"/"+BasicPropertiesWork.getConfigPath());
			java.util.List<Element> list=xmlParse.getChildrenAttributeList("id", nodeId);
			if(list==null)
			{
				return ERROR;
			}
			for(Element e:list)
			{
				java.util.Hashtable<String,String> ht=xmlParse.getDomElementAttr(e);
				;
				
				Config config=new Config();
				config.setId(ht.get("id"));
				config.setLeaf(xmlParse.isLeaf(e));
				config.setText(ht.get(language));
				config.setLink(ht.get("link"));
				nodes.add(config);
			}
			
		} catch (Exception e) {
			return ERROR;
		}
		
	
	
		
		JSONArray json=JSONArray.fromObject(nodes);
		nodesJson=json.toString().replace("\"", "'");
//		nodesJson="[{id:'level1',text:'22',leaft:false}]";
		return SUCCESS;
		
	}

	public String showNode() {
		init();
		String nodeId = request.getParameter("node");

		try {
			XmlParse xmlParse = new XmlParse(
					physicalBaseDir + "/" + BasicPropertiesWork.getConfigPath());
			Element node = xmlParse.getNode(nodeId);
			if(node == null) {
				return ERROR;
			}

			Config config = _getNodeConfig(xmlParse, node);
			nodes.add(config);
		} catch (Exception e) {
			return ERROR;
		}

		return SUCCESS;
	}

	@SuppressWarnings("unchecked")
	private Config _getNodeConfig(XmlParse xmlParse, Element node) throws Exception {
		String language = request.getParameter("language");
		if(language == null) {
			language = "cn_name";
		}
		Config config = new Config();
		Hashtable<String,String> attrs
				= xmlParse.getDomElementAttr(node);
		config.setId(attrs.get("id"));
		config.setLeaf(xmlParse.isLeaf(node));
		config.setText(attrs.get(language));
		config.setLink(attrs.get("link"));

		if (!xmlParse.isLeaf(node)) {
			List<Element> children = node.elements();
			List<Config> childrenConfig = new ArrayList<Config>();

			for (Element child : children) {
				Config childConfig = _getNodeConfig(xmlParse, child);
				childrenConfig.add(childConfig);
			}

			config.setNodes(childrenConfig);
		}

		return config;
	}
}
