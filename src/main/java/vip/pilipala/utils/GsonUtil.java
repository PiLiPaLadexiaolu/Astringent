package vip.pilipala.utils;

import com.google.gson.Gson;

public class GsonUtil {
	
	//懒汉单例 不安全版本
	private static Gson gson;
	public static Gson getGson() {
		if(gson==null) {
			gson=new Gson();
			return gson;
		}
		else
			return gson;
	}
}
