package cn.edu.lzu.common.file.action;


import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

import cn.edu.lzu.config.BasicPropertiesWork;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

public class UploadFile extends ActionSupport {
	

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private HttpServletRequest request;

	private HttpServletResponse response;
	private final String physicalBaseDir = BasicPropertiesWork.getWebappsSitePath();
	
	private java.io.File file;
	private String fileFileName;
	private String fileContentType; 
	private long fileSize;
	private long fileLastModified;
	
	
	public long getFileSize() {
		return fileSize;
	}
	public void setFileSize(long fileSize) {
		this.fileSize = fileSize;
	}
	public long getFileLastModified() {
		return fileLastModified;
	}
	public void setFileLastModified(long fileLastModified) {
		this.fileLastModified = fileLastModified;
	}
	public java.io.File getFile() {
		return file;
	}
	public void setFile(java.io.File file) {
		this.file = file;
	}
	public String getFileFileName() {
		return fileFileName;
	}
	public void setFileFileName(String fileFileName) {
		this.fileFileName = fileFileName;
	}
	public String getFileContentType() {
		return fileContentType;
	}
	public void setFileContentType(String fileContentType) {
		this.fileContentType = fileContentType;
	}


	private boolean success;
	private String message;
	public boolean isSuccess() {
		return success;
	}
	public void setSuccess(boolean success) {
		this.success = success;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	  private static void copy(java.io.File src, java.io.File dst) throws IOException { 
	        java.io.InputStream in = null; 
	        java.io.OutputStream out = null; 
	        try { 
	            in = new java.io.BufferedInputStream(new java.io.FileInputStream(src), 2048); 
	            out = new java.io.BufferedOutputStream(new java.io.FileOutputStream(dst),2048); 
	            byte[] buffer = new byte[2048]; 
	            int len = 0; 
	            while ((len = in.read(buffer)) > 0) { 
	                out.write(buffer, 0, len); 

	            } 
	        }  finally { 
	            if (null != in) { 
	                try { 
	                    in.close(); 
	                } catch (java.io.IOException e) { 
	                    e.printStackTrace(); 
	                } 
	            } 
	            if (null != out) { 
	                try { 
	                    out.close(); 
	                } catch (java.io.IOException e) { 
	                    e.printStackTrace(); 
	                } 
	            } 
	        } 
	    } 
	public String uploadFile()
	{
		request = (HttpServletRequest) ActionContext.getContext().get(
				ServletActionContext.HTTP_REQUEST);
		response = (HttpServletResponse) ActionContext.getContext().get(
				ServletActionContext.HTTP_RESPONSE);
		
		String filePath=request.getParameter("filepath");
		
		String destPath=physicalBaseDir+filePath+"/"+fileFileName;
		java.io.File destFile=new java.io.File(destPath);
		try {
			copy(this.file,destFile) ;
			fileLastModified=destFile.lastModified();
			fileSize=file.length();
		} catch (IOException e) {
			
			success=false;
			this.message=e.getMessage();
			return ERROR;
		}
		
		
		success=true;
		this.message="Upload ok! size:"+file.length()+"." +filePath+"/"+this.fileFileName;
		return SUCCESS;
	}
	
}
