package vip.pilipala.dao;

import java.util.List;
import java.util.Map;

public interface AttentionMapper {

	public Integer insertAttention(Map map);
	
	public Integer deleteAttention(Map map);
	
	public Integer selectAttention(Map map);
	
	public List<Map> getFollowMeList(Map map);
	
	public Integer getFollowMeNumber(Map map);
	
	public List<Map> getIFollowList(Map map);
	
	public Integer getIFollowNumber(Map map);
	
	public List<Map> opAttentionList(Map map);
	
	public Integer opAttentionCount(Map map);
	
	public Integer opDeleteAttention(Map map);
}
