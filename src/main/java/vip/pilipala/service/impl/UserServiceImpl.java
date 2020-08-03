package vip.pilipala.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import vip.pilipala.dao.UserMapper;
import vip.pilipala.model.User;
import vip.pilipala.service.UserService;

@Service
public class UserServiceImpl implements UserService{
	
	@Autowired
	private JavaMailSender javaMailSender;
	
	@Autowired
	private UserMapper userMapper;

	private Logger logger = LoggerFactory.getLogger(this.getClass());
	
	//发送邮件标题常量
	private static String MAIL_THEME = "Hello and welcome to register";
	//发送邮件内容常量
	private static String MAIL_CONTENT = "Your email verification code is ";
	
	/**
	 * 生成邮箱验证码业务
	 */
	@Override
	public void emailCode(HttpServletRequest request) throws MessagingException {
		
		String recipient=request.getParameter("Email");
		
		//随机生成四位数字
		int rander = (int)((Math.random()*9+1)*1000);
		
		MimeMessage mimeMessage = javaMailSender.createMimeMessage();
		
		MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
		//发送者
		helper.setFrom("2232310877@qq.com");
		//收件人邮箱
		helper.setTo(recipient);
		//邮件主题
		helper.setSubject(MAIL_THEME);
		//邮件内容
		helper.setText("<html><body><p style=\"color:#4D555D; font-size:30px;\">"+MAIL_CONTENT+"<b>"+rander+"</b></p></body></html>",true);
		//发送邮件
		javaMailSender.send(mimeMessage);
		HttpSession httpSession=request.getSession();
		//将邮箱和邮箱验证码存入Session中
		httpSession.setAttribute("VerifyUserEmail", recipient);
		httpSession.setAttribute("VerifyEmailCode", rander);
		httpSession.setAttribute("VerifyEmailCodeTime", System.currentTimeMillis());
		logger.info("UserServiceImpl mailCode() Email Send SUCCESS");
	}
	
	/**
	 * 用户注册业务
	 */
	@org.springframework.transaction.annotation.Transactional(readOnly = false)
	@Override
	public void registerUser(HttpServletRequest request) {
		//获取请求参数
		String username=request.getParameter("UserName");
		String password=request.getParameter("Password");
		String emailCode=request.getParameter("EmailCode");
		//判断请求参数是否为空
		if(username.equals("")||username==null) {
			throw new RuntimeException("UserName is empty");
		}
		
		if(password.equals("")||password==null) {
			throw new RuntimeException("Password is empty");
		}
		
		if(emailCode.equals("")||emailCode==null) {
			throw new RuntimeException("EmailCode is empty");
		}
		//获取邮箱验证码参数
		HttpSession httpSession=request.getSession();
		String saveEmailCode=httpSession.getAttribute("VerifyEmailCode").toString();
		String saveUserEmail=httpSession.getAttribute("VerifyUserEmail").toString();
		long saveEmailCodeTime=(long)httpSession.getAttribute("VerifyEmailCodeTime");
		//查看邮箱验证码是否为空
		if(saveEmailCode.equals("")||saveEmailCode==null) {
			throw new RuntimeException("SaveEmailCode is empty");
		}
		if(saveUserEmail.equals("")||saveUserEmail==null) {
			throw new RuntimeException("SaveUserEmail is empty");
		}
		//判断用户输入邮箱验证码是否和Session存储的邮箱验证码相同
		if(System.currentTimeMillis()-saveEmailCodeTime > 1000 * 120) {
			logger.error("Captcha timeout Exception");
			throw new RuntimeException("Captcha timeout");
		}
		if(saveEmailCode.equals(emailCode)&&saveUserEmail.equals(username)) {
			logger.info("Email and EmailCode Equal");
			try {
				//在数据库中插入数据
				int insert = userMapper.insertUser(new User(null, username, password, username, 1, null));
				if (insert <= 0) {
					//注册失败
					logger.error("UserServiceImpl userRegister() INSERT ERROR");
					throw new RuntimeException("Repeat Register");
				} else {
					//注册成功
					logger.error("UserServiceImpl userRegister() INSERT SUCCESS");
				}
			} catch (Exception e) {
				logger.error("UserServiceImpl userRegister() INSERT ERROR");
				throw e;
			}
			
		}
		else {
			throw new RuntimeException("Verification code exception");
		}

		
	}
	
