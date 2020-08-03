package vip.pilipala.dao;

import java.util.List;
import java.util.Map;

import vip.pilipala.model.Resources;

public interface ResourcesMapper {
	
	public Integer insertVideoResource(Map map);
	
	public Integer insertFile(Map map);
	
	public Map getVideoFileInfo(Map map);
	
	public Map getVideoResourcesInfo(Map map);
	
	public Integer getVideoInfoCount(String VideoID);
	
	/**
	 * 随机推荐视频资源
	 * @return
	 */
	public List<Map> getResourcesRandomList(Map map);
	
	/**
	 * 获取用户其他资源 同样类型的资源
	 * @param map
	 * @return
	 */
	public List<Map> getUserResourcesRandomList(Map map);
	
	/**
	 * 获取用户视频资源列表
	 * ResType
	 * UserID
	 * Page
	 * @param map
	 * @return
	 */
	public List<Map> getUserResourcesList(Map map);
	
	public Integer getUserResourcesNumber(Map map);
	
	public Resources findResourcesByResIDAndUserID(Map map);
	
	public Resources findResourcesByResID(Map map);
	
	//删除资源表数据
	public Integer deleteResourcesById(Map map);
	//删除文件表数据
	public Integer deleteResourcesFileById(Map map);
	
	public Integer insertArticleResource(Map map);
	
	public Integer updataResourcesCheck(Map map);
	
	public Integer insertOtherResource(Map map);
	
	public List<Map> getResourcesFileMap(Map map);
	
	public List<Map> getResourcesTypeMap();
	
	public Integer getOpResourcesCount(Map map);
	
	public List<Map> getOpResourcesList(Map map);
	
	public List<Map> getResourcesTop5List(Map map);
	
	public Integer insertCarousel(Map map);
	
	public List<Map> getCarouselList();
	
	public Integer deleteCarouselByNumber(Map map);
	
	/**
	 * SearchChar
	 * Check
	 * Time
	 * Page
	 * PageLength
	 * ResType
	 * @param map
	 * @return
	 */
	public List<Map> getSearchResourcesList(Map map);
	
	public Integer getSearchResourcesCount(Map map);
	
	public Map findUserResourceStatistics(Map map);
	
	public Integer insertReport(Map map);
	
	public List<Map> getReportList(Map map);
	
	public Integer getReportCount(Map map);
	
	public Integer deleteReport(Map map);
	
	public Integer deleteReportByResID(Map map);
	
	public Integer insertHistory(Map map);
	
	public Integer updateHistory(Map map);
	
	public Integer deleteHistory(Map map);
	
	public List<Map> selectHistory(Map map);
	
	public Integer findHistoryByUserIDAndResID(Map map);
	
	public List<Map> getOtherResourcesTypeMap();
	
}
