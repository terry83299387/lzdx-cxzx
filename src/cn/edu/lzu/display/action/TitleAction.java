package cn.edu.lzu.display.action;

import cn.edu.lzu.common.config.action.ConfigAction;
import cn.edu.lzu.common.config.bean.Config;

public class TitleAction extends ConfigAction{

	private String titleId;
	private String language;
	private static java.util.Map<String,java.util.List<Config>> cacheTitleMap=new java.util.concurrent.ConcurrentHashMap<String,java.util.List<Config>>();
	public String getTitleId() {
		return titleId;
	}

	public  java.util.Map<String, java.util.List<Config>> getCacheTitleMap() {
		return cacheTitleMap;
	}

	public  void setCacheTitleMap(
			java.util.Map<String, java.util.List<Config>> cacheTitleMap) {
		TitleAction.cacheTitleMap = cacheTitleMap;
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

	public String showTitles()
	{
		init();
		String result=SUCCESS;
		language=request.getParameter("language");
		if(language==null)
		{
			language="cn_name";
		}
		if(cacheTitleMap.get(language)==null)
		{
			 result=this.showConfigNodes();
			 cacheTitleMap.put(language, this.getNodes());
		}
		else
		{
			init() ;
			this.setNodes(cacheTitleMap.get(language));
		}
		titleId=request.getParameter("titleId");
		return result;
		
	}
	
}
