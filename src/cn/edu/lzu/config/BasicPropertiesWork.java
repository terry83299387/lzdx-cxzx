package cn.edu.lzu.config;

import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class BasicPropertiesWork {
	private static Properties p;
	// please see tomcat root path
	private static String filename = "global.properties";
	private static Log log = LogFactory.getLog(BasicPropertiesWork.class);
	static {
		
		try {
			p = new Properties();
			p.load(new java.io.FileInputStream(new java.io.File(System
					.getProperty("user.dir")).getParent()
					+ "/" + filename));

		} catch (Exception e) {
			log.error(e.getMessage());
			System.exit(1);
		}

	}

	public static String getWebappsSitePath()
	{
		return p.getProperty("webapps_site_path", "unknown").trim();
		
	}

	public static String getFileHome()
	{
		return p.getProperty("file_home", "unknown").trim();
		
		
	}
	
	public static String getConfigPath()
	{
		return p.getProperty("config_path", "unknown").trim();
		
	}
}
