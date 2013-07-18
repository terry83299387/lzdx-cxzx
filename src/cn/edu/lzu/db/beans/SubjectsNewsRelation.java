package cn.edu.lzu.db.beans;

public class SubjectsNewsRelation implements java.io.Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 4076264694651645394L;
	private String subjectCode;
	private String newsCode;
	private java.util.Set<News> newsSet=new java.util.HashSet<News>();
	public String getSubjectCode() {
		return subjectCode;
	}
	public void setSubjectCode(String subjectCode) {
		this.subjectCode = subjectCode;
	}
	public String getNewsCode() {
		return newsCode;
	}
	public void setNewsCode(String newsCode) {
		this.newsCode = newsCode;
	}
	public java.util.Set<News> getNewsSet() {
		return newsSet;
	}
	public void setNewsSet(java.util.Set<News> newsSet) {
		this.newsSet = newsSet;
	}
	
}
