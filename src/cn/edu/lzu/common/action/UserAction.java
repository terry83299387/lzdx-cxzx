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

import cn.edu.lzu.db.beans.User;
import cn.edu.lzu.db.beans.UserDao;

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

	private String exception;

	private String info;

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

	public String newUser() {
		init();

		String userName = request.getParameter("userName");
		String password = request.getParameter("password");
		String realName = request.getParameter("realName");
		String role = request.getParameter("role");
		String email = request.getParameter("email");

		try {
			User user = new User();
			user.setUserName(userName);
			user.setPassword(password);
			user.setRealName(realName);
			user.setRole("1".equals(role) ? 1 : 0);
			user.setEmail(email);
			user.setStatus(1);
			user.setCreateDate(new Date());

			UserDao userDao = new UserDao();
			User userAdded = userDao.addUser(user);
			if (userAdded == null) {
				exception = "add user failed";
				log.error(exception);
				return ERROR;
			}

			StringBuilder logStr = new StringBuilder();
			logStr.append("add new user [userCode=").append(userAdded.getUserCode())
				.append(", userName=").append(userName)
				.append(", password=").append(maskPassword(password))
				.append(", realName=").append(realName)
				.append(", role=").append(role)
				.append(", email=").append(email)
				.append("]");
			log.debug(logStr.toString());

			return SUCCESS;
		} catch (Exception e) {
			log.error(e.getMessage());
			exception = e.getMessage();
			return ERROR;
		}
	}

	private String maskPassword(String password) {
		int len = password.length();
		int start = 3;
		int end = len - 3;
		if (len < 6) {
			start = 1;
			end = len - 1;
		} else if (len < 8) {
			start = 2;
			end = len - 2;
		}
		StringBuilder pwdSb = new StringBuilder(password);
		for (int i=start; i<end; i++)
			pwdSb.setCharAt(i, '*');

		return pwdSb.toString();
	}

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
}
