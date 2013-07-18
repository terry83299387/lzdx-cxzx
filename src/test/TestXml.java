package test;


import junit.framework.TestCase;

import org.junit.After;
import org.junit.Before;

import cn.edu.lzu.config.XmlParse;

public class TestXml extends TestCase{

	
	XmlParse xp;
	
	@Before
	public void setUp() throws Exception {
		
		xp=new XmlParse("config.xml");
	}

	@After
	public void tearDown() throws Exception {
	}

	public void testGetId() throws Exception
	{
		xp.getChildrenAttributeList("id", "xinwendongtai");
		xp.getChildrenAttributeList("id", "guojiyanjiudongtai");
		
		
	}
	
}
