package vip.pilipala.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface AttentionService {
	
	public void insertAttention(HttpServletRequest request);
	
	public void deleteAttention(HttpServletRequest request);
	
	public Integer selectAttention(HttpServletRequest request);
	
	public List<Map> getFollowMeList(HttpServletRequest request);
	
	public Integer getFollowMeNumber(HttpServletRequest request);
	
	public List<Map> getIFollowList(HttpServletRequest request);
	
	public Integer getIFollowNumber(HttpServletRequest request);
	
	public List<Map> opAttentionList(HttpServletRequest request);
	
	public Integer opAttentionCount(HttpServletRequest request);
	
	public void opDeleteAttention(HttpServletRequest request);
}
