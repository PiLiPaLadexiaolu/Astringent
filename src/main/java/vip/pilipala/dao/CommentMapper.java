package vip.pilipala.dao;

import java.util.List;
import java.util.Map;

public interface CommentMapper {
	
	public Integer insertComment(Map map);
	
	public Integer getCommentNumber(Map map);
	
	public List<Map> getCommentList(Map map);
	
	public Integer deleteCommentById (Map map);
	
	public List<Map> getUserComment(Map map);
	
	public Integer getUserCommentNumber(Map map);
	
	public List<Map> getMyComment(Map map);
	
	public Integer getMyCommentNumber(Map map);
	
	public List<Map> getOpComment(Map map);
	
	public Integer getOpCommentNumber(Map map);
	
	public Integer deleteOpComment(Map map);
	
	public Integer deleteComment(Map map);
	
}
