package cn.edu.lzu.display.action;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.dom4j.Element;

import cn.edu.lzu.common.action.BaseAction;
import cn.edu.lzu.common.news.bean.NewsSearchResultInfo;
import cn.edu.lzu.config.BasicPropertiesWork;
import cn.edu.lzu.config.XmlParse;
import cn.edu.lzu.db.beans.NewsDao;

public class NewsSearchingAction extends BaseAction {
	/**
	 * 
	 */
	private static final long serialVersionUID = -9094641782394004517L;

	public static final int BRIEF_CONTENT_LENGTH = 50;
	public static final int MAX_KEYWORD_NUM_IN_BRIFE_CONTENT = 3;

	private final String physicalBaseDir = BasicPropertiesWork
			.getWebappsSitePath();
	private DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

	private long results;
	private long totalSize;
	private List<NewsSearchResultInfo> newsList = new ArrayList<NewsSearchResultInfo>();

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

	/**
	 * @return the newsList
	 */
	public List<NewsSearchResultInfo> getNewsList() {
		return newsList;
	}

	/**
	 * @param newsList the newsList to set
	 */
	public void setNewsList(List<NewsSearchResultInfo> newsList) {
		this.newsList = newsList;
	}

	public String searchNews() {
		init();
		String titleId = request.getParameter("titleId");
		String keyword = request.getParameter("keyword");
		String lanType = request.getParameter("language");
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

		try {
			Set<String> nodeSet = null;
			if (titleId != null && titleId.length() != 0) {
				nodeSet = getSubjectIdSet(titleId);
			}

			NewsDao nd = new NewsDao();
			List<Object[]> list = nd.searchNews(nodeSet, keyword, lanType, start, limit);

			results = Math.min(limit, list.size());
			Object[] o;
			NewsSearchResultInfo newsInfo;
			for (int i = 0; i < results; i++) {
				o = list.get(i);
				newsInfo = new NewsSearchResultInfo();
				newsInfo.setNewsCode((String) o[0]);
				newsInfo.setNewsTitle((String) o[1]);
				newsInfo.setNewsSource((String) o[2]);
				newsInfo.setAuthor((String) o[3]);
				newsInfo.setCreateDate(
						dateFormat.format((Date) o[4]));
				newsInfo.setBriefContent(highlightKeyWord(keyword, (String) o[5]));
				newsList.add(newsInfo);
			}
		} catch (Exception e) {
			return ERROR;
		}

		return SUCCESS;
	}


	/*----------------- Privates -------------------------*/
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

	private String highlightKeyWord(String keyword, String content) {
		if (content == null || content.length() == 0
				|| keyword == null || keyword.length() == 0) {
			return content;
		}

		int keywordLen = keyword.length();
		int contentLen = content.length();
		String dots = "...";
		int dotsLen = dots.length();
		String replacer = "<span class=\"keyword\">" + keyword + "</span>";

		int idx = content.indexOf(keyword);
		int start, end;
		String brief = "";
		if (idx == -1) {
			end = idx + BRIEF_CONTENT_LENGTH;
			if (end < contentLen) {
				brief = content.substring(0, end) + dots;
			} else {
				brief = content;
			}
		} else {
			int replaceNum = 0;
			String tmp;
			int briefLen = 0;
			while (idx != -1 && replaceNum < MAX_KEYWORD_NUM_IN_BRIFE_CONTENT) {
				start = Math.max(0, idx - 10);
				end = Math.min(idx+keywordLen+10, contentLen);
				tmp = content.substring(start, end);
				briefLen += tmp.length();

				tmp = tmp.replace(keyword, replacer);

				if (start > 0 && replaceNum == 0) {
					tmp = dots + tmp;
					briefLen += dotsLen;
				}
				if (end < contentLen) {
					tmp += dots;
					briefLen += dotsLen;
				}

				brief += tmp;
				if (briefLen > BRIEF_CONTENT_LENGTH) {
					break;
				}

				++replaceNum;
				idx = content.indexOf(keyword, end);
			}
		}
		return brief;	
	}

}
