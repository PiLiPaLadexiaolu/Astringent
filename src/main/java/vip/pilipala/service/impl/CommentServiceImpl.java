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

import com.mysql.cj.Session;

import vip.pilipala.dao.CommentMapper;
import vip.pilipala.model.User;
import vip.pilipala.service.CommentService;

@Service
public class CommentServiceImpl implements CommentService{
	
	@Autowired
	private CommentMapper commentMapper;
	
	private Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Override
	public void insertComment(HttpServletRequest request) {
		
		logger.info("insertComment() start"); 
		
		HttpSession httpSession = request.getSession();
		User user=(User) httpSession.getAttribute("UserInfo");
		if(user==null) {
			throw new RuntimeException("User is not logged in");
		}
		if(request.getParameter("ResID").equals("")||request.getParameter("ResID")==null) {
			throw new RuntimeException("No data entered");
		}
		if(request.getParameter("Comment").equals("")||request.getParameter("Comment")==null) {
			throw new RuntimeException("No data entered");
		}
		Map<String,String> map = new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		map.put("ResourcesID", request.getParameter("ResID"));
		map.put("Comment", request.getParameter("Comment"));
		try {
			commentMapper.insertComment(map);
		} catch (Exception e) {
			throw new RuntimeException("Insertion exception");
		}
		
	}
	
	@Override
	public Integer getCommentNumber(String resId) {
		Map<String,String> map = new HashMap<String, String>();
		map.put("ResID", resId);
		return commentMapper.getCommentNumber(map);
	}
	
	@Override
	public List<Map> getCommentList(String resId, String page) {
		Map<String,String> map = new HashMap<String, String>();
		map.put("ResID", resId);
		map.put("Page", page);
		return commentMapper.getCommentList(map);
	}
	
	@Override
	public List<Map> getMyComment(HttpServletRequest request) {
		
		String resName=request.getParameter("ResName");
		String comWords=request.getParameter("ComWords");
		String resType=request.getParameter("ResType");
		String page=request.getParameter("Page");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		
		//判断用户是否登录
		if(user==null) {
			logger.error("User is not logged in");
			throw new RuntimeException("User is not logged in");
		}
		
		if(page.equals("")||page==null) {
			logger.error("page is null");
			throw new RuntimeException("page is null");
		}
		
		HashMap<String, String> map=new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		map.put("ResName", resName);
		map.put("ComWords", comWords);
		map.put("ResType", resType);
		map.put("Page", page);
		return commentMapper.getMyComment(map);
	}
	
	@Override
	public Integer getMyCommentNumber(HttpServletRequest request) {
		
		String resName=request.getParameter("ResName");
		String comWords=request.getParameter("ComWords");
		String resType=request.getParameter("ResType");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		
		//判断用户是否登录
		if(user==null) {
			logger.error("User is not logged in");
			throw new RuntimeException("User is not logged in");
		}
		HashMap<String, String> map=new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		map.put("ResName", resName);
		map.put("ComWords", comWords);
		map.put("ResType", resType);
		return commentMapper.getMyCommentNumber(map);
	}
	
	@Override
	public List<Map> getUserComment(HttpServletRequest request) {
		
		String resName=request.getParameter("ResName");
		String comWords=request.getParameter("ComWords");
		String resType=request.getParameter("ResType");
		String page=request.getParameter("Page");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		
		//判断用户是否登录
		if(user==null) {
			logger.error("User is not logged in");
			throw new RuntimeException("User is not logged in");
		}
		
		if(page.equals("")||page==null) {
			logger.error("page is null");
			throw new RuntimeException("page is null");
		}
		
		HashMap<String, String> map=new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		map.put("ResName", resName);
		map.put("ComWords", comWords);
		map.put("ResType", resType);
		map.put("Page", page);
		return commentMapper.getUserComment(map);
	}
	
	@Override
	public Integer getUserCommentNumber(HttpServletRequest request) {
		String resName=request.getParameter("ResName");
		String comWords=request.getParameter("ComWords");
		String resType=request.getParameter("ResType");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		
		//判断用户是否登录
		if(user==null) {
			logger.error("User is not logged in");
			throw new RuntimeException("User is not logged in");
		}
		HashMap<String, String> map=new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		map.put("ResName", resName);
		map.put("ComWords", comWords);
		map.put("ResType", resType);
		return commentMapper.getUserCommentNumber(map);
	}
	
	@Override
	public List<Map> getOpComment(HttpServletRequest request) {
		
		String resName=request.getParameter("ResName");
		String comWords=request.getParameter("ComWords");
		String resType=request.getParameter("ResType");
		String page=request.getParameter("Page");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		
		//判断用户是否登录
		if(user==null) {
			logger.error("User is not logged in");
			throw new RuntimeException("User is not logged in");
		}
		
		if(user.getUserLevel()!=5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}
		
		if(page.equals("")||page==null) {
			logger.error("page is null");
			throw new RuntimeException("page is null");
		}
		
		HashMap<String, String> map=new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		map.put("ResName", resName);
		map.put("ComWords", comWords);
		map.put("ResType", resType);
		map.put("Page", page);
		return commentMapper.getOpComment(map);
	}
	
	@Override
	public Integer getOpCommentNumber(HttpServletRequest request) {
		String resName=request.getParameter("ResName");
		String comWords=request.getParameter("ComWords");
		String resType=request.getParameter("ResType");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		
		//判断用户是否登录
		if(user==null) {
			logger.error("User is not logged in");
			throw new RuntimeException("User is not logged in");
		}
		
		if(user.getUserLevel()!=5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}
		
		HashMap<String, String> map=new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		map.put("ResName", resName);
		map.put("ComWords", comWords);
		map.put("ResType", resType);
		return commentMapper.getOpCommentNumber(map);
	}
	
	@Override
	public void opDeleteComment(HttpServletRequest request) {
		String commID=request.getParameter("CommID");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		
		//判断用户是否登录
		if(user==null) {
			logger.error("User is not logged in");
			throw new RuntimeException("User is not logged in");
		}
		//判断用户等级
		if(user.getUserLevel()!=5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}
		
		HashMap<String, String> map=new HashMap<String, String>();
		map.put("CommID", commID);
		int result = commentMapper.deleteOpComment(map);
		if(result<1) {
			throw new RuntimeException("Delete exception");
		}
	}
	
	@Override
	public void deleteComment(HttpServletRequest request) {
		String commID = request.getParameter("CommID");
		
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		
		if(user==null) {
			throw new RuntimeException("User is not logged in");
		}
		HashMap<String, String> map=new HashMap<String, String>();
		map.put("CommID", commID);
		map.put("UserID", user.getUserID().toString());
		try {
			Integer result = commentMapper.deleteComment(map);
			if(result<1) {
				logger.error("failed to delete");
				throw new RuntimeException("failed to delete");
			}
		} catch (Exception e) {
			throw e;
		}
	}
}
