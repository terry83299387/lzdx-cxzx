package cn.edu.lzu.db;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateUtil {

	private static final SessionFactory sessionFactory;
	private static final ThreadLocal<Session> m_session = new ThreadLocal<Session>();

	static {
		try {
			sessionFactory = new Configuration().configure()
					.buildSessionFactory();
		} catch (HibernateException ex) {
			ex.printStackTrace();
			throw new RuntimeException(
					"create SessionFactory error: " + ex.getMessage(), ex);
		}
	}

	public static Session currentSession() throws HibernateException {
		Session s = (Session) m_session.get();
		if (s == null) {
			s = sessionFactory.openSession();
			m_session.set(s);
		}
		return s;
	}

	public static void closeSession() throws HibernateException {
		Session s = (Session) m_session.get();
		m_session.set(null);
		if (s != null)
			s.close();
	}

}
