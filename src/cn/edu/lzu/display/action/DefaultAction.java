package cn.edu.lzu.display.action;

import net.sf.json.JSONArray;

import org.dom4j.Element;

import cn.edu.lzu.common.action.BaseAction;
import cn.edu.lzu.common.config.action.ConfigAction;
import cn.edu.lzu.common.config.bean.Config;
import cn.edu.lzu.common.news.bean.NewsInfo;
import cn.edu.lzu.config.BasicPropertiesWork;
import cn.edu.lzu.config.XmlParse;
import cn.edu.lzu.db.beans.NewsDao;

public class DefaultAction extends BaseAction {

	private String language;

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String showDefault() {
		init();
		language = request.getParameter("language");
		if (language == null) {
			language = "cn_name";
		}

		return SUCCESS;
	}

}
