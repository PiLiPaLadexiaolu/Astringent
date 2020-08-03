package vip.pilipala.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.google.gson.Gson;

import vip.pilipala.model.User;
import vip.pilipala.service.AttentionService;
import vip.pilipala.service.CommentService;
import vip.pilipala.service.ResourcesService;
import vip.pilipala.service.UserService;
import vip.pilipala.utils.GsonUtil;
import vip.pilipala.utils.ResultUtil;

/**
 * 该控制类用于JSON数据操作不返回视图
 * @author PiLiPaLa
 *
 */
@Controller
public class DataController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private ResourcesService resourcesService;
	
	@Autowired
	private CommentService commentService;
	
	@Autowired
	private AttentionService attentionService;
	
	private Logger logger = LoggerFactory.getLogger(this.getClass());
	
	
	@ResponseBody
	@RequestMapping(value = "/emailCode", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0001(HttpServletRequest request) throws Exception {
		logger.info("DataController-dataIndex0001-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			userService.emailCode(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/register", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0002(HttpServletRequest request) throws Exception {
		logger.info("DataController-dataIndex0002-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			userService.registerUser(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/login", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0003(HttpServletRequest request,HttpServletResponse response) throws Exception {
		logger.info("DataController-dataIndex0003-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			userService.loginUser(request,response);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/password", method = RequestMethod.PUT ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0004(HttpServletRequest request) throws Exception {
		logger.info("DataController-dataIndex0004-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			userService.resetPassword(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/userInfo", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0005(HttpServletRequest request) throws Exception {
		logger.info("DataController-dataIndex0005-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			return gson.toJson(ResultUtil.SUCCESS(userService.getUserInfo(request)));
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 上传资源
	 * @param request
	 * @return
	 * @throws IOException 
	 */
	@ResponseBody
	@RequestMapping(value = "/uploadResources", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	private void dataIndex0006(HttpServletRequest request , HttpServletResponse response) throws IOException {
		logger.info("DataController-dataIndex0006-Enter");
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		Gson gson = GsonUtil.getGson();
		try {
			resourcesService.uploadVideoResources(multipartRequest);
		}catch (IOException e) {
			response.sendError(550, "Need authentication!!!" );
		}
		catch (Exception e) {
			response.sendError(403, "Not logged in" );
		}
	}
	
	/**
	 * 合并资源
	 * @param request
	 * @return
	 * @throws IOException 
	 */
	@ResponseBody
	@RequestMapping(value = "/mergeResourcesFile", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	private String dataIndex0007(HttpServletRequest request , HttpServletResponse response){
		logger.info("DataController-dataIndex0007-Enter");
		Gson gson = GsonUtil.getGson();
		try {
			return gson.toJson(ResultUtil.SUCCESS(resourcesService.mergeResourcesFile(request)));
		}catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 合并资源
	 * @param request
	 * @return
	 * @throws IOException 
	 */
	@ResponseBody
	@RequestMapping(value = "/isUploadFile", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	private String dataIndex0008(HttpServletRequest request , HttpServletResponse response){
		logger.info("DataController-dataIndex0008-Enter");
		Gson gson = GsonUtil.getGson();
		try {
			return gson.toJson(ResultUtil.SUCCESS(resourcesService.isUploadFile(request)));
		}catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 上传资源封面
	 * @param request
	 * @return 
	 * @return
	 * @throws IOException 
	 */
	@ResponseBody
	@RequestMapping(value = "/uploadResourcesCover", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	private String dataIndex0009(HttpServletRequest request , HttpServletResponse response) throws IOException {
		logger.info("DataController-dataIndex0009-Enter");
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		Gson gson = GsonUtil.getGson();
		try {
			resourcesService.uploadResourcesCover(multipartRequest);
			return gson.toJson(ResultUtil.SUCCESS());
		}catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 上传资源信息
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/uploadVideoResourcesInfo", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0010(HttpServletRequest request) {
		logger.info("DataController-dataIndex0010-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			resourcesService.uploadVideoRespircesInfo(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 获取视频文件信息
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/videoFileInfo", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0011(HttpServletRequest request) {
		logger.info("DataController-dataIndex0011-Enter");
		String videoId = request.getParameter("VideoID");
		String videoIndex = request.getParameter("VideoIndex");
		Gson gson=GsonUtil.getGson();
	
		try {
			Map map=resourcesService.getVideoFileInfo(videoId,videoIndex);
			return gson.toJson(ResultUtil.SUCCESS(map));
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 获取视频列表
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/videoInfoCount", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0012(HttpServletRequest request) {
		logger.info("DataController-dataIndex0012-Enter");
		String videoId = request.getParameter("VideoID");
		
		Gson gson=GsonUtil.getGson();
	
		try {
			Integer result=resourcesService.getVideoInfoCount(videoId);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	//ResponseEntity<byte[]>
	@CrossOrigin
	@RequestMapping(value = "/getVideoResources",method = RequestMethod.GET)
	public void dataIndex0013(HttpServletResponse response  ,HttpServletRequest request ) throws IOException 
	{
		logger.info("DataController-dataIndex0013-Enter");
		Gson gson=GsonUtil.getGson();
		String videoId = request.getParameter("VideoID");
		String fileName = request.getParameter("FileName");
		try {
			//return
			 resourcesService.getVideoFile(videoId, fileName,request,response);
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(404);
		}
	}
	
	@CrossOrigin
	@RequestMapping(value = "/getVideoResources",method = RequestMethod.HEAD,produces = " text/plain;charset=UTF-8")
	public void dataIndex0099(HttpServletResponse response  ,HttpServletRequest request ) throws IOException 
	{
		logger.info("DataController-dataIndex0099-Enter");
		Gson gson=GsonUtil.getGson();
		String videoId = request.getParameter("VideoID");
		String fileName = request.getParameter("FileName");
		try {
			resourcesService.getVideoFileHead(videoId, fileName, request,response);
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(404);
		}
	}
	
	
	@ResponseBody
	@RequestMapping(value = "/getResourcesInfo",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0014(HttpServletResponse response  ,HttpServletRequest request ) throws IOException 
	{
		logger.info("DataController-dataIndex0014-Enter");
		Gson gson=GsonUtil.getGson();
		String resId = request.getParameter("ResID");
		try {
			Map map =resourcesService.getResourcesInfo(resId);
			if(map==null) {
				throw new RuntimeException();
			}
			return gson.toJson(ResultUtil.SUCCESS(map));
		} catch (Exception e) {
			response.setStatus(404);
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 获取随机视频资源
	 * @param response
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/getResourcesRandomList",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0015(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0015-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> listmap =resourcesService.getResourcesRandomList(request);
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 获取资源封面
	 */
	@RequestMapping(value = "/getResourcesCover",method = RequestMethod.GET)
	public ResponseEntity<byte[]> dataIndex0016(HttpServletResponse response  ,HttpServletRequest request ) throws IOException 
	{
		logger.info("DataController-dataIndex0016-Enter");
		String fileName = request.getParameter("CoverName");
		try {
			return resourcesService.getCover(fileName);
		} catch (Exception e) {
			response.setStatus(404);
			return null;
		}
	}
	
	/**
	 * 获取随机视频资源
	 * @param response
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/submitComment",method = RequestMethod.POST,produces = " text/plain;charset=UTF-8")
	public String dataIndex0017(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0017-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			commentService.insertComment(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 获取资源评论数量
	 * @param response
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/getCommentNumber",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0018(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0018-Enter");
		Gson gson=GsonUtil.getGson();
		String resId=request.getParameter("ResID");
		try {
			return gson.toJson(ResultUtil.SUCCESS(commentService.getCommentNumber(resId)));
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 获取资源评论列表
	 * @param response
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/getCommentList",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0019(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0019-Enter");
		Gson gson=GsonUtil.getGson();
		String resId=request.getParameter("ResID");
		String page=request.getParameter("Page");
		try {
			List<Map> listmap =commentService.getCommentList(resId, page);
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	
	@ResponseBody
	@RequestMapping(value = "/getUserVideoList",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0020(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0020-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> listmap =resourcesService.getUserVideoResourcesList(request);
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 获取用户管理视频页面数据总数量
	 * @param response
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/getUserVideoCount",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0021(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0020-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			Integer result =resourcesService.getUserVideoResourcesCount(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	@ResponseBody
	@RequestMapping(value = "/userResources",method = RequestMethod.DELETE,produces = " text/plain;charset=UTF-8")
	public String dataIndex0022(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0022-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			resourcesService.deleteUserResources(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 修改用户信息
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@RequestMapping(value = "/userInfo", method = RequestMethod.PUT ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0023(HttpServletRequest request) throws Exception {
		logger.info("DataController-dataIndex0020-Enter");
		Gson gson=GsonUtil.getGson();
		
		try {
			userService.updateUserInfo(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 修改用户信息
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@RequestMapping(value = "/userOut", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0024(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info("DataController-dataIndex0024-Enter");
		Gson gson=GsonUtil.getGson();
		
		try {
			userService.userOut(request,response);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 添加关注接口
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@RequestMapping(value = "/attention", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0025(HttpServletRequest request) throws Exception {
		logger.info("DataController-dataIndex0025-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			attentionService.insertAttention(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 查询关注接口
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@RequestMapping(value = "/attention", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0026(HttpServletRequest request) throws Exception {
		logger.info("DataController-dataIndex0026-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			int result=attentionService.selectAttention(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 取消关注接口
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@RequestMapping(value = "/attention", method = RequestMethod.DELETE ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0027(HttpServletRequest request) throws Exception {
		logger.info("DataController-dataIndex0027-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			attentionService.deleteAttention(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	
	/**
	 * 提交文章类型资源信息
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@RequestMapping(value = "/uploadArticleResourcesInfo", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0028(HttpServletRequest request) throws Exception {
		logger.info("DataController-dataIndex0028-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			resourcesService.uploadArticleResourcesInfo(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 查询关注接口
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@RequestMapping(value = "/getUserResourcesRandomList", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0029(HttpServletRequest request) throws Exception {
		logger.info("DataController-dataIndex0029-Enter");
		String resId=request.getParameter("ResID");
		Gson gson=GsonUtil.getGson();
		try {
			return gson.toJson(ResultUtil.SUCCESS(resourcesService.getUserResourcesRandomList(resId)));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 更新资源查看次数
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@RequestMapping(value = "/updateClicks", method = RequestMethod.PUT ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0030(HttpServletRequest request) throws Exception {
		logger.info("DataController-dataIndex0030-Enter");
		
		Gson gson=GsonUtil.getGson();
		try {
			resourcesService.updataResourcesCheck(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@RequestMapping(value = "/downloadResources",method = RequestMethod.GET)
	public void dataIndex0031(HttpServletResponse response  ,HttpServletRequest request ) throws IOException 
	{
		logger.info("DataController-dataIndex0031-Enter");
		Gson gson=GsonUtil.getGson();
		String resId = request.getParameter("ResID");
		String fileName = request.getParameter("FileName");
		try {
			resourcesService.downloadResources(resId, fileName,response);
		} catch (Exception e) {
			response.setStatus(404);
		}
		
	}
	
	/**
	 * 上传资源信息
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/uploadOtherResourcesInfo", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0032(HttpServletRequest request) {
		logger.info("DataController-dataIndex0032-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			resourcesService.uploadOtherRespircesInfo(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	
	/**
	 * 获取随机文章资源
	 * @param response
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/getOtherResourcesFileMap",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0035(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0035-Enter");
		Gson gson=GsonUtil.getGson();
		String resId=request.getParameter("ResID");
		try {
			List<Map> listmap =resourcesService.getOtherResourcesFileMap(resId);
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 获取用户管理其他资源页面数据总数量
	 * @param response
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/getUserOtherCount",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0036(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0036-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			Integer result =resourcesService.getUserOtherResourcesCount(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getUserOtherList",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0037(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0037-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> listmap =resourcesService.getUserOtherResourcesList(request);
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 获取用户管理其他资源页面数据总数量
	 * @param response
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/getUserArticleCount",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0038(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0038-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			Integer result =resourcesService.getUserArticleResourcesCount(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getUserArticleList",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0039(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0039-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> listmap =resourcesService.getUserArticleResourcesList(request);
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/userResource",method = RequestMethod.DELETE,produces = " text/plain;charset=UTF-8")
	public String dataIndex0040(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0040-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			resourcesService.deleteUserArticleResources(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getResourcesTypeMap",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0041(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0041-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> listmap =resourcesService.getResourcesTypeMap();
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getUserComment",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0042(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0042-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> listmap =commentService.getUserComment(request);
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getUserCommentNumber",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0043(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0043-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			Integer result=commentService.getUserCommentNumber(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	
	@ResponseBody
	@RequestMapping(value = "/getMyComment",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0044(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0044-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> listmap =commentService.getMyComment(request);
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getMyCommentNumber",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0045(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0045-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			Integer result=commentService.getMyCommentNumber(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getFollowMeList",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0046(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0046-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> result =attentionService.getFollowMeList(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getFollowMeNumber",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0047(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0046-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			Integer result =attentionService.getFollowMeNumber(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getIFollowList",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0048(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0046-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> result =attentionService.getIFollowList(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getIFollowNumber",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0049(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0046-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			Integer result =attentionService.getIFollowNumber(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getOpArticleCount",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0050(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0050-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			Integer result =resourcesService.getOPArticleCount(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getOpArticleList",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0051(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0051-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> listmap =resourcesService.getOPArticleList(request);
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/opArticleResource",method = RequestMethod.DELETE,produces = " text/plain;charset=UTF-8")
	public String dataIndex0052(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0052-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			resourcesService.opDeleteArticleResources(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getOpVideoCount",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0053(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0053-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			Integer result =resourcesService.getOPVideoCount(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getOpVideoList",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0054(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0054-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> listmap =resourcesService.getOPVideoList(request);
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getOpOtherCount",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0055(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0055-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			Integer result =resourcesService.getOPOtherCount(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getOpOtherList",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0056(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0056-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> listmap =resourcesService.getOPOtherList(request);
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/opResource",method = RequestMethod.DELETE,produces = " text/plain;charset=UTF-8")
	public String dataIndex0057(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0057-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			resourcesService.opDeleteResources(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getOpComment",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0058(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0058-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> listmap =commentService.getOpComment(request);
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getOpCommentNumber",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0059(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0059-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			Integer result=commentService.getOpCommentNumber(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/opComment",method = RequestMethod.DELETE,produces = " text/plain;charset=UTF-8")
	public String dataIndex0060(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0060-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			commentService.opDeleteComment(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getResourcesTop5",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0061(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0061-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> result=resourcesService.getResourcesTop5List(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 上传轮播图片
	 * @param request
	 * @return 
	 * @return
	 * @throws IOException 
	 */
	@ResponseBody
	@RequestMapping(value = "/uploadCarouselImg", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	private String dataIndex0064(HttpServletRequest request , HttpServletResponse response) throws IOException {
		logger.info("DataController-dataIndex0064-Enter");
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		Gson gson = GsonUtil.getGson();
		try {
			resourcesService.uploadCarouselImg(multipartRequest);
			return gson.toJson(ResultUtil.SUCCESS());
		}catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/carousel", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	private String dataIndex0065(HttpServletRequest request , HttpServletResponse response) throws IOException {
		logger.info("DataController-dataIndex0065-Enter");
		Gson gson = GsonUtil.getGson();
		try {
			resourcesService.addCarouse(request);
			return gson.toJson(ResultUtil.SUCCESS());
		}catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 获取轮播封面
	 */
	@RequestMapping(value = "/carousel",method = RequestMethod.GET)
	public ResponseEntity<byte[]> dataIndex0066(HttpServletResponse response  ,HttpServletRequest request ) throws IOException 
	{
		logger.info("DataController-dataIndex0066-Enter");
		String fileName = request.getParameter("CarouselName");
		try {
			return resourcesService.getCarousel(fileName);
		} catch (Exception e) {
			response.setStatus(404);
			return null;
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/carousel",method = RequestMethod.DELETE,produces = " text/plain;charset=UTF-8")
	public String dataIndex0067(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0067-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			resourcesService.deleteCarousel(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 获取轮播列表
	 */
	@ResponseBody
	@RequestMapping(value = "/getCarouselList",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0068(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0066-Enter");
		Gson gson = GsonUtil.getGson();
		try {
			List<Map> reslut=resourcesService.getCarouselList();
			return gson.toJson(ResultUtil.SUCCESS(reslut));
		}catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 获取搜索内容
	 */
	@ResponseBody
	@RequestMapping(value = "/getSearchResourcesList",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0069(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0069-Enter");
		String searchChar = request.getParameter("SearchChar");
		String check = request.getParameter("Check");
		String time = request.getParameter("Time");
		String page = request.getParameter("Page");
		String pageLength = request.getParameter("PageLength");
		String resType = request.getParameter("ResType");
		
		Gson gson = GsonUtil.getGson();
		try {
			List<Map> reslut=resourcesService.getSearchResourcesList(searchChar, check, time, page, pageLength, resType);
			return gson.toJson(ResultUtil.SUCCESS(reslut));
		}catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 获取搜索内容
	 */
	@ResponseBody
	@RequestMapping(value = "/getSearchResourcesCount",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0070(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0069-Enter");
		String searchChar = request.getParameter("SearchChar");
		String check = request.getParameter("Check");
		String time = request.getParameter("Time");
		String resType = request.getParameter("ResType");
		
		Gson gson = GsonUtil.getGson();
		try {
			Integer reslut=resourcesService.getSearchResourcesCount(searchChar, check, time, resType);
			return gson.toJson(ResultUtil.SUCCESS(reslut));
		}catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getUserHomePageInfo",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0071(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0071-Enter");
		Gson gson=GsonUtil.getGson();
		String userID = request.getParameter("UserID");
		
		try {
			Map result=userService.findUserHomePage(userID);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getUserHomeResourcesList",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0072(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0072-Enter");
		Gson gson=GsonUtil.getGson();
		String page = request.getParameter("Page");
		String userID = request.getParameter("UserID");
		String resType = request.getParameter("ResType");
		
		try {
			List<Map> listmap =resourcesService.getUserHomeResourcesList(page, userID, resType);
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getUserHomeResourcesCount",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0073(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0073-Enter");
		Gson gson=GsonUtil.getGson();
		String userID = request.getParameter("UserID");
		String resType = request.getParameter("ResType");
		
		try {
			Integer result =resourcesService.getUserHomeResourcesCount(userID, resType);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getUserResourcesStatistics",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0074(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0074-Enter");
		Gson gson=GsonUtil.getGson();
		String userID = request.getParameter("UserID");
		try {
			Map result =resourcesService.getUserResourcesStatistics(userID);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/comment",method = RequestMethod.DELETE,produces = " text/plain;charset=UTF-8")
	public String dataIndex0075(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0075-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			commentService.deleteComment(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/opAttentionList", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0076(HttpServletRequest request) {
		logger.info("DataController-dataIndex0076-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> result = attentionService.opAttentionList(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/opAttentionCount", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0077(HttpServletRequest request) {
		logger.info("DataController-dataIndex0077-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			Integer result = attentionService.opAttentionCount(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/opAttention",method = RequestMethod.DELETE,produces = " text/plain;charset=UTF-8")
	public String dataIndex0078(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0078-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			attentionService.opDeleteAttention(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	/**
	 * 获取用户等级列表
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/getUserLevelList", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0079(HttpServletRequest request) {
		logger.info("DataController-dataIndex0079-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> result = userService.getUserLevelList();
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 管理员创建用户
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/opAddUser", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	private String dataIndex0080(HttpServletRequest request , HttpServletResponse response) {
		logger.info("DataController-dataIndex0080-Enter");
		Gson gson = GsonUtil.getGson();
		try {
			userService.opAddUser(request);
			return gson.toJson(ResultUtil.SUCCESS());
		}catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/opUser",method = RequestMethod.DELETE,produces = " text/plain;charset=UTF-8")
	public String dataIndex0081(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0081-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			userService.opDeleteUser(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	/**
	 * 管理员查看用户列表
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/opGetUserList", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0081(HttpServletRequest request) {
		logger.info("DataController-dataIndex0081-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> result = userService.opGetUserList(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 管理员查看用户条数
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/opGetUserCount", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0082(HttpServletRequest request) {
		logger.info("DataController-dataIndex0082-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			Integer result = userService.opGetUserCount(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/report", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	private String dataIndex0083(HttpServletRequest request , HttpServletResponse response) {
		logger.info("DataController-dataIndex0083-Enter");
		Gson gson = GsonUtil.getGson();
		String resID = request.getParameter("ResID");
		String reportContent = request.getParameter("ReportContent");
		try {
			resourcesService.insertReport(resID, reportContent);
			return gson.toJson(ResultUtil.SUCCESS());
		}catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	

	@ResponseBody
	@RequestMapping(value = "/opGetReportCount", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0084(HttpServletRequest request) {
		logger.info("DataController-dataIndex0084-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			Integer result = resourcesService.getReportCount(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/opGetReportList", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0085(HttpServletRequest request) {
		logger.info("DataController-dataIndex0085-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> result = resourcesService.getReportList(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/opReport",method = RequestMethod.DELETE,produces = " text/plain;charset=UTF-8")
	public String dataIndex0086(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0086-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			resourcesService.opDeleteReport(request);
			return gson.toJson(ResultUtil.SUCCESS());
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getHistoryList", method = RequestMethod.GET ,produces = " text/plain;charset=UTF-8")
	public String dataIndex0087(HttpServletRequest request) {
		logger.info("DataController-dataIndex0087-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> result = resourcesService.getHistoryList(request);
			return gson.toJson(ResultUtil.SUCCESS(result));
		} catch (Exception e) {
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	@ResponseBody
	@RequestMapping(value = "/getOtherResourcesTypeMap",method = RequestMethod.GET,produces = " text/plain;charset=UTF-8")
	public String dataIndex0088(HttpServletResponse response  ,HttpServletRequest request )
	{
		logger.info("DataController-dataIndex0088-Enter");
		Gson gson=GsonUtil.getGson();
		try {
			List<Map> listmap =resourcesService.getOtherResourcesTypeMap();
			return gson.toJson(ResultUtil.SUCCESS(listmap));
		} catch (Exception e) {
			e.printStackTrace();
			return gson.toJson(ResultUtil.FAILURE());
		}
	}
	
	/**
	 * 测试方法
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@RequestMapping(value = "/test", method = RequestMethod.POST ,produces = " text/plain;charset=UTF-8")
	public String dataIndex1000(HttpServletRequest request) throws Exception {
		logger.info("DataController-dataIndex1000-Enter");
		Map<String, String> map=new HashMap<String, String>();
		map.put("Haaa", "Haaaasdasds");
		map.put("Haaaasdasds", "Haaa");
		try {
			ResultUtil<Map> result=new ResultUtil<Map>("100", "123", "456", map);
			Gson gson=GsonUtil.getGson();
			return gson.toJson(result);
		} catch (Exception e) {
			return null;
		}
	}

	
	
	
	
	
	
	
}
