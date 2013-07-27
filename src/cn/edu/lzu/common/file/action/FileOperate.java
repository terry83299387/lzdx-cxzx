package cn.edu.lzu.common.file.action;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts2.ServletActionContext;

import cn.edu.lzu.common.file.bean.PageFileInfo;
import cn.edu.lzu.common.file.util.Fileoperator;
import cn.edu.lzu.config.BasicPropertiesWork;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

public class FileOperate extends ActionSupport {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Log log = LogFactory.getLog(FileOperate.class);

	private final String physicalBaseDir = BasicPropertiesWork
			.getWebappsSitePath();

	private final String home = BasicPropertiesWork.getFileHome();

	private HttpServletRequest request;

	private HttpServletResponse response;
	private String scope = null;
	private PageFileInfo fileInfo = new PageFileInfo();
	private int pageStart = -1;

	private List<PageFileInfo> fileItems = new ArrayList<PageFileInfo>();;

	public List<PageFileInfo> getFileItems() {
		return fileItems;
	}

	public void setFileItems(List<PageFileInfo> fileItems) {
		this.fileItems = fileItems;
	}

	public PageFileInfo getFileInfo() {
		return fileInfo;
	}

	public void setFileInfo(PageFileInfo fileInfo) {
		this.fileInfo = fileInfo;
	}

	public void setPageStart(int pageStart) {
		this.pageStart = pageStart;

	}

	public int getPageStart() {
		return pageStart;

	}

	private void init() throws Exception {
		request = (HttpServletRequest) ActionContext.getContext().get(
				ServletActionContext.HTTP_REQUEST);
		response = (HttpServletResponse) ActionContext.getContext().get(
				ServletActionContext.HTTP_RESPONSE);

		java.io.File file = new java.io.File(physicalBaseDir + home);

		boolean suc;
		if (!file.exists()) {
			if (!(suc = file.mkdirs()))
				throw new Exception("no " + file.getAbsolutePath());

		}

	}
	
	
	public String paste()
	{
		try {
			init();
			String srcFilePath = request.getParameter("srcfilepath");
			String destFilePath = request.getParameter("destfilepath");
			String flag = request.getParameter("pasteflag");
			String[] fileNameArray=request.getParameter("filenamelist").split(",");
			String[] destFileNameArray=request.getParameter("tonewfilenamelist").split(",");
			
			boolean suc=true;
			
			for(int i=0;i<fileNameArray.length;i++)
			{
				java.io.File srcFile=new java.io.File(physicalBaseDir+srcFilePath+"/"+fileNameArray[i]);
				java.io.File destFile=new java.io.File(physicalBaseDir+destFilePath+"/"+destFileNameArray[i]);
				
				Fileoperator fo=new Fileoperator();
				if(!fo.copyFiles(physicalBaseDir+srcFilePath, physicalBaseDir+destFilePath, srcFile, destFile))
				{
					suc=false;
				}
			}
			
			if(suc)
			{
				
				return SUCCESS;
			}
			else
			{
				return ERROR;
			}
			
		}catch (Exception e) {

			fileInfo.setException(e.getMessage());
			return ERROR;
		}
		
		
	}
	
	public String delFile() {
		try {
			init();
			String error="";
			String filePath = request.getParameter("filepath");
			String[] fileNameArray=request.getParameter("filenamelist").split(",");
			boolean suc=true;
			Fileoperator fo=new Fileoperator();
			for(String fileName:fileNameArray)
			{
				String path=physicalBaseDir+filePath+"/"+fileName;
				java.io.File file=new java.io.File(path);
				
				if(!fo.delFiles(file))
				{
					error+=file.getName()+",";
					suc=false;
				}
			}

			if (suc) {
				return SUCCESS;
			} else {
				fileInfo.setException("delete file error.");
				return ERROR;
			}

		}

		catch (Exception e) {

			fileInfo.setException(e.getMessage());
			return ERROR;
		}
	}

	
	public String renameFile() {
		try {
			init();
			String filePath = request.getParameter("filepath");
			String oldFileName = request.getParameter("oldfilename");
			String newFileName = request.getParameter("newfilename");
			String absoluteOldFilePath = physicalBaseDir + filePath + "/"
					+ oldFileName;
			String absoluteNewFilePath = physicalBaseDir + filePath + "/"
					+ newFileName;

			java.io.File oldFile = new java.io.File(absoluteOldFilePath);
			java.io.File newFile = new java.io.File(absoluteNewFilePath);

			if (oldFile.renameTo(newFile)) {
				return SUCCESS;
			} else {
				fileInfo.setException("create file error.");
				return ERROR;
			}

		}

		catch (Exception e) {

			fileInfo.setException(e.getMessage());
			return ERROR;
		}
	}

