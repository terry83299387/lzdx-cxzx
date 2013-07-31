package cn.edu.lzu.db.beans;

import java.io.Serializable;

import org.hibernate.Session;
import org.hibernate.Transaction;

import cn.edu.lzu.db.HibernateUtil;

public class UserDao {

	public User addUser(User user) throws Exception {
		if (user == null) {
			throw new Exception("Register user is null");
		}

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

//	public News getNews(String code) {
//		try {
//			Session sess = HibernateUtil.currentSession();
//			java.util.List<News> list = sess.createCriteria(News.class)
//					.add(Restrictions.eq("newsCode", code)).list();
//			News news;
//			if (list.size() == 1) {
//				news = list.get(0);
//				return news;
//			} else {
//				return null;
//			}
//		} finally {
//			HibernateUtil.closeSession();
//		}
//	}
//
//	public void updateNews(News news) throws Exception {
//		if (news == null) {
//			throw new Exception("Register subject is null");
//		}
//		try {
//			Session sess = HibernateUtil.currentSession();
//			Transaction t = sess.beginTransaction();
//			sess.update(news);
//			t.commit();
//		} finally {
//			HibernateUtil.closeSession();
//		}
//	}
//
//	public void delNews(String newsid) throws Exception {
//		if (newsid == null) {
//			throw new Exception("newsid is null");
//		}
//
//		try {
//			Session sess = HibernateUtil.currentSession();
//			Transaction t = sess.beginTransaction();
//
//			String hql = "delete News a where a.newsCode=?";
//			Query query = sess.createQuery(hql);
//			query.setString(0, newsid);
//			query.executeUpdate();
//
//			t.commit();
//		} finally {
//			HibernateUtil.closeSession();
//		}
//	}
}
