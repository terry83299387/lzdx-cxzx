package cn.edu.lzu.display.action;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.dom4j.Element;

import cn.edu.lzu.common.action.BaseAction;
import cn.edu.lzu.common.news.bean.NewsInfo;
import cn.edu.lzu.config.BasicPropertiesWork;
import cn.edu.lzu.config.XmlParse;
import cn.edu.lzu.db.beans.News;
import cn.edu.lzu.db.beans.NewsDao;

public class NewsAction extends BaseAction {
	/**
	 * 
	 */
	private static final long serialVersionUID = -9094641782394004517L;

	private final String physicalBaseDir = BasicPropertiesWork
			.getWebappsSitePath();
	private DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

	private long results;
	private long totalSize;
	private List<NewsInfo> newsList = new ArrayList<NewsInfo>();
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

	/**
	 * @param totalSize the totalSize to set
	 */
	public void setTotalSize(long totalSize) {
		this.totalSize = totalSize;
	}

	/**
	 * @return the totalSize
	 */
	public long getTotalSize() {
		return totalSize;
	}

	public java.util.List<NewsInfo> getNewsList() {
		return newsList;
	}

	public void setNewsList(List<NewsInfo> newsList) {
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
			if (newsCode == null) {
				newsCode = (String) request.getAttribute("newsCode");
			}

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
		Set<String> set = new HashSet<String>();
		XmlParse xmlParse = new XmlParse(physicalBaseDir + "/"
				+ BasicPropertiesWork.getConfigPath());
		List<Element> list = xmlParse.getAllChildrenAttributeList("id",
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
//			Integer start = Integer.valueOf(request.getParameter("start"));
//			Integer limit = Integer.valueOf(request.getParameter("limit"));
			int start = 0;
			String startStr = request.getParameter("start");
			if (startStr != null) {
				start = Integer.valueOf(startStr);
			}
			int limit = 100;
			String limitStr = request.getParameter("limit");
			if (limitStr != null) {
				limit = Integer.valueOf(limitStr);
			}

			Set<String> nodeSet=new HashSet<String>();
			
			if ("all".equals(range)) {
				nodeSet = getSubjectIdSet(nodeid);
			}
			nodeSet.add(nodeid);

			NewsDao nd = new NewsDao();
			List<Object[]> list = nd.getAllSubSubjectNews(nodeSet,
					lanType, start, limit);

			results = Math.min(limit, list.size());
			Object[] o;
			NewsInfo newsInfo;
			for (int i = 0; i < results; i++) {
				o = list.get(i);
				newsInfo = new NewsInfo();
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
		} catch (Exception e) {
			return ERROR;
		}
		return SUCCESS;
	}

	public String showNewsListOrDetail() {
		init();
		String isError = showNewsList();
		if (ERROR.equals(isError)) {
			return ERROR;
		}

		NewsDao nd = new NewsDao();
		String nodeId = request.getParameter("nodeid");
		String lanType = request.getParameter("language");
		try {
			totalSize = nd.getNewsCount(nodeId, lanType);
		} catch (Exception e) {
			return ERROR;
		}
		if (totalSize == 1) {
			String newsCode = newsList.get(0).getNewsCode();
			request.setAttribute("newsCode", newsCode);
			return loadNews();
		}

		return SUCCESS;
	}

}
