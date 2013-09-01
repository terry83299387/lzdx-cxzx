package cn.edu.lzu.display.action;

import cn.edu.lzu.common.config.action.ConfigAction;
import cn.edu.lzu.common.config.bean.Config;

public class TitleAction extends ConfigAction{

	private String titleId;
	private static java.util.ArrayList<Config> cacheTitlList=null;
	public String getTitleId() {
		return titleId;
	}

	public void setTitleId(String titleId) {
		this.titleId = titleId;
	}

	public String showTitles()
	{
		String result=SUCCESS;
		if(cacheTitlList==null)
		{
			 result=this.showConfigNodes();
			 cacheTitlList=this.getNodes();
		}
		else
		{
			init() ;
			this.setNodes(cacheTitlList);
		}
		titleId=request.getParameter("titleId");
		return result;
		
	}
	
}
