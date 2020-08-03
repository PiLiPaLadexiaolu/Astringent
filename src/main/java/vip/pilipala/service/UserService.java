package vip.pilipala.service;

import java.util.List;
import java.util.Map;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import vip.pilipala.model.User;

public interface UserService {
	
	//此接口得到一个4位随机数字存入Session中
	public void emailCode(HttpServletRequest request) throws MessagingException;
	
	public void registerUser(HttpServletRequest request);
	
	public void loginUser(HttpServletRequest request,HttpServletResponse response);
	
	public void resetPassword(HttpServletRequest request);
	
	public User getUserInfo(HttpServletRequest request);
	
	public void updateUserInfo(HttpServletRequest request);
	
	public void userOut(HttpServletRequest request, HttpServletResponse response);
	
	public Map findUserHomePage(String userID);
	
	public List<Map> getUserLevelList();
	
	public void opAddUser(HttpServletRequest request);
	
	public List<Map> opGetUserList(HttpServletRequest request);
	
	public Integer opGetUserCount(HttpServletRequest request);
	
	public void opDeleteUser(HttpServletRequest request);
	
}
