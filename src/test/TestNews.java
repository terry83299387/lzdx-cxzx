package test;

import org.junit.After;

import cn.edu.lzu.config.XmlParse;
import cn.edu.lzu.db.beans.News;
import cn.edu.lzu.db.beans.NewsDao;
import junit.framework.TestCase;

public class TestNews  extends TestCase{

	public void setUp() throws Exception {
		
	
	}

	
	public void tearDown() throws Exception {
	}

//	public void testAddNews() throws Exception
//	{
//		NewsDao nd=new NewsDao();
//		News news=new News();
//		news.setNewsTitle("test1");
//		java.util.Date date=new java.util.Date(System.currentTimeMillis());
//		
//		news.setCreateDate(date);
//		
//		
//		nd.addNews(news, "shouye");
//		
//		
//	}
	
	public void testListNews() throws Exception
	{
		NewsDao nd=new NewsDao();
		java.util.List<Object[]> list=nd.getAllSubjectNewsAttrib("shouye","1");
		
		for(Object[] n:list)
		{
			System.out.println(n[1]);
		}
		
		
		
	}
	
	
}
