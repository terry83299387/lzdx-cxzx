package cn.edu.lzu.display.action;

import cn.edu.lzu.common.config.action.ConfigAction;
import cn.edu.lzu.common.config.bean.Config;

public class TitleAction extends ConfigAction{

	private String titleId;
	private static java.util.Map<String,java.util.List<Config>> cacheTitleMap=new java.util.concurrent.ConcurrentHashMap<String,java.util.List<Config>>();
	public String getTitleId() {
		return titleId;
	}

	public void setTitleId(String titleId) {
		this.titleId = titleId;
	}

	public String showTitles()
	{
		init();
		String result=SUCCESS;
		String language=request.getParameter("language");
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
