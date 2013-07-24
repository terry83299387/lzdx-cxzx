package cn.edu.lzu.common.action;




import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

public class BaseAction extends ActionSupport {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2324487943595840285L;

	public HttpServletRequest request;

	public HttpServletResponse response;
	

	public static boolean isIP(String ip) {
		if (ip == null) {
			return false;
		}
		String regexp = "[\\d]{1,3}(\\.[\\d]{1,3}){3}";
		return ip.matches(regexp);

	}

	public static String List = "list";

	public void init() {
		request = (HttpServletRequest) ActionContext.getContext().get(ServletActionContext.HTTP_REQUEST);
		request.getSession().setAttribute("exception", "");
//		try {
//			request.setCharacterEncoding("UTF-8");
//		} catch (UnsupportedEncodingException e) {
//			e.printStackTrace();
//		
//		}/////////////////////////
		response = (HttpServletResponse) ActionContext.getContext().get(ServletActionContext.HTTP_RESPONSE);
		response.setContentType("application/json;charset=GBK");
		
	}



	public HttpServletRequest getRequest() {
		if (request != null) {
			return request;
		} else {
			init();
			return request;
		}
	}

	public HttpSession getSession() {
		return getRequest().getSession();
	}

	public HttpServletResponse getResponse() {
		if (response != null) {
			return response;
		} else {
			init();
			return response;
		}
	}

	// check
	public static boolean checkIsNull(String str) {
		if (str == null || str.trim().length() == 0) {
			return true;
		}
		return false;
	}
}
