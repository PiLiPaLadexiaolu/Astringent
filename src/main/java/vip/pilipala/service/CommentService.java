package vip.pilipala.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface CommentService {
	
	public void insertComment(HttpServletRequest request);
	
	public Integer getCommentNumber(String resID);
	
	public List<Map> getCommentList(String resId,String page);
	
	public List<Map> getUserComment(HttpServletRequest request);
	
	public Integer getUserCommentNumber(HttpServletRequest request);
	
	public List<Map> getMyComment(HttpServletRequest request);
	
	public Integer getMyCommentNumber(HttpServletRequest request);
	
	public List<Map> getOpComment(HttpServletRequest request);
	
	public Integer getOpCommentNumber(HttpServletRequest request);
	
	public void opDeleteComment(HttpServletRequest request);
	
	public void deleteComment(HttpServletRequest request);
	
	
}
