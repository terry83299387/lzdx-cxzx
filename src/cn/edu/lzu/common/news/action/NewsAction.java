package cn.edu.lzu.common.news.action;

import cn.edu.lzu.common.action.BaseAction;
import cn.edu.lzu.common.news.bean.NewsInfo;
import cn.edu.lzu.db.beans.News;
import cn.edu.lzu.db.beans.NewsDao;

public class NewsAction extends BaseAction {

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

	public String submitNews() {
		try {
			init();

			
			String subjectCode=request.getParameter("subjectCode");
			String newsCode = request.getParameter("newsCode");
			String newsTitle = request.getParameter("newsTitle");
			String newsContent = request.getParameter("newsTextarea");
			String newsCreateDate = request.getParameter("newsCreateDate");
			String newsPicture = request.getParameter("newsTitlePicture");
			String type = request.getParameter("newsLanguage");
			String author = request.getParameter("newsAuthor");
			String newsPriority = request.getParameter("newsPriority");
			String newsTag = request.getParameter("newsTag");
			String newsSource = request.getParameter("newsSource");

			java.util.Date createDate = new java.util.Date(System
					.currentTimeMillis());
			if (newsCreateDate != null) {

				
				createDate = dateFormat.parse(newsCreateDate);
			}
			
			int priority=0;
			try
			{
				priority=Integer.valueOf(newsPriority);
			}
			catch (Exception e)
			{
				priority=0;
			}
			News news = new News();
			
			
			news.setAuthor(author);

			news.setCreateDate(createDate);
			
			news.setNewsContent(newsContent);
			news.setNewsPicture(newsPicture);
			news.setNewsLink(null);
			news.setNewsPriority(priority);
			news.setNewsSource(newsSource);
			news.setNewsTag(newsTag);
			news.setNewsTitle(newsTitle);
			news.setType(type);
			
			NewsDao nd=new NewsDao();
			
			if(newsCode!=null&&!newsCode.trim().equals(""))
			{
			news.setNewsCode(newsCode);
			nd.updateNews(news);
			}
			else
			{
			nd.addNews(news, subjectCode);
			}
			
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

	public String showNewsList() {
		try {
			init();
			String nodeid = request.getParameter("nodeid");
			String lanType = request.getParameter("type");
			Integer start = Integer.valueOf(request.getParameter("start"));
			Integer limit = Integer.valueOf(request.getParameter("limit"));

			NewsDao dn = new NewsDao();
			java.util.List<Object[]> list = dn.getAllSubjectNewsAttrib(nodeid,
					lanType);

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
