package cn.edu.lzu.db.beans;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

import cn.edu.lzu.db.HibernateUtil;

public class NewsDao {

	public News getNews(String code) {
		try {
			Session sess = HibernateUtil.currentSession();
			java.util.List<News> list = sess.createCriteria(News.class)
					.add(Restrictions.eq("newsCode", code)).list();
			News news;
			if (list.size() == 1) {
				news = list.get(0);
				return news;
			} else {
				return null;
			}

		} finally {
			HibernateUtil.closeSession();
		}

	}

	// public java.util.List<News> getAllSubjectNews(String subjectCode) {
	// try {
	// Session sess = HibernateUtil.currentSession();
	//			
	// String hql =
	// "select distinct a from News a ,SubjectsNewsRelation s where a.newsCode=s.newsCode and s.subjectCode=? order by a.newsPriority desc";
	// Query query = sess.createQuery(hql);
	// query.setString(0, subjectCode);
	// java.util.List<News> list=query.list();
	//			
	// return list;
	//
	// } finally {
	// HibernateUtil.closeSession();
	// }
	//
	// }

	public java.util.List<Object[]> getAllSubjectNewsAttrib(String subjectCode,
			String lanType) {
		try {
			Session sess = HibernateUtil.currentSession();
			Query query = null;
			if (lanType .equals("")) {
				String hql = "select distinct a.newsCode,a.newsTitle,a.newsSource,a.newsPicture,a.newsTag,a.author,a.createDate,a.newsPriority,a.type from News a ,SubjectsNewsRelation s where a.newsCode=s.newsCode and s.subjectCode=? order by a.newsPriority desc ,a.createDate desc";
				query = sess.createQuery(hql);
				query.setString(0, subjectCode);
			} else {
				String hql = "select distinct a.newsCode,a.newsTitle,a.newsSource,a.newsPicture,a.newsTag,a.author,a.createDate,a.newsPriority,a.type from News a ,SubjectsNewsRelation s where a.newsCode=s.newsCode and s.subjectCode=? and a.type=? order by a.newsPriority desc ,a.createDate desc";
				query = sess.createQuery(hql);
				query.setString(0, subjectCode);
				query.setString(1, lanType);
			}

			java.util.List<Object[]> list = query.list();

			return list;

		} finally {
			HibernateUtil.closeSession();
		}

	}

	public void updateNews(News news) throws Exception {
		if (news == null) {
			throw new Exception("Register subject is null");
		}
		try {
			Session sess = HibernateUtil.currentSession();
			Transaction t = sess.beginTransaction();
			sess.update(news);
			t.commit();
		} finally {
			HibernateUtil.closeSession();
		}

	}

	public void addNews(News news, String subjectCode) throws Exception {
		if (news == null) {
			throw new Exception("Register subject is null");
		}
		try {
			Session sess = HibernateUtil.currentSession();
			Transaction t = sess.beginTransaction();
			sess.save(news);
			SubjectsNewsRelation snr = new SubjectsNewsRelation();
			snr.setNewsCode(news.getNewsCode());
			snr.setSubjectCode(subjectCode);
			sess.save(snr);
			t.commit();
		} finally {
			HibernateUtil.closeSession();
		}
	}

	public void delNews(String newsid) throws Exception {

		if (newsid == null) {
			throw new Exception("newsid is null");
		}

		try {
			Session sess = HibernateUtil.currentSession();
			Transaction t = sess.beginTransaction();

			String hql = "delete News a where a.newsCode=?";
			Query query = sess.createQuery(hql);
			query.setString(0, newsid);
			query.executeUpdate();

			// java.util.List<UserRegister> list = sess.createCriteria(
			// UserRegister.class).add(
			// Restrictions.eq("localUser", user.getLocalUser())).list();
			// for(UserRegister u:list)
			// {
			// sess.delete(u);
			// }

			t.commit();
		} finally {
			HibernateUtil.closeSession();
		}

	}

}
