package cn.edu.lzu.common.editor.action;

import com.opensymphony.xwork2.ActionSupport;

public class Editor extends ActionSupport{
private String editor1;
	
	public String execute(){
		System.out.println(editor1);
		return SUCCESS;
	}
	

	public String getEditor1() {
		return editor1;
	}
	public void setEditor1(String editor1) {
		this.editor1 = editor1;
	}

}
