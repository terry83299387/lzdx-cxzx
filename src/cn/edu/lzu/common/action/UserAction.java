/**
 * 
 */
package cn.edu.lzu.common.action;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionContext;

/**
 * @author jieliu
 * 
 */
public class UserAction extends BaseAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1914575436668745575L;
	private static Log log = LogFactory.getLog("sccportal.global");

	/**
	 * 
	 */
	public UserAction() {
	}

	private String exception;

	private String info;

	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	public String getException() {
		return exception;
	}

	public void setException(String exception) {
		this.exception = exception;
	}

	public String login() {

		init();

		String userName = this.getRequest().getParameter("userName");
		String passwd = this.getRequest().getParameter("password");

		if (userName == null || userName.trim().length() == 0) {
			this.exception = "用户名为空";
			this.getRequest().getSession().setAttribute("exception",
					this.exception);
			return ERROR;
		}
		if (passwd == null || passwd.trim().length() == 0) {
			this.exception = "密码为空";
			this.getRequest().getSession().setAttribute("exception",
					this.exception);
			return ERROR;
		}

		try {

			request.getSession().setAttribute(SessionConstants.USER, userName);

			return SUCCESS;
		} catch (Exception e) {
			log.error(e.getMessage());
			this.exception = e.getMessage();

			this.getRequest().getSession().setAttribute("exception",
					this.exception);
			return INPUT;
		}

	}

	public String logout() {
		init();

		try {

			HttpSessionEvent sessionEvent = new HttpSessionEvent(request
					.getSession());

			/**
			 * modified by yyliu on 2011.4.1
			 * */
			if (getSession().getAttribute(SessionConstants.USER) == null) {
				// System.out.println("has been logout");
				return ERROR;

			}

			getSession().setAttribute(SessionConstants.USER, null);
			getSession().setAttribute("exception", "");
			getSession().removeAttribute(SessionConstants.USER);

			return INPUT;
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			getSession().setAttribute("exception", "");
			return ERROR;
		}
	}

}
