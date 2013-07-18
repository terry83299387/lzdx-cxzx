package cn.edu.lzu.common.file.action;


import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts2.ServletActionContext;



import cn.edu.lzu.common.file.bean.PageFileInfo;
import cn.edu.lzu.config.BasicPropertiesWork;


import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

public class ShowFileContent extends ActionSupport {

	private static final long serialVersionUID = 1L;
	private final String physicalBaseDir = BasicPropertiesWork.getWebappsSitePath();

	private final String home = BasicPropertiesWork.getFileHome();
	private HttpServletRequest request;
	private HttpServletResponse response;
	// private HttpServletResponse response;

	private InputStream inputStream;

	public InputStream getInputStream() {
		return inputStream;
	}

	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}

	public cn.edu.lzu.common.file.bean.PageFileInfo fileInfo;

	public cn.edu.lzu.common.file.bean.PageFileInfo getFileInfo() {
		return fileInfo;
	}

	public void setFileInfo(PageFileInfo fileInfo) {
		this.fileInfo = fileInfo;
	}


	String language = "";
	

	private String contentType;
	
	
	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	private void init() throws Exception {
		request = (HttpServletRequest) ActionContext.getContext().get(
				ServletActionContext.HTTP_REQUEST);
		// response = (HttpServletResponse) ActionContext.getContext().get(
		// ServletActionContext.HTTP_RESPONSE);
		response = (HttpServletResponse) ActionContext.getContext().get(
				ServletActionContext.HTTP_RESPONSE);
	
		

	}

	/**
	 * show the content of file
	 * 
	 * @return SUCCESS/ERROR
	 */

	private String exception;

	private Log log = LogFactory.getLog("sccportal.global");

	public String showFile() {

		
		fileInfo = new PageFileInfo();

		// String userName = "";
		// String protocol=request.getParameter("fileTransferProtocol");

		try {
			init();
		
			// userName = entUser.getEUser().getEntUserName();
			// System.out.println(userName);



			String fileName = request.getParameter("filename");
			String filePath = request.getParameter("filepath");
			String remoteFilePath = physicalBaseDir+filePath + "/" + fileName;
		

			inputStream = new java.io.FileInputStream(remoteFilePath);
			return SUCCESS;

		} catch (Exception e) {
			fileInfo.setException(e.getMessage());
			log.error(e.getMessage());
			return ERROR;
		} 

	}
	
	
	public String showImage()
	{
		try {
			init();
		} catch (Exception e) {
			fileInfo.setException(e.getMessage());
			log.error(e.getMessage());
			return ERROR;
		}
		this.setContentType("image/png");
//		response.setContentType("image/png");
		return showFileType();
		
	}
	
	public String showPdf()
	{
		try {
			init();
		} catch (Exception e) {
			fileInfo.setException(e.getMessage());
			log.error(e.getMessage());
			return ERROR;
		}
		this.setContentType("application/pdf");
//		response.setContentType("application/pdf");
		return showFileType();
	}

	public String showFileType() {

		
		fileInfo = new PageFileInfo();

		// String userName = "";
		// String protocol=request.getParameter("fileTransferProtocol");

		try {
			
		
			String fileName = request.getParameter("filename");
			String filePath = request.getParameter("filepath");
			String remoteFilePath = filePath + "/" + fileName;
			
			
			inputStream = new java.io.FileInputStream(remoteFilePath);
	

			return SUCCESS;

		} catch (Exception e) {
			fileInfo.setException(e.getMessage());
			log.error(e.getMessage());
			return ERROR;
		} 
	}

}
