package cn.edu.lzu.display.action;

import org.dom4j.Element;

import cn.edu.lzu.common.action.BaseAction;
import cn.edu.lzu.common.news.bean.NewsInfo;
import cn.edu.lzu.config.BasicPropertiesWork;
import cn.edu.lzu.config.XmlParse;
import cn.edu.lzu.db.beans.News;
import cn.edu.lzu.db.beans.NewsDao;

public class NewsAction extends BaseAction {
	private final String physicalBaseDir = BasicPropertiesWork
			.getWebappsSitePath();

	private long results;
	private java.util.List<NewsInfo> newsList = new java.util.ArrayList<NewsInfo>();
	private java.text.DateFormat dateFormat = new java.text.SimpleDateFormat(
			"yyyy-MM-dd");
	private NewsInfo newsInfo;

	public NewsInfo getNewsInfo() {
		return newsInfo;
	}

	public void setNewsInfo(NewsInfo newsInfo) {
		this.newsInfo = newsInfo;
	}

	public long getResults() {
		return results;
	}

	public void setResults(long results) {
		this.results = results;
	}

	public java.util.List<NewsInfo> getNewsList() {
		return newsList;
	}

	public void setNewsList(java.util.List<NewsInfo> newsList) {
		this.newsList = newsList;
	}

	public String deleteNews() {
		try {
			init();
			String delNewsGroup = request.getParameter("newsCodes");
			NewsDao nd = new NewsDao();
			nd.delNewsGroup(delNewsGroup.split(","));

		} catch (Exception e) {
			return ERROR;
		}
		return SUCCESS;

	}

	public String loadNews() {
		try {
			init();
			String newsCode = request.getParameter("newsCode");

			NewsDao nd = new NewsDao();
			News news = nd.getNews(newsCode);

			newsInfo = new NewsInfo();
			newsInfo.setNewsCode(news.getNewsCode());
			newsInfo.setNewsTitle(news.getNewsTitle());
			newsInfo.setNewsSource(news.getNewsSource());
			newsInfo.setNewsPicture(news.getNewsPicture());
			newsInfo.setNewsTag(news.getNewsTag());
			newsInfo.setAuthor(news.getAuthor());

			newsInfo.setCreateDate(dateFormat.format(news.getCreateDate()));
			newsInfo.setNewsPriority(news.getNewsPriority());
			newsInfo.setType(news.getType());
			newsInfo.setNewsContent(news.getNewsContent());
		} catch (Exception e) {
			return ERROR;
		}
		return SUCCESS;
	}

	private java.util.Set<String> getSubjectIdSet(String nodeid)
			throws Exception {
		java.util.Set<String> set = new java.util.HashSet<String>();
		XmlParse xmlParse = new XmlParse(physicalBaseDir + "/"
				+ BasicPropertiesWork.getConfigPath());
		java.util.List<Element> list = xmlParse.getAllChildrenAttributeList("id",
				nodeid);
		for (Element e : list) {
			set.add(e.attribute("id").getValue());

		}
		return set;
	}

	public String showNewsList() {
		try {
			init();
			String nodeid = request.getParameter("nodeid");
			String lanType = request.getParameter("language");
			String range = request.getParameter("range");
			Integer start = Integer.valueOf(request.getParameter("start"));
			Integer limit = Integer.valueOf(request.getParameter("limit"));
			java.util.Set<String> nodeSet=new java.util.HashSet<String>();
			
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
				newsInfo
						.setCreateDate(dateFormat.format((java.util.Date) o[6]));
				newsInfo.setNewsPriority((Integer) o[7]);
				newsInfo.setType((String) o[8]);
				newsList.add(newsInfo);
			}
			results = list.size();
		} catch (Exception e) {
			return ERROR;
		}
		return SUCCESS;
	}

}
