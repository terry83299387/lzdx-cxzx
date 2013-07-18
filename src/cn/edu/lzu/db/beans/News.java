package cn.edu.lzu.db.beans;

public class News implements java.io.Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1564605583257170781L;
	private String newsCode;
	private String newsTitle;
	private String newsContent;
	private String newsLink;
	private java.util.Date createDate;
	private String newsSource;
	private String newsPicture;
	private String newsTag;
	private String author;
	private String type;
	private int newsPriority;
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getNewsCode() {
		return newsCode;
	}
	public void setNewsCode(String newsCode) {
		this.newsCode = newsCode;
	}
	public String getNewsTitle() {
		return newsTitle;
	}
	public void setNewsTitle(String newsTitle) {
		this.newsTitle = newsTitle;
	}
	public String getNewsContent() {
		return newsContent;
	}
	public void setNewsContent(String newsContent) {
		this.newsContent = newsContent;
	}
	public String getNewsLink() {
		return newsLink;
	}
	public void setNewsLink(String newsLink) {
		this.newsLink = newsLink;
	}
	public java.util.Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(java.util.Date createDate) {
		this.createDate = createDate;
	}
	public String getNewsSource() {
		return newsSource;
	}
	public void setNewsSource(String newsSource) {
		this.newsSource = newsSource;
	}
	public String getNewsPicture() {
		return newsPicture;
	}
	public void setNewsPicture(String newsPicture) {
		this.newsPicture = newsPicture;
	}
	public String getNewsTag() {
		return newsTag;
	}
	public void setNewsTag(String newsTag) {
		this.newsTag = newsTag;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public int getNewsPriority() {
		return newsPriority;
	}
	public void setNewsPriority(int newsPriority) {
		this.newsPriority = newsPriority;
	}
	
	
}
