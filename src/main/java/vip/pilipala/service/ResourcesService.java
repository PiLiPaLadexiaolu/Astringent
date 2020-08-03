package vip.pilipala.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartHttpServletRequest;

public interface ResourcesService {
	
	public void uploadVideoResources(MultipartHttpServletRequest request) throws IOException;
	
	public List<Map> mergeResourcesFile(HttpServletRequest request) throws FileNotFoundException, IOException;
	
	public List<Map> isUploadFile(HttpServletRequest request);
	
	public void uploadResourcesCover(MultipartHttpServletRequest request) throws IOException;
	
	public void uploadVideoRespircesInfo(HttpServletRequest request);
	
	public Integer getVideoInfoCount(String videoId);
	
	public Map getVideoFileInfo(String videoId,String videoIndex);
	
	public void getVideoFile(String videoId,String videoName,HttpServletRequest request,HttpServletResponse response) throws Exception;
	
	public void getVideoFileHead(String videoId,String videoName,HttpServletRequest request,HttpServletResponse response) throws Exception;
	
	public Map getResourcesInfo(String resId);
	
	public List<Map> getResourcesRandomList(HttpServletRequest request);
	
	public ResponseEntity<byte[]> getCover(String coverName) throws Exception;
	
	public List<Map> getUserVideoResourcesList(HttpServletRequest request);
	
	public Integer getUserVideoResourcesCount(HttpServletRequest request);
	
	public void deleteUserResources(HttpServletRequest request) throws IOException;
	
	public void uploadArticleResourcesInfo(HttpServletRequest request);
	
	public List<Map> getUserResourcesRandomList(String resId);
	
	public void updataResourcesCheck(HttpServletRequest request);
	
	public void downloadResources(String resId,String fileName,HttpServletResponse response) throws Exception;
	
	public void uploadOtherRespircesInfo(HttpServletRequest request);
	
	public List<Map> getOtherResourcesFileMap(String resId);
	
	public Integer getUserOtherResourcesCount(HttpServletRequest request);
	
	public List<Map> getUserOtherResourcesList(HttpServletRequest request);
	
	public Integer getUserArticleResourcesCount(HttpServletRequest request);
	
	public List<Map> getUserArticleResourcesList(HttpServletRequest request);
	
	public void deleteUserArticleResources(HttpServletRequest request) throws IOException;
	
	public List<Map> getResourcesTypeMap();
	
	public List<Map> getOtherResourcesTypeMap();
	
	public Integer getOPArticleCount(HttpServletRequest request);
	
	public List<Map> getOPArticleList(HttpServletRequest request);
	
	public Integer getOPVideoCount(HttpServletRequest request);
	
	public List<Map> getOPVideoList(HttpServletRequest request);
	
	public Integer getOPOtherCount(HttpServletRequest request);
	
	public List<Map> getOPOtherList(HttpServletRequest request);
	
	public void opDeleteArticleResources(HttpServletRequest request) throws IOException;
	
	public void opDeleteResources(HttpServletRequest request) throws IOException;
	
	public List<Map> getResourcesTop5List(HttpServletRequest request);
	
	public void uploadCarouselImg(MultipartHttpServletRequest request) throws IOException;
	
	public void addCarouse(HttpServletRequest request);
	
	public ResponseEntity<byte[]> getCarousel(String carouselName) throws Exception;
	
	public List<Map> getCarouselList();
	
	public void deleteCarousel(HttpServletRequest request);
	
	public List<Map> getSearchResourcesList(String searchChar,String check,String time,String page,String pageLength,String resType);
	
	public Integer getSearchResourcesCount(String searchChar,String check,String time,String resType);
	
	public List<Map> getUserHomeResourcesList(String page,String userID,String resType);
	
	public Integer getUserHomeResourcesCount(String userID,String resType);
	
	public Map getUserResourcesStatistics(String userID);
	
	public void insertReport(String resID,String reportContent);
	
	public List<Map> getReportList(HttpServletRequest request);
	
	public Integer getReportCount(HttpServletRequest request);
	
	public void opDeleteReport(HttpServletRequest request);
	
	public List<Map> getHistoryList(HttpServletRequest request);
	
}