	/**
	 * 用户登录业务
	 */
	@org.springframework.transaction.annotation.Transactional(readOnly = true)
	@Override
	public void loginUser(HttpServletRequest request,HttpServletResponse response) {
		
		String email=request.getParameter("Email");
		String password=request.getParameter("Password");
		String cookieSwitch=request.getParameter("CookieSwitch");
		
		if(email.equals("")||email==null) {
			throw new RuntimeException("Email is empty");
		}
		if(password.equals("")||password==null) {
			throw new RuntimeException("Password is empty");
		}
		if(cookieSwitch.equals("")||cookieSwitch==null) {
			throw new RuntimeException("CookieSwitch is empty");
		}
		
		HashMap<String, String> map=new HashMap<String, String>();
		
		map.put("UserEmail", email);
		map.put("UserPassword", password);
		
		User user=null;
		
		try {
			user=userMapper.findUser(map);
		} catch (Exception e) {
			logger.error("userMapper.findUser ERROR");
			throw e;
		}
		
		if(user!=null) {
			HttpSession httpSession=request.getSession();
			httpSession.setAttribute("UserInfo", user);
			logger.info("User Login SUCCESS");
			
			//不区分大小写
			if(cookieSwitch.equalsIgnoreCase("true")) {
				//设置Cookie
				logger.info("Cookie is True");
				
				Cookie nameCookie = new Cookie("Cookie_Name" , email);
				
				Cookie pawdCookie = new Cookie("Cookie_Pawd" , DigestUtils.md5DigestAsHex(password.getBytes()));
				// 设置有效时间三天
				nameCookie.setMaxAge(3 * 24 * 60 * 60);
				pawdCookie.setMaxAge(3 * 24 * 60 * 60);
//				nameCookie.setMaxAge(1 * 24 * 60 * 60);
//				pawdCookie.setMaxAge(1 * 24 * 60 * 60);
				// 设置有效页面
				// 将cookie对象存放至response
				response.addCookie(nameCookie);
				response.addCookie(pawdCookie);
				
			}
		}
		else {
			throw new RuntimeException("UserName OR Password ERROR");
		}
	}
	
	@org.springframework.transaction.annotation.Transactional(readOnly = false)
	@Override
	public void resetPassword(HttpServletRequest request) {
		//获取请求参数
		String username=request.getParameter("UserName");
		String password=request.getParameter("Password");
		String emailCode=request.getParameter("EmailCode");
		//判断请求参数是否为空
		if(username.equals("")||username==null) {
			throw new RuntimeException("UserName is empty");
		}
		
		if(password.equals("")||password==null) {
			throw new RuntimeException("Password is empty");
		}
		
		if(emailCode.equals("")||emailCode==null) {
			throw new RuntimeException("EmailCode is empty");
		}
		//获取邮箱验证码参数
		HttpSession httpSession=request.getSession();
		String saveEmailCode=httpSession.getAttribute("VerifyEmailCode").toString();
		String saveUserEmail=httpSession.getAttribute("VerifyUserEmail").toString();
		//查看邮箱验证码是否为空
		if(saveEmailCode.equals("")||saveEmailCode==null) {
			throw new RuntimeException("SaveEmailCode is empty");
		}
		
		if(saveUserEmail.equals("")||saveUserEmail==null) {
			throw new RuntimeException("SaveUserEmail is empty");
		}
		long saveEmailCodeTime=(long)httpSession.getAttribute("VerifyEmailCodeTime");
		//判断验证码是否超时间
		if(System.currentTimeMillis()-saveEmailCodeTime > 1000 * 120) {
			logger.error("Captcha timeout Exception");
			throw new RuntimeException("Captcha timeout");
		}
		//判断用户输入邮箱验证码是否和Session存储的邮箱验证码相同
		if(saveEmailCode.equals(emailCode)&&saveUserEmail.equals(username)) {
			logger.info("Email and EmailCode Equal");
			try {
				HashMap<String, String> map =new HashMap<String, String>();
				//在数据库中修改数据
				map.put("UserEmail",username);
				map.put("UserPassword",password);
				userMapper.updataUserPassword(map);
				
			} catch (Exception e) {
				logger.error("UserServiceImpl userRegister() INSERT ERROR");
				throw e;
			}
			
		}
		else {
			throw new RuntimeException("Verification code exception");
		}
		
	}
	/**
	 * 获取登录用户的信息
	 */
	@Override
	public User getUserInfo(HttpServletRequest request) {
		
		HttpSession session = request.getSession();
		User user=(User) session.getAttribute("UserInfo");
		//未登录抛出异常
		if(user==null) {
			throw new RuntimeException("User is not logged in");
		}
		
		HashMap<String, String> map =new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		user = userMapper.findUserById(map);
		//数据库中没有该用户信息
		if(user==null) {
			throw new RuntimeException("No such user in database");
		}
		
		session.setAttribute("UserInfo", user);
		
		return user;
	}
	
