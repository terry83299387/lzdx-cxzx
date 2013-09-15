package cn.edu.lzu.display.action;

import net.sf.json.JSONArray;

import org.dom4j.Element;

import cn.edu.lzu.common.config.action.ConfigAction;
import cn.edu.lzu.common.config.bean.Config;
import cn.edu.lzu.common.news.bean.NewsInfo;
import cn.edu.lzu.config.BasicPropertiesWork;
import cn.edu.lzu.config.XmlParse;
import cn.edu.lzu.db.beans.NewsDao;

public class ShouyeAction extends ConfigAction {
	private java.util.List<NewsInfo> newsList = new java.util.ArrayList<NewsInfo>();
	private  java.util.Map<String, Config> titleMap = new java.util.LinkedHashMap();
	private String titleJson;
	private String titles = "";
	private String language;
	private String titleId;
	private String pictureNodeId;
	private String searchTitle;
	
	
	public String getSearchTitle() {
		if("cn_name".equals(language))
		{
			searchTitle = "站内搜索";
		}
		else
		{
			searchTitle = "Website Search";
		}
		return searchTitle;
	}

	public void setSearchTitle(String searchTitle) {
		
		this.searchTitle=searchTitle;
	}

	public String getTitleJson() {
		if (titleMap.keySet().size()==0) {
			return null;
		}
		JSONArray json = JSONArray.fromObject(titleMap.values());
		if (json != null) {
			return json.toString();
		}
		return null;
	}

	public void setTitleJson(String titleJson) {
		this.titleJson = titleJson;
	}

	public String getPictureNodeId() {
		return pictureNodeId;
	}

	public void setPictureNodeId(String pictureNodeId) {
		this.pictureNodeId = pictureNodeId;
	}

	public java.util.Map<String, Config> getTitleMap() {
		return titleMap;
	}

	public void setTitleList(java.util.Map<String, Config> titleMap) {
		this.titleMap = titleMap;
	}

	public String getTitleId() {
		return titleId;
	}

	public void setTitleId(String titleId) {
		this.titleId = titleId;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public void setTitles(String titles) {
		this.titles = titles;
	}

	public String getTitles() {
		return titles;
	}

	public java.util.List<NewsInfo> getNewsList() {
		return newsList;
	}

	public void setNewsList(java.util.List<NewsInfo> newsList) {
		this.newsList = newsList;
	}

	public String showTitles() {
		init();
		language = request.getParameter("language");
		titleId = request.getParameter("titleId");
		showNewsList();
	
		titleMap.clear();
		try {
			XmlParse xmlParse = new XmlParse(physicalBaseDir + "/"
					+ BasicPropertiesWork.getConfigPath());
			for (String titleNode : titles.split(",")) {
				java.util.Hashtable<String, String> ht = xmlParse.getNodeAttr(
						"id", titleNode);
				Config config = new Config();
				config.setId(titleNode);
				if (ht != null) {

					config.setText(ht.get(language));
					config.setLink(ht.get("link"));
				}

				titleMap.put(titleNode, config);

			}
		} catch (Exception e) {
			e.printStackTrace();
			return ERROR;
		}

		return SUCCESS;
	}

	private java.util.Set<String> getSubjectIdSet(String nodeid)
			throws Exception {
		java.util.Set<String> set = new java.util.HashSet<String>();
		XmlParse xmlParse = new XmlParse(physicalBaseDir + "/"
				+ BasicPropertiesWork.getConfigPath());
		java.util.List<Element> list = xmlParse.getAllChildrenAttributeList(
				"id", nodeid);
		for (Element e : list) {
			set.add(e.attribute("id").getValue());

		}
		return set;
	}

	public String showNewsList() {
		try {
			init();
			String nodeid = pictureNodeId;
			String lanType = language;
			String range = "all";
			Integer start = 0;
			Integer limit = 10;
			java.util.Set<String> nodeSet = new java.util.HashSet<String>();

			if ("all".equals(range)) {
				nodeSet = getSubjectIdSet(nodeid);
			}
			nodeSet.add(nodeid);

			NewsDao dn = new NewsDao();
			java.util.List<Object[]> list = dn.getAllSubSubjectNews(nodeSet,
					lanType, start, limit);

			for (int i = start; i < (start + limit) && i < list.size(); i++) {
				Object[] o = list.get(i);
				NewsInfo newsInfo = new NewsInfo();
				newsInfo.setNewsCode((String) o[0]);
				newsInfo.setNewsTitle((String) o[1]);
				newsInfo.setNewsSource((String) o[2]);
				newsInfo.setNewsPicture((String) o[3]);
				newsInfo.setNewsTag((String) o[4]);
				newsInfo.setAuthor((String) o[5]);
				newsInfo.setNewsPriority((Integer) o[7]);
				newsInfo.setType((String) o[8]);
				newsList.add(newsInfo);
			}

		} catch (Exception e) {
			return ERROR;
		}
		return SUCCESS;
	}

}
