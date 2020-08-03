package vip.pilipala.dao;

import java.util.List;
import java.util.Map;

import vip.pilipala.model.User;

public interface UserMapper {
	
	public Integer insertUser(User user);
	
	public User findUser(Map map);
	
	public Integer updataUserPassword(Map map);
	
	public User findUserById(Map map);
	
	public User findUserByIdEmail(Map map);
	
	public Integer updataUserInfo(Map map);
	
	public Map findUserHomePage(Map map);
	
	public List<Map> getUserLevelList();
	
	public List<Map> getUserList(Map map);
	
	public Integer getUserCount(Map map);
	
	public Integer deleteUser(Map map);
}
