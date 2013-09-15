package cn.edu.lzu.db.beans;

import java.util.List;
import java.util.Set;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

import cn.edu.lzu.config.HtmlScript;
import cn.edu.lzu.db.HibernateUtil;

public class NewsDao {

	public News getNews(String code) {
		try {
			Session sess = HibernateUtil.currentSession();
			java.util.List<News> list = sess.createCriteria(News.class).add(
					Restrictions.eq("newsCode", code)).list();
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

	public java.util.List<Object[]> getAllSubSubjectNews(
			java.util.Set<String> subjectCode, String lanType, int start,
			int limit) {
		try {
			Session sess = HibernateUtil.currentSession();
			String subjectcode = null;
			for (String code : subjectCode) {
				if (subjectcode == null) {
					subjectcode = "'" + code + "'";
				} else {
					subjectcode += ",'" + code + "'";
				}
			}
			Query query = null;
			if (lanType.equals("")) {
				String hql = "select distinct a.newsCode,a.newsTitle,a.newsSource,a.newsPicture,a.newsTag,a.author,a.createDate,a.newsPriority,a.type from News a ,SubjectsNewsRelation s where a.newsCode=s.newsCode and s.subjectCode in ("
						+ subjectcode
						+ ") order by a.newsPriority desc ,a.createDate desc";
				query = sess.createQuery(hql).setFirstResult(start)
						.setMaxResults(limit);

			} else {
				String hql = "select distinct a.newsCode,a.newsTitle,a.newsSource,a.newsPicture,a.newsTag,a.author,a.createDate,a.newsPriority,a.type from News a ,SubjectsNewsRelation s where a.newsCode=s.newsCode and s.subjectCode in  ("
						+ subjectcode
						+ ") and a.type=? order by a.newsPriority desc ,a.createDate desc";
				query = sess.createQuery(hql).setFirstResult(start)
						.setMaxResults(limit);
				;

				query.setString(0, lanType);
			}

			java.util.List<Object[]> list = query.list();

			return list;

		} finally {
			HibernateUtil.closeSession();
		}
	}

	public java.util.List<Object[]> getAllSubjectNewsAttrib(String subjectCode,
			String lanType) {
		try {
			Session sess = HibernateUtil.currentSession();
			Query query = null;
			if (lanType.equals("")) {
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
			if(news.getNewsContent()!=null)
			{
				news.setNewsContentNotHtml(HtmlScript.delHTMLTag(news.getNewsContent()));
			}
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
			if(news.getNewsContent()!=null)
			{
				news.setNewsContentNotHtml(HtmlScript.delHTMLTag(news.getNewsContent()));
			}
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

	public void delNewsGroup(String[] newsGroup) throws Exception {
		if (newsGroup == null) {
			throw new Exception("newsid is null");
		}

		String newsCodes = "";
		for (int i = 0; i < newsGroup.length; i++) {
			if (i == 0) {
				newsCodes = "'" + newsGroup[i] + "'";

			} else {
				newsCodes = newsCodes + ",'" + newsGroup[i] + "'";
			}

		}

		try {
			Session sess = HibernateUtil.currentSession();
			Transaction t = sess.beginTransaction();

			String hql = "delete News a where a.newsCode in (" + newsCodes
					+ ")";
			Query query = sess.createQuery(hql);
			// query.setString(0, newsCodes);
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

	public long getNewsCount(String nodeId, String lanType) throws Exception {
		try {
			Session sess = HibernateUtil.currentSession();
			String hql = "select count(n.newsCode) from News n, SubjectsNewsRelation s "
				+ "where n.newsCode=s.newsCode and s.subjectCode=? and n.type=?";
			Query query = sess.createQuery(hql);
			query.setString(0, nodeId);
			query.setString(1, lanType);

			List<Long> result = query.list();
			if (result == null || result.size() == 0) {
				return 0;
			}
			return result.get(0);
		} finally {
			HibernateUtil.closeSession();
		}
	}

	public List<Object[]> searchNews(Set<String> range, String keyword,
			String lanType, int start, int limit) throws Exception {
		if (keyword == null || keyword.length() == 0) {
			throw new Exception("keyword can not be null.");
		}
		try {
			Session sess = HibernateUtil.currentSession();

			String subjects = null;
			for (String subject : range) {
				if (subjects == null) {
					subjects = "'" + subject + "'";
				} else {
					subjects += ",'" + subject + "'";
				}
			}

			Query query = null;
			StringBuilder hql = new StringBuilder();
			hql.append("select distinct a.newsCode,a.newsTitle,a.newsSource,a.author,a.createDate,a.newsContent ")
				.append("from News a ,SubjectsNewsRelation s where a.newsCode=s.newsCode ");
			if (lanType != null && lanType.length() != 0) {
				hql.append("and a.type='").append(lanType).append("' ");
			}
			hql.append(" and s.subjectCode in (")
				.append(subjects)
				.append(") and (a.newsTitle like '%")
				.append(keyword)
				.append("%' or a.newsContent like '%")
				.append(keyword)
				.append("%') order by a.newsPriority desc ,a.createDate desc");

			query = sess.createQuery(hql.toString()).setFirstResult(start)
					.setMaxResults(limit);

			java.util.List<Object[]> list = query.list();

			return list;
		} finally {
			HibernateUtil.closeSession();
		}
	}

}
