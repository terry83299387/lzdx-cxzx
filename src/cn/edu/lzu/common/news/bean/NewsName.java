package cn.edu.lzu.common.news.bean;

public class NewsName {

	private String titleName;
	private String dateName;
	private String tagName;
	private String sourceName;
	private String authorName;
	private String language;

	public String getTitleName() {
		titleName = "标题";
		if ("en_name".equals(language)) {
			titleName = "Title";
		}
		return titleName;
	}

	public String getDateName() {
		dateName = "日期";
		if ("en_name".equals(language)) {
			dateName = "Date";
		}
		return dateName;
	}

	public String getTagName() {
		tagName = "标签";
		if ("en_name".equals(language)) {
			tagName = "Tag";
		}
		return tagName;
	}

	public String getSourceName() {
		sourceName = "来源";
		if ("en_name".equals(language)) {
			sourceName = "Source";
		}
		return sourceName;
	}

	public String getAuthorName() {
		authorName = "作者";
		if ("en_name".equals(language)) {
			authorName = "Author";
		}
		return authorName;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

}
