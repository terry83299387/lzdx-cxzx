package cn.edu.lzu.display.action;

import cn.edu.lzu.common.action.BaseAction;
import cn.edu.lzu.common.news.bean.NewsInfo;

import cn.edu.lzu.db.beans.News;
import cn.edu.lzu.db.beans.NewsDao;


public class LogoAction extends BaseAction{

	private String language;
	private String nodeId;
	private String exception;
	private NewsInfo newsInfo;
	public String getException() {
		return exception;
	}
	public void setException(String exception) {
		this.exception = exception;
	}


	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	public String getNodeId() {
		return nodeId;
	}
	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}
	
	public NewsInfo getNewsInfo() {
		return newsInfo;
	}
	public void setNewsInfo(NewsInfo newsInfo) {
		this.newsInfo = newsInfo;
	}
	public String showLogoPage()
	{
		init();
		try {
			
			NewsDao nd = new NewsDao();
			language = request.getParameter("language");
			java.util.List<News> newsList=nd.getSubjectNews(nodeId, language, 0, 1);
			if(newsList.size()>0)
			{
				newsInfo=new NewsInfo();
				newsInfo.setNewsContent(newsList.get(0).getNewsContent());
			}

			
		} catch (Exception e) {
			this.exception=e.getMessage();
			return ERROR;
		}
		
		
		return SUCCESS;
	}
}
