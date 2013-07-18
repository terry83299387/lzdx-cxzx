package cn.edu.lzu.db.beans;

public class Subjects {

	public String getSubjectCode() {
		return subjectCode;
	}
	public void setSubjectCode(String subjectCode) {
		this.subjectCode = subjectCode;
	}
	public String getCnName() {
		return cnName;
	}
	public void setCnName(String cnName) {
		this.cnName = cnName;
	}
	public String getEnName() {
		return enName;
	}
	public void setEnName(String enName) {
		this.enName = enName;
	}
	public String getDefaultLink() {
		return defaultLink;
	}
	public void setDefaultLink(String defaultLink) {
		this.defaultLink = defaultLink;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getParentSubjectCode() {
		return parentSubjectCode;
	}
	public void setParentSubjectCode(String parentSubjectCode) {
		this.parentSubjectCode = parentSubjectCode;
	}
	private String subjectCode;
	private String cnName;
	private String enName;
	private String defaultLink;
	private String type;
	private String parentSubjectCode;
	
}
