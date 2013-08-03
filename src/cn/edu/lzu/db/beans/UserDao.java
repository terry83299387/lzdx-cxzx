package cn.edu.lzu.db.beans;

import java.io.Serializable;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

import cn.edu.lzu.db.HibernateUtil;

public class UserDao {

	public User addUser(User user) throws HibernateException {
		try {
			Session sess = HibernateUtil.currentSession();
			Transaction t = sess.beginTransaction();
			Serializable id = sess.save(user);
			t.commit();
			User newUser = (User) sess.get(User.class, id);
			return newUser;
		} finally {
			HibernateUtil.closeSession();
		}
	}

	@SuppressWarnings("unchecked")
	public List<User> listUsers(int types) throws HibernateException {
		try {
			Session sess = HibernateUtil.currentSession();
			Transaction t = sess.beginTransaction();

			Criteria criteria = sess.createCriteria(User.class);

			Criterion criterion1 = null, criterion2 = null;
			if ((types & User.ADMIN) != 0) {
				criterion1 = Restrictions.eq("role", User.ADMIN);
			}
			if ((types & User.COMMON_USER) != 0) {
				criterion2 = Restrictions.eq("role", User.COMMON_USER);
				if (criterion1 != null) {
					criterion1 = Restrictions.or(criterion1, criterion2);
				} else {
					criterion1 = criterion2;
				}
			}
			if (criterion1 != null) {
				criteria.add(criterion1);
			}
			List<User> list = criteria.list();
			t.commit();

			return list;
		} finally {
			HibernateUtil.closeSession();
		}
	}

	public User getUser(String userCode) throws HibernateException {
		try {
			Session sess = HibernateUtil.currentSession();
			Transaction t = sess.beginTransaction();

			Criteria criteria = sess.createCriteria(User.class);
			Criterion criterion = Restrictions.idEq(userCode);
			criteria.add(criterion);
			User user = (User) criteria.uniqueResult();
			t.commit();

			return user;
		} finally {
			HibernateUtil.closeSession();
		}
	}

	@SuppressWarnings("unchecked")
	public List<User> getUserByName(String userName) throws HibernateException {
		try {
			Session sess = HibernateUtil.currentSession();
			Transaction t = sess.beginTransaction();

			Criteria criteria = sess.createCriteria(User.class);
			Criterion criterion = Restrictions.eq("userName", userName);
			criteria.add(criterion);
			List<User> users = criteria.list();
			t.commit();

			return users;
		} finally {
			HibernateUtil.closeSession();
		}
	}

	public void modifyUser(User user) throws HibernateException {
		try {
			Session sess = HibernateUtil.currentSession();
			Transaction ts = sess.beginTransaction();

			sess.update(user);

			ts.commit();
		} finally {
			HibernateUtil.closeSession();
		}
	}

	public void deleteUser(User user) throws HibernateException {
		try {
			Session sess = HibernateUtil.currentSession();
			Transaction t = sess.beginTransaction();
			sess.delete(user);
			t.commit();
		} finally {
			HibernateUtil.closeSession();
		}
	}
}
