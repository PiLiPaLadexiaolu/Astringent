package vip.pilipala.interceptor;

import java.util.HashMap;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.DigestUtils;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import vip.pilipala.dao.UserMapper;
import vip.pilipala.model.User;

public class CookieInterceptor extends HandlerInterceptorAdapter{
	
	@Autowired
	private UserMapper userMapper;
	
	private Logger logger = LoggerFactory.getLogger(this.getClass());
	/**
	 * Cookie拦截
	 */
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		
		Cookie[] cookies = request.getCookies();
		
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		if(user!=null) {
			return true;
		}
		if(cookies==null) {
			return true;
		}
		
		String loginName="";
		String loginPasswordMd5="";
		
		for (Cookie cookie : cookies) {
			
			if(cookie.getName().equals("Cookie_Name")) {
				loginName=cookie.getValue();
			}
			
			if(cookie.getName().equals("Cookie_Pawd")) {
				loginPasswordMd5=cookie.getValue();
			}
		}
		
		HashMap<String, String> map =new HashMap<String, String>();
		map.put("USER_EMAIL",loginName);
		
		user=userMapper.findUserByIdEmail(map);
		
		if(user==null) {
			return true;
		}
		
		if(user.getUserEmail().equals(loginName)&&loginPasswordMd5.equals(DigestUtils.md5DigestAsHex(user.getUserPassword().getBytes())))
		{
			httpSession.setAttribute("UserInfo", user);
			logger.info("Cookie Login Cookie_Name:"+loginName+" Cookie_Pawd:"+loginPasswordMd5);
		}
		
		return true;
	}
}
