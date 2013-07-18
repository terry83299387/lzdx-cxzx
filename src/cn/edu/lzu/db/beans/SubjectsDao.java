package cn.edu.lzu.db.beans;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

import cn.edu.lzu.db.HibernateUtil;



public class SubjectsDao {

	public Subjects getSubject(String id) {
		try {
			Session sess = HibernateUtil.currentSession();
			java.util.List<Subjects> list = sess.createCriteria(
					Subjects.class).add(
					Restrictions.eq("subjectCode", id)).list();
			Subjects subject;
			if (list.size() == 1) {
				subject = list.get(0);
				return subject;
			} else {
				return null;
			}

		} finally {
			HibernateUtil.closeSession();
		}

	}

	public java.util.List<Subjects> getChildrenSubjects(String parentId) {
		try {
			Session sess = HibernateUtil.currentSession();
			java.util.List<Subjects> list = sess.createCriteria(
					Subjects.class).add(Restrictions.eq("parentSubjectCode", parentId)).list();
			return list;

		} finally {
			HibernateUtil.closeSession();
		}

	}

	public void addSubjects(Subjects subject) throws Exception {
		if (subject == null) {
			throw new Exception("Register subject is null");
		}
		try {
			Session sess = HibernateUtil.currentSession();
			Transaction t = sess.beginTransaction();
			sess.save(subject);
			t.commit();
		} finally {
			HibernateUtil.closeSession();
		}
	}

	public void delSubject(String subjectCode) throws Exception {

		if (subjectCode == null) {
			throw new Exception("subjectCode is null");
		}
		
		try {
			Session sess = HibernateUtil.currentSession();
			Transaction t = sess.beginTransaction();

			

				String hql = "delete Subjects a where a.subjectCode=?";
				Query query = sess.createQuery(hql);
				query.setString(0, subjectCode);
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