	@Override
	public void updateUserInfo(HttpServletRequest request) {
		
		HttpSession httpSession=request.getSession();
		User user=(User)httpSession.getAttribute("UserInfo");
		
		if(user==null) {
			throw new RuntimeException("User is not logged in");
		}
		if(!user.getUserID().toString().equals(request.getParameter("UserID"))){
			throw new RuntimeException("User ID is different");
		}
		
		if(request.getParameter("UserName").equals("")||request.getParameter("UserName")==null) {
			throw new RuntimeException("UserName is Null");
		}
		
		HashMap<String, String> map =new HashMap<String, String>();

		map.put("UserID",user.getUserID().toString());
		map.put("UserName",request.getParameter("UserName"));
		map.put("UserDescription",request.getParameter("UserDescription"));
		
		int result=userMapper.updataUserInfo(map);
		if(result<1) {
			throw new RuntimeException("updata UserInfo Error");
		}
		
		
	}
	
	/**
	 * 用户退出
	 */
	@Override
	public void userOut(HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession httpSession = request.getSession();
		//销毁SESSION数据
		httpSession.invalidate();
		
		Cookie nameCookie = new Cookie("Cookie_Name" , null);
		
		Cookie pawdCookie = new Cookie("Cookie_Pawd" , null);
		
		nameCookie.setMaxAge(0);
		pawdCookie.setMaxAge(0);
		// 设置有效页面
		// 将cookie对象存放至response
		response.addCookie(nameCookie);
		response.addCookie(pawdCookie);
	}
	
	@Override
	public Map findUserHomePage(String userID) {
		
		HashMap<String, String> map =new HashMap<String, String>();
		
		map.put("UserID",userID);
		return userMapper.findUserHomePage(map);
	}
	
	/**
	 * 获取用户等级列表
	 */
	@Override
	public List<Map> getUserLevelList() {
		
		return userMapper.getUserLevelList();
	}
	
	/**
	 * 管理员添加用户
	 */
	@Override
	public void opAddUser(HttpServletRequest request) {
		
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		
		if(user.getUserLevel()!=5) {
			throw new RuntimeException("");
		}
		
		String email = request.getParameter("Email");
		String userName = request.getParameter("UserName");
		String password = request.getParameter("Password");
		String level = request.getParameter("Level");
		
		
		try {
			int result = userMapper.insertUser(new User(null, userName, password, email, Integer.parseInt(level), null));
			if(result<1) {
				throw new RuntimeException();
			}
		} catch (Exception e) {
			throw e;
		}
	}
	
	/**
	 * 管理员遍历用户信息
	 */
	@Override
	public List<Map> opGetUserList(HttpServletRequest request) {
		
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		
		if(user.getUserLevel()!=5) {
			throw new RuntimeException("");
		}
		
		String userName = request.getParameter("UserName");
		String userEmail = request.getParameter("UserEmail");
		String userID = request.getParameter("UserID");
		String userLevel = request.getParameter("UserLeveL");
		String page = request.getParameter("Page");
		HashMap<String, String> map = new HashMap<String, String>();
		
		map.put("UserName", userName);
		map.put("UserEmail", userEmail);
		map.put("UserID", userID);
		map.put("UserLevel", userLevel);
		map.put("Page", page);
		
		return userMapper.getUserList(map);
		
	}
	
	@Override
	public Integer opGetUserCount(HttpServletRequest request) {
		
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		
		if(user.getUserLevel()!=5) {
			throw new RuntimeException("");
		}
		
		String userName = request.getParameter("UserName");
		String userEmail = request.getParameter("UserEmail");
		String userID = request.getParameter("UserID");
		String userLevel = request.getParameter("UserLeveL");
		HashMap<String, String> map = new HashMap<String, String>();
		
		map.put("UserName", userName);
		map.put("UserEmail", userEmail);
		map.put("UserID", userID);
		map.put("UserLevel", userLevel);
		
		return userMapper.getUserCount(map);
	}
	
	@Override
	public void opDeleteUser(HttpServletRequest request) {
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		
		if(user.getUserLevel()!=5) {
			throw new RuntimeException("");
		}
		
		String userID = request.getParameter("UserID");
		HashMap<String, String> map = new HashMap<String, String>();
		
		map.put("UserID", userID);
		
		try {
			int result = userMapper.deleteUser(map);
			if(result<1) {
				throw new RuntimeException();
			}
		} catch (Exception e) {
			throw e;
		} 
	}
	
	
	
}
