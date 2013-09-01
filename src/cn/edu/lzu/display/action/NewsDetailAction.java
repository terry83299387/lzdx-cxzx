package cn.edu.lzu.display.action;

import cn.edu.lzu.common.news.bean.NewsName;



public class NewsDetailAction extends NewsAction {

	private String titleId;
	private String newsCode;
	private String language;
	private NewsName newsName;
	
	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public NewsName getNewsName() {
		return newsName;
	}

	public void setNewsName(NewsName newsName) {
		this.newsName = newsName;
	}

	public String getTitleId() {
		return titleId;
	}

	public void setTitleId(String titleId) {
		this.titleId = titleId;
	}

	public String getNewsCode() {
		return newsCode;
	}

	public void setNewsCode(String newsCode) {
		this.newsCode = newsCode;
	}

	public String showNews() {
		String result=SUCCESS;
		init();
		titleId = request.getParameter("titleId");
		newsCode = request.getParameter("newsCode");
		language= request.getParameter("language");
		newsName=new NewsName();
		newsName.setLanguage( language);
		if(newsCode!=null)
		{
			 result = loadNews();
		}
		

		return result;
	}

}
