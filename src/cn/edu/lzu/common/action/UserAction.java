/**
 * 
 */
package cn.edu.lzu.common.action;

import java.util.Date;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import cn.edu.lzu.db.beans.User;
import cn.edu.lzu.db.beans.UserDao;

/**
 * @author QiaoMingkui
 */
public class UserAction extends BaseAction {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1914575436668745575L;
	private static Log log = LogFactory.getLog("sccportal.global");

	private String exception;

	private String info;

	private List<User> users;

	public String login() {
		init();

		String userName = request.getParameter("userName");
		String passwd = request.getParameter("password");
		String inputRand = request.getParameter("rand");

		try {
			// check parameters
			if (userName == null || userName.trim().length() == 0) {
				throw new Exception("用户名为空");
			}
			if (passwd == null || passwd.trim().length() == 0) {
				throw new Exception("密码为空");
			}

			// check random
			Object rand = request.getSession().getAttribute("rand");

			if (rand != null && inputRand != null) {
				String randStr = rand.toString();
				if (!inputRand.equals(randStr)) {
					throw new Exception("验证码错误!");
				}
			} else {
				throw new Exception("验证码不能为空!");
			}

			// check user name and password
			UserDao userDao = new UserDao();
			List<User> users = userDao.getUserByName(userName);

			if (users == null || users.size() == 0) {
				throw new Exception("用户名或密码错误");
			}
			if (users.size() > 1) {
				throw new Exception("错误的用户名或密码");
			}

			User user = users.get(0);
			if (!passwd.equals(user.getPassword())) {
				throw new Exception("用户名或密码错误!");
			}

			if (user.getRole() != User.SUPER_ADMIN
					&& user.getRole() != User.ADMIN) {
				throw new Exception("该用户不是管理员，请更换用户重新登录");
			}

			if (user.getStatus() != User.VALID_STATUS) {
				throw new Exception("该用户目前不可用，请联系管理员");
			}

			// save user info
			request.getSession().setAttribute(SessionConstants.USER, user);

			return SUCCESS;
		} catch (Exception e) {
			log.error(e.getMessage());
			this.exception = e.getMessage();
			request.getSession().setAttribute("exception",
					this.exception);
			return INPUT;
		}
	}

	public String logout() {
		init();

		try {
			if (getSession().getAttribute(SessionConstants.USER) == null) {
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

	public String listUsers() {
		User curUser = (User) getSession().getAttribute(SessionConstants.USER);
		int role = curUser.getRole();
		int types = 0;
		if (role == User.SUPER_ADMIN) {
			types = User.ADMIN | User.COMMON_USER;
		} else if (role == User.ADMIN) {
			types = User.COMMON_USER;
		}

		try {
			UserDao userDao = new UserDao();
			users = userDao.listUsers(types);
		} catch (Exception e) {
			return ERROR;
		}

		return SUCCESS;
	}

	public String newUser() {
		init();

		String userName = request.getParameter("userName");
		String password = request.getParameter("password");
		String realName = request.getParameter("realName");
		String role = request.getParameter("role");
		String email = request.getParameter("email");

		try {
			if (userName == null || userName.trim().length() == 0) {
				throw new Exception("用户名不能为空");
			}

			// check whether user exists
			UserDao userDao = new UserDao();
			List<User> users = userDao.getUserByName(userName);

			if (users != null && users.size() != 0) {
				throw new Exception("该用户已存在!");
			}

			// add new user
			User user = new User();
			user.setUserName(userName);
			user.setPassword(password);
			user.setRealName(realName);
			user.setRole("1".equals(role) ? 1 : 2);
			user.setEmail(email);
			user.setStatus(1);
			user.setCreateDate(new Date());

			User userAdded = userDao.addUser(user);
			if (userAdded == null) {
				throw new Exception("用户添加失败！");
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

	public String editUser() {
		init();

		String userCode = request.getParameter("userCode");
		String userName = request.getParameter("userName");
		String password = request.getParameter("password");
		String realName = request.getParameter("realName");
		String role = request.getParameter("role");
		String status = request.getParameter("status");
		String email = request.getParameter("email");

		try {
			UserDao userDao = new UserDao();
			User user = userDao.getUser(userCode);

			if (user == null) {
				throw new Exception("无法编辑，用户信息无效");
			}

			boolean anyChange = false;
			StringBuilder logStr = new StringBuilder();
			logStr.append("edit user (userCode=").append(userCode)
				.append(", userName=").append(userName).append(")[");

			if (!user.getPassword().equals(password)) {
				anyChange = true;
				logStr.append("password:")
						.append(maskPassword(user.getPassword()))
						.append("->").append(maskPassword(password));
			}
			if (!user.getRealName().equals(realName)) {
				if (anyChange) logStr.append(", ");
				anyChange = true;
				logStr.append("realName:").append(user.getRealName()).append("->").append(realName);
			}
			if (user.getRole() != ("1".equals(role) ? 1 : 2)) {
				if (anyChange) logStr.append(", ");
				anyChange = true;
				logStr.append("role:").append(user.getRole()).append("->").append(role);
			}
			if (user.getStatus() != ("1".equals(status) ? 1 : 0)) {
				if (anyChange) logStr.append(", ");
				anyChange = true;
				logStr.append("status:").append(user.getStatus()).append("->").append(status);
			}
			if (!user.getEmail().equals(email)) {
				if (anyChange) logStr.append(", ");
				anyChange = true;
				logStr.append("email:").append(user.getEmail()).append("->").append(email);
			}

			if (anyChange) {
				logStr.append("]");

				user.setPassword(password);
				user.setRealName(realName);
				user.setRole("1".equals(role) ? 1 : 2);
				user.setStatus("1".equals(status) ? 1 : 0);
				user.setEmail(email);
				userDao.modifyUser(user);
			} else {
				logStr.append("nothing changed...]");
			}
			log.debug(logStr.toString());

			return SUCCESS;
		} catch (Exception e) {
			log.error(e.getMessage());
			exception = e.getMessage();
			return ERROR;
		}
	}

	public String deleteUser() {
		init();

		String userCode = request.getParameter("userCode");
		if (userCode == null) {
			return SUCCESS;
		}

		try {
			User user = new User();
			user.setUserCode(userCode);
			UserDao userDao = new UserDao();
			userDao.deleteUser(user);

			log.debug("delete user [userCode=" + userCode + "]");

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

	/**
	 * @return the users
	 */
	public List<User> getUsers() {
		return users;
	}

	/**
	 * @param users the users to set
	 */
	public void setUsers(List<User> users) {
		this.users = users;
	}
}
