package vip.pilipala.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vip.pilipala.dao.AttentionMapper;
import vip.pilipala.model.User;
import vip.pilipala.service.AttentionService;

@Service
public class AttentionServiceImpl implements AttentionService{
	
	private Logger logger = LoggerFactory.getLogger(this.getClass());
	@Autowired
	private AttentionMapper attentionmapper;
	@Override
	public void insertAttention(HttpServletRequest request) {
		HttpSession httpSession = request.getSession();
		User user =(User)httpSession.getAttribute("UserInfo");
		if(user==null) {
			throw new RuntimeException("User is not logged in");
		}
		
		Map<String,String> map = new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		//获取被关注人ID
		map.put("UserFollowed", request.getParameter("UserID"));
		try {
			int result=attentionmapper.selectAttention(map);
			
			if(result>0) {
				logger.error("Already follow");
				throw new RuntimeException("Already follow");
			}
			result=attentionmapper.insertAttention(map);
			if(result<1) {
				logger.error("Add attention exception");
				throw new RuntimeException("Add attention exception");
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		
	}
	
	@Override
	public void deleteAttention(HttpServletRequest request) {
		HttpSession httpSession = request.getSession();
		User user =(User)httpSession.getAttribute("UserInfo");
		if(user==null) {
			throw new RuntimeException("User is not logged in");
		}
		
		Map<String,String> map = new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		//获取被关注人ID
		map.put("UserFollowed", request.getParameter("UserID"));
		try {
			
			
			int result=attentionmapper.deleteAttention(map);
			if(result<1) {
				logger.error("Delete attention exception");
				throw new RuntimeException("Delete attention exception");
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	@Override
	public Integer selectAttention(HttpServletRequest request) {
		
		HttpSession httpSession = request.getSession();
		User user =(User)httpSession.getAttribute("UserInfo");
		if(user==null) {
			throw new RuntimeException("User is not logged in");
		}
		
		Map<String,String> map = new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		//获取被关注人ID
		map.put("UserFollowed", request.getParameter("UserID"));
		int result;
		try {
			result=attentionmapper.selectAttention(map);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		
		return result;
	}
	
	@Override
	public List<Map> getFollowMeList(HttpServletRequest request) {
		
		HttpSession httpSession = request.getSession();
		String page=request.getParameter("Page");
		User user =(User)httpSession.getAttribute("UserInfo");
		if(user==null) {
			throw new RuntimeException("User is not logged in");
		}
		
		Map<String,String> map = new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		map.put("Page", page);
		return attentionmapper.getFollowMeList(map);
	}
	
	@Override
	public Integer getFollowMeNumber(HttpServletRequest request) {
		
		HttpSession httpSession = request.getSession();
		String page=request.getParameter("Page");
		User user =(User)httpSession.getAttribute("UserInfo");
		if(user==null) {
			throw new RuntimeException("User is not logged in");
		}
		
		Map<String,String> map = new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		map.put("Page", page);
		return attentionmapper.getFollowMeNumber(map);
	}
	
	@Override
	public List<Map> getIFollowList(HttpServletRequest request) {
		
		HttpSession httpSession = request.getSession();
		String page=request.getParameter("Page");
		User user =(User)httpSession.getAttribute("UserInfo");
		if(user==null) {
			throw new RuntimeException("User is not logged in");
		}
		
		Map<String,String> map = new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		map.put("Page", page);
		return attentionmapper.getIFollowList(map);
	}
	
	@Override
	public Integer getIFollowNumber(HttpServletRequest request) {
		
		HttpSession httpSession = request.getSession();
		String page=request.getParameter("Page");
		User user =(User)httpSession.getAttribute("UserInfo");
		if(user==null) {
			throw new RuntimeException("User is not logged in");
		}
		
		Map<String,String> map = new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		map.put("Page", page);
		return attentionmapper.getIFollowNumber(map);
	}
	
	@Override
	public Integer opAttentionCount(HttpServletRequest request) {
		
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");

		if (user.getUserLevel() != 5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}
		
		String userID = request.getParameter("UserID");
		String followedID = request.getParameter("FollowedID");
		String page = request.getParameter("Page");

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("UserID", userID);
		map.put("FollowedID", followedID);
		return attentionmapper.opAttentionCount(map);
	}
	
	@Override
	public List<Map> opAttentionList(HttpServletRequest request) {
		
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");

		if (user.getUserLevel() != 5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}
		
		String userID = request.getParameter("UserID");
		String followedID = request.getParameter("FollowedID");
		String page = request.getParameter("Page");

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("UserID", userID);
		map.put("Page", page);
		map.put("FollowedID", followedID);
		return attentionmapper.opAttentionList(map);
	}
	
	@Override
	public void opDeleteAttention(HttpServletRequest request) {
		
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");

		if (user.getUserLevel() != 5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}
		
		String userID = request.getParameter("UserID");
		String followedID = request.getParameter("FollowedID");

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("UserID", userID);
		map.put("FollowedID", followedID);
		try {
			int result = attentionmapper.opDeleteAttention(map);
			if(result<1) {
				throw new RuntimeException("Delete Error");
			}
		} catch (Exception e) {
			throw e;
		}
		
	}
}