	public String newFolder() {
		try {
			init();
			String fileName = request.getParameter("filename");
			String absoluteFilePath = physicalBaseDir + fileName;

			java.io.File file = new java.io.File(absoluteFilePath);
			if (file.mkdirs()) {
				return SUCCESS;
			} else {
				fileInfo.setException("create file error.");
				return ERROR;
			}

		}

		catch (Exception e) {

			fileInfo.setException(e.getMessage());
			return ERROR;
		}
	}

	public String newFile() {
		try {
			init();
			String fileName = request.getParameter("filename");
			String absoluteFilePath = physicalBaseDir + fileName;

			java.io.File file = new java.io.File(absoluteFilePath);
			if (file.createNewFile()) {
				return SUCCESS;
			} else {
				fileInfo.setException("create file error.");
				return ERROR;
			}

		}

		catch (Exception e) {

			fileInfo.setException(e.getMessage());
			return ERROR;
		}
	}

	public String showFileList() {
		try {
			init();
			String startStr = request.getParameter("start");
			String pagescope = request.getParameter("scope");
			// HostUserDao hostUserDao = new HostUserDao();
			if (pagescope != null && scope == null)
				scope = pagescope;

			int start = 0;
			if (startStr != null) {
				try {
					start = Integer.parseInt(startStr);
				} catch (NumberFormatException e) {
					log.error(e.getMessage());
				}
				if (scope == null || !scope.equals("all"))
					this.pageStart = start;
			}

			String limitStr = request.getParameter("limit");
			int limit = 50;
			if (limitStr != null) {
				try {
					limit = Integer.parseInt(limitStr);
				} catch (NumberFormatException e) {
					log.error(e.getMessage());
				}
			}

			String filePath = request.getParameter("filepath");

			if (filePath == null || filePath.equals("")) {

				filePath = home;

			}

			String absolutePath = physicalBaseDir + filePath;

			if (filePath.indexOf(home) != 0) {
				throw new Exception("Access denied");
			}

			java.io.File folder = new java.io.File(absolutePath);
			for (java.io.File file : folder.listFiles()) {
				PageFileInfo pageFileInfo = new PageFileInfo();

				java.text.DateFormat formatDate = new java.text.SimpleDateFormat(
						"yyyy-MM-dd HH:mm:ss");
				String lastModified = formatDate.format(file.lastModified());
				pageFileInfo.setLastModified(lastModified);
				pageFileInfo.setSize(file.length());
				pageFileInfo.setName(file.getName());
				pageFileInfo.setType(file.isDirectory() ? 1 : 0);
				String parentPath = file.getParentFile().getParent();
				if (!home.equals(filePath)) {
					pageFileInfo.setParentPath(parentPath.replace("\\+", "/")
							.replace("\\/+", "/").substring(
									physicalBaseDir.length()));
				} else {
					pageFileInfo.setParentPath(filePath);
				}
				pageFileInfo.setCurrentPath(filePath + "/" + file.getName());
				pageFileInfo.setPermission(file.isDirectory() ? "drwxrwxrwx"
						: "-rwxrwxrwx");
				fileItems.add(pageFileInfo);

			}
			fileInfo.setCurrentPath(filePath);
			return SUCCESS;
		}

		catch (Exception e) {

			fileInfo.setException(e.getMessage());
			return ERROR;
		}
	}

}
