package vip.pilipala.utils;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PropertiesUtil {

	private static Properties prop = new Properties();
	
	private static Logger logger = LoggerFactory.getLogger(PropertiesUtil.class);
	
	static {
		InputStream in;
		try {
			in = new BufferedInputStream (new FileInputStream(org.springframework.util.ResourceUtils.getFile("classpath:uploadPath.properties")));
			//加载属性列表
			prop.load(in);
		} catch (FileNotFoundException e) {
			logger.error("not found file path exception");
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error("IOException exception");
			e.printStackTrace();
		}
	}
	
	public static String getProperty(String name) {
		return prop.getProperty(name);
	}
}
