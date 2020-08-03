package vip.pilipala.service.impl;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.math.BigInteger;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import vip.pilipala.dao.CommentMapper;
import vip.pilipala.dao.ResourcesMapper;
import vip.pilipala.model.Resources;
import vip.pilipala.model.User;
import vip.pilipala.service.ResourcesService;
import vip.pilipala.utils.PropertiesUtil;

@Service
public class ResourcesServiceImpl implements ResourcesService {

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ResourcesMapper resourcesmapper;

	@Autowired
	private CommentMapper commentMapper;

	/**
	 * 将文件分段文件复制进临时目录
	 */
	@Override
	public void uploadVideoResources(MultipartHttpServletRequest request) throws IOException {
		// 获取用户信息
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		// 判断用户是否登录
		if (user == null) {
			throw new RuntimeException("User is not logged in");
		}
		// 获取sessionID
		String sessionId = httpSession.getId();
		// 获取临时资源路径
		String path = PropertiesUtil.getProperty("uploadPath.StagingTemporaryDirectory");
		// 获取到上传的文件
		MultipartFile file = request.getFile("File");
		// 获取文件名
		String fileName = request.getParameter("FileName");
		// 获取文件块索引
		String chunkIndex = request.getParameter("ChunkIndex");
		// 获取文件块大小
		String chunkSize = request.getParameter("ChunkSize");
		// 获取前端MD5摘要
		String md5 = request.getParameter("MD5");
		// 计算上传文件MD5
		String md5Check = DigestUtils.md5Hex(file.getBytes());
		if (!md5Check.equals(md5)) {
			throw new IOException("MD5 is different");
		}
		logger.info("-----------Head-----------");
		logger.info("SessionID：" + sessionId);
		logger.info("上传用户：" + user.getUserEmail());
		logger.info("文件名：" + fileName);
		logger.info("文件索引：" + chunkIndex);
		logger.info("文件大小：" + chunkSize);
		logger.info("-----------End------------");
		
		// 将文件复制到临时文件夹中
		File fileTemp = new File(path + user.getUserID().toString() + "_" + sessionId + fileName + "_chunk_" + chunkIndex);
		// 执行Copy
		FileUtils.copyInputStreamToFile(file.getInputStream(), fileTemp);
	}

	/**
	 * 合并资源文件
	 */
	@Override
	public List<Map> mergeResourcesFile(HttpServletRequest request) throws IOException {
		
		// 获取文件名
		String fileName = request.getParameter("FileName");
		// 上传文件总块数
		Integer count = Integer.parseInt(request.getParameter("ChunkCount").toString());
		// 获取文件MD5
		String md5 = request.getParameter("MD5");
		// 获取文件大小
		String fileSize = request.getParameter("FileSize");
		// 获取文件类型
		String fileType = request.getParameter("FileType");
		// 获取文件后缀名
		String[] split = fileName.split("\\.");
		String fileExtension = split[split.length - 1];

		HttpSession httpSession = request.getSession();
		String sessionId = httpSession.getId();
		User user = (User) httpSession.getAttribute("UserInfo");
		// 判断用户是否登录
		if (user == null) {
			throw new RuntimeException("User is not logged in");
		}
		String fileBlockPath = PropertiesUtil.getProperty("uploadPath.StagingTemporaryDirectory");

		// 循环判断文件是否全部存在
		for (int i = 0; i < count; i++) {// user.getUserID().toString()+"_"+sessionId+"_"+fileName+"_chunk_"+chunkIndex
			File file = new File(fileBlockPath + user.getUserID().toString() + "_" + sessionId + fileName + "_chunk_" + i);
			if (!file.exists()) {
				logger.error("Data merge failed");
				throw new RuntimeException("Data merge failed");
			}
		}
		// 用于给文件设置文件夹名以及存储到数据库(UUID)
		if (httpSession.getAttribute("FolderName") == null) {
			// 用随机码当文件夹名和数据库主键
			String uuid = UUID.randomUUID().toString().replace("-", "").toLowerCase();
			httpSession.setAttribute("FolderName", uuid);
		}

		String folderName = httpSession.getAttribute("FolderName").toString();

		// 获取存放视频文件路径
		String videoFilePath = PropertiesUtil.getProperty("uploadPath.VideoFilePath");
		int len = -1;
		byte[] cbuf = new byte[1024 * 100];
		// 合并文件
		File saveFile = new File(videoFilePath + folderName + "/");
		logger.info("File Path :" + saveFile.getAbsolutePath());
		// 判断目录是否存在如果存在则不创建
		if (!saveFile.exists()) {
			saveFile.mkdirs();
		}
		File checkFile = new File(saveFile + "/" + fileName);
		if (checkFile.exists()) {
			logger.info("File exists");
			throw new RuntimeException("File exists");
		}

		OutputStream writer = new FileOutputStream(saveFile + "/" + fileName);
		// 开始循环写入
		for (int i = 0; i < count; i++) {
			File file = new File(fileBlockPath + user.getUserID().toString() + "_" + sessionId + fileName + "_chunk_" + i);
			try {
				InputStream reader = new FileInputStream(file);
				while ((len = reader.read(cbuf, 0, cbuf.length)) != -1) {
					writer.write(cbuf, 0, len);
					writer.flush();
				}
				reader.close();
			} catch (IOException e) {
				throw e;
			}
		}
		// 关闭写入流
		writer.close();

		// 删除块文件
		for (int i = 0; i < count; ++i) {
			File file = new File(fileBlockPath + user.getUserID().toString() + "_" + sessionId + fileName + "_chunk_" + i);
			if (file.exists() && file.isFile()) {
				file.delete();
			}
		}

		File overFile = new File(saveFile + "/" + fileName);
		// 判断文件完整性
		// 比较整体文件MD5

		if (!DigestUtils.md5Hex(new FileInputStream(overFile)).equals(md5)) {
			// 不符删除文件从新传输
			logger.info("Error in merged files");
			overFile.delete();
			throw new RuntimeException("Error in merged files");
		}

		// 上传成功记录进SESSION
		if (httpSession.getAttribute("FileNumber") == null) {
			httpSession.setAttribute("FileNumber", 0);
		} else {
			int number = (int) httpSession.getAttribute("FileNumber");
			httpSession.setAttribute("FileNumber", ++number);
		}
		// 记录文件名信息和上传顺序
		if (httpSession.getAttribute("FileList") == null) {
			List<Map> fileList = new ArrayList<Map>();
			Map<String, String> map = new HashMap<String, String>();
			map.put("ResID", folderName);
			map.put("FileName", fileName);
			map.put("FileType", fileType);
			map.put("FileNumber", httpSession.getAttribute("FileNumber").toString());
			fileList.add(map);
			httpSession.setAttribute("FileList", fileList);
		} else {
			Map<String, String> map = new HashMap<String, String>();
			map.put("ResID", folderName);
			map.put("FileName", fileName);
			map.put("FileType", fileType);
			map.put("FileNumber", httpSession.getAttribute("FileNumber").toString());
			List<Map> fileList = (List<Map>) httpSession.getAttribute("FileList");
			fileList.add(map);
			httpSession.setAttribute("FileList", fileList);
		}

		return (List<Map>) httpSession.getAttribute("FileList");
	}

	/**
	 * 查询用户是否上传过资源，返回信息
	 */
	@Override
	public List<Map> isUploadFile(HttpServletRequest request) {
		HttpSession httpSession = request.getSession();
		if (httpSession.getAttribute("UserInfo") == null) {
			throw new RuntimeException("Not logged in");
		}
		if (httpSession.getAttribute("FileList") == null) {
			throw new RuntimeException("Not uploaded");
		}
		return (List<Map>) httpSession.getAttribute("FileList");

	}

	/**
	 * 接受资源信息
	 */
	@Override
	public void uploadResourcesCover(MultipartHttpServletRequest request) throws IOException {

		String fileName = request.getParameter("FileName");
		String fileSize = request.getParameter("FileSize");
		String md5 = request.getParameter("MD5");
		// 获取文件
		MultipartFile file = request.getFile("File");
		// 获取文件后缀
		String[] strArray = fileName.split("\\.");
		String suffix = strArray[strArray.length - 1];
		// 获取session中用户信息
		HttpSession httpSession = request.getSession();
		// 将封面文件类型写入Session中
		httpSession.setAttribute("ResourceCoverType", suffix);
		// 未登录抛出异常
		User user = (User) httpSession.getAttribute("UserInfo");
		if (user == null) {
			throw new RuntimeException("User is not logged in");
		}
		// 将Session中的UUID取出
		String uuid = (String) httpSession.getAttribute("FolderName");
		// 将文件复制到临时文件夹中

		String path = PropertiesUtil.getProperty("uploadPath.CoverFilePath");
		File fileTemp = new File(path + uuid + "." + suffix);
		FileUtils.copyInputStreamToFile(file.getInputStream(), fileTemp);

		logger.info("-----------Head-----------");
		logger.info("封面文件名：" + fileName);
		logger.info("封面MD5：" + md5);
		logger.info("封面文件大小：" + fileSize);
		logger.info("-----------End------------");

	}

	@Transactional(readOnly = false)
	@Override
	public void uploadVideoRespircesInfo(HttpServletRequest request) {

		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		List<Map> filelist = (List<Map>) httpSession.getAttribute("FileList");

		String coverType = httpSession.getAttribute("ResourceCoverType").toString();
		String folderName = httpSession.getAttribute("FolderName").toString();
		String resTitle = request.getParameter("ResTitle");
		String resMark = request.getParameter("ResMark");
		String resHtml = request.getParameter("ResHtml");
		String resLabel = request.getParameter("ResLabel");

		if (user == null) {
			logger.error("user is null");
			throw new RuntimeException("user is null");
		}

		if (filelist == null) {
			logger.error("filelist is null");
			throw new RuntimeException("filelist is null");
		}
		// 检查空字符
		if (coverType.equals("") || coverType == null) {
			logger.error("coverType is null");
			throw new RuntimeException("coverType is null");
		}

		if (folderName.equals("") || folderName == null) {
			logger.error("folderName is null");
			throw new RuntimeException("folderName is null");
		}

		if (resTitle.equals("") || resTitle == null) {
			logger.error("resTitle is null");
			throw new RuntimeException("resTitle is null");
		}

		if (resMark.equals("") || resMark == null) {
			logger.error("resMark is null");
			throw new RuntimeException("resMark is null");
		}

		if (resHtml.equals("") || resHtml == null) {
			logger.error("resHtml is null");
			throw new RuntimeException("resHtml is null");
		}

		if (resLabel.equals("") || resLabel == null) {
			logger.error("resLabel is null");
			throw new RuntimeException("resLabel is null");
		}

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResID", folderName);
		map.put("UserID", user.getUserID().toString());
		map.put("ResTitle", resTitle);
		map.put("ResContent", resHtml);
		map.put("ResMark", resMark);
		map.put("ResSrc", folderName);
		map.put("ResCoverSrc", folderName + "." + coverType);
		map.put("ResLabel", resLabel);

		int result = resourcesmapper.insertVideoResource(map);
		if (result < 0) {
			throw new RuntimeException("Insertion exception");
		}
		for (Map fileMap : filelist) {
			int cycleResult = resourcesmapper.insertFile(fileMap);
			if (result < 0) {
				throw new RuntimeException("Insertion exception");
			}
		}

		// 清理SESSION
		httpSession.removeAttribute("FileList");
		httpSession.removeAttribute("FolderName");
		httpSession.removeAttribute("FileNumber");
		httpSession.removeAttribute("ResourceCoverType");
		logger.info("Session RemoveAttribute");
	}

	/**
	 * 获取资源列表信息
	 */
	@Override
	public Map getVideoFileInfo(String videoId, String videoIndex) {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("VideoID", videoId);
		map.put("VideoIndex", videoIndex);
		try {
			return resourcesmapper.getVideoFileInfo(map);
		} catch (Exception e) {
			logger.error("getVideoListInfo method ERROR");
			throw e;
		}

	}

	/**
	 * 返回视频P数
	 */
	@Override
	public Integer getVideoInfoCount(String videoId) {
		try {
			return resourcesmapper.getVideoInfoCount(videoId);
		} catch (Exception e) {
			logger.error("getVideoInfoCount method ERROR");
			throw e;
		}

	}
	/**
	 * 返回视频流业务
	 */
	@Override
	public void getVideoFileHead(String videoId, String videoName,HttpServletRequest request,HttpServletResponse response) throws Exception {
		String videoFilePath = PropertiesUtil.getProperty("uploadPath.VideoFilePath");
		//将前端传值解码
		File fileTemp = new File(videoFilePath + "/" + videoId + "/" + URLDecoder.decode(videoName,"utf-8"));
		logger.info("PlayPath:"+videoFilePath + "/" + videoId + "/" + URLDecoder.decode(videoName,"utf-8"));
		if (!fileTemp.isFile()) {
			throw new RuntimeException("File Not Fount");
		}
//		headers.add("Accept-Ranges", "bytes");
//		headers.add("Content-Type", "video/mp4");
//		headers.add("Content-Range", "bytes 0-"+fileTemp.length()+"/"+fileTemp.length());
		//response.addHeader("Content-Range", "bytes 0-"+fileTemp.length()+"/"+fileTemp.length());
		// headers.add("Content-Disposition", "attachment;filename="+videoName);
//		headers.add("Content-Length", "" + fileTemp.length());
		response.setHeader("Content-Length",String.valueOf(fileTemp.length()));
	}
	/**
	 * 返回视频流业务
	 */
	@Override
	public void getVideoFile(String videoId, String videoName,HttpServletRequest request,HttpServletResponse response) throws Exception {
//		String videoFilePath = PropertiesUtil.getProperty("uploadPath.VideoFilePath");
//		//将前端传值解码
//		File fileTemp = new File(videoFilePath + "/" + videoId + "/" + URLDecoder.decode(videoName,"utf-8"));
//		logger.info("PlayPath:"+videoFilePath + "/" + videoId + "/" + URLDecoder.decode(videoName,"utf-8"));
//		if (!fileTemp.isFile()) {
//			throw new RuntimeException("File Not Fount");
//		}
//		byte[] buff;
//		try {
//			@SuppressWarnings("resource")
//			InputStream input = new FileInputStream(fileTemp);
//			buff = new byte[input.available()];// 获取文件大小
//			input.read(buff);
//		} catch (Exception e) {
//			throw e;
//		}
//		HttpHeaders headers = new HttpHeaders();
//		headers.add("Accept-Ranges", "bytes");
//		headers.add("Content-Type", "video/mp4");
//		headers.add("Content-Range", "bytes 0-"+fileTemp.length()+"/"+fileTemp.length());
//		// headers.add("Content-Disposition", "attachment;filename="+videoName);
//		headers.add("Content-Length", "" + fileTemp.length());
//		HttpStatus status = HttpStatus.OK;
//		ResponseEntity<byte[]> entity = new ResponseEntity<byte[]>(buff, headers, status);
//		return entity;
		
		String videoFilePath = PropertiesUtil.getProperty("uploadPath.VideoFilePath");
		//将前端传值解码
		File file = new File(videoFilePath + "/" + videoId + "/" + URLDecoder.decode(videoName,"utf-8"));
		logger.info("PlayPath:"+videoFilePath + "/" + videoId + "/" + URLDecoder.decode(videoName,"utf-8"));
		if (!file.isFile()) {
			throw new RuntimeException("File Not Fount");
		}
		String range = request.getHeader("Range");
		 //开始下载位置
        long startByte = 0;
        //结束下载位置
        long endByte = file.length() - 1;
 
        //有range的话
        if (range != null && range.contains("bytes=") && range.contains("-")) {
            range = range.substring(range.lastIndexOf("=") + 1).trim();
            String ranges[] = range.split("-");
            try {
                //根据range解析下载分片的位置区间
                if (ranges.length == 1) {
                    //情况1，如：bytes=-1024  从开始字节到第1024个字节的数据
                    if (range.startsWith("-")) {
                        endByte = Long.parseLong(ranges[0]);
                    }
                    //情况2，如：bytes=1024-  第1024个字节到最后字节的数据
                    else if (range.endsWith("-")) {
                        startByte = Long.parseLong(ranges[0]);
                    }
                }
                //情况3，如：bytes=1024-2048  第1024个字节到2048个字节的数据
                else if (ranges.length == 2) {
                    startByte = Long.parseLong(ranges[0]);
                    endByte = Long.parseLong(ranges[1]);
                }
 
            } catch (NumberFormatException e) {
                startByte = 0;
                endByte = file.length() - 1;
            }
        }
 
        //要下载的长度
        long contentLength = endByte - startByte + 1;
        //文件名
        String fileName = file.getName();
        //文件类型
        String contentType = request.getServletContext().getMimeType(fileName);
 
        //响应头设置
        //https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Ranges
        response.setHeader("Accept-Ranges", "bytes");
        //Content-Type 表示资源类型，如：文件类型
//        response.setHeader("Content-Type", contentType);
        //Content-Disposition 表示响应内容以何种形式展示，是以内联的形式（即网页或者页面的一部分），还是以附件的形式下载并保存到本地。
        // 这里文件名换成下载后你想要的文件名，inline表示内联的形式，即：浏览器直接下载
//        response.setHeader("Content-Disposition", "inline;filename=pom.xml");
        //Content-Length 表示资源内容长度，即：文件大小
        response.setHeader("Content-Length", String.valueOf(contentLength));
        //Content-Range 表示响应了多少数据，格式为：[要下载的开始位置]-[结束位置]/[文件总大小]
        response.setHeader("Content-Range", "bytes " + startByte + "-" + endByte + "/" + file.length());
 
        response.setStatus(206);
        response.setContentType(contentType);
 
        BufferedOutputStream outputStream = null;
        RandomAccessFile randomAccessFile = null;
        //已传送数据大小
        long transmitted = 0;
        try {
            randomAccessFile = new RandomAccessFile(file, "r");
            outputStream = new BufferedOutputStream(response.getOutputStream());
            byte[] buff = new byte[2048];
            int len = 0;
            randomAccessFile.seek(startByte);
            //判断是否到了最后不足2048（buff的length）个byte
            while ((transmitted + len) <= contentLength && (len = randomAccessFile.read(buff)) != -1) {
                outputStream.write(buff, 0, len);
                transmitted += len;
            }
            //处理不足buff.length部分
            if (transmitted < contentLength) {
                len = randomAccessFile.read(buff, 0, (int) (contentLength - transmitted));
                outputStream.write(buff, 0, len);
                transmitted += len;
            }
 
            outputStream.flush();
            response.flushBuffer();
            randomAccessFile.close();
 
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (randomAccessFile != null) {
                    randomAccessFile.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

//		byte[] buff;
//		String range = request.getHeader("Range");
//		logger.debug("范围:"+range);
//		String[] ranges = range.split("=")[1].split("-");
//		logger.debug("切割:"+ranges[0]);
//		logger.debug("切割:"+ranges[1]);
//		Integer size;
//		
//		try (InputStream input = new FileInputStream(fileTemp);OutputStream out = response.getOutputStream();){
//			size = Integer.valueOf(ranges[1])-Integer.valueOf(ranges[0]);
//			logger.debug("size:"+size);
			//response.reset();
			response.setHeader("Accept-Ranges", "bytes");
//			response.setHeader("Content-Range",  "bytes "+Integer.valueOf(ranges[0])+"-"+(Integer.valueOf(ranges[0])+Integer.valueOf(size))+"/"+fileTemp.length());
//			response.setHeader("Content-Length", size.toString());
			//response.setHeader("Content-Type", "application/octet-stream ");
			response.setStatus(206);
			response.setHeader("Content-Type", "video/mp4");
			response.setHeader("Cache-Control", "no-cache");
			response.setHeader("Pragma", "no-cache");
			response.setDateHeader("Expires", -1);
			//请求和响应的信息都不应该被存储在对方的磁盘系统中； 
			response.addHeader( "Cache-Control", "no-store");
			//于客户机的每次请求，代理服务器必须想服务器验证缓存是否过时；
			response.addHeader( "Cache-Control", "must-revalidate");
//			buff = new byte[1024];// 获取文件大小
//			System.out.println("总长"+input.available());
//			int result = Integer.valueOf(ranges[0]);
//			input.read(b, off, len)
//			while(input.read(buff,Integer.valueOf(ranges[0]),1024)!=-1&&result<Integer.valueOf(ranges[1]))
//			{
//				result+=1024;
//				//System.out.println("11111111111111");
//				out.write(buff);
//				
//			}
//			//input.read(buff);
//			out.flush();
//		} catch (Exception e) {
//			throw e;
//		}
		
		
		//return null;
		//HttpHeaders headers = new HttpHeaders();
		//headers.add("Accept-Ranges", "bytes");
		//headers.add("Content-Type", "video/mp4");
//		headers.add("Content-Range", "bytes "+"0"+"-"+fileTemp.length()+"/"+fileTemp.length());
//		headers.add("Content-Length",String.valueOf(fileTemp.length()));
		//headers.add("Content-Range", "bytes "+Integer.valueOf(ranges[0])+"-"+(Integer.valueOf(ranges[0])+Integer.valueOf(size))+"/"+fileTemp.length());
		//headers.add("Content-Length",size.toString());
		//HttpStatus status = HttpStatus.PARTIAL_CONTENT;
		//ResponseEntity<byte[]> entity = new ResponseEntity<byte[]>(buff, headers, status);
		//return entity;
	}

	/**
	 * 获取封面文件
	 */
	@Override
	public ResponseEntity<byte[]> getCover(String coverName) throws Exception {
		String path = PropertiesUtil.getProperty("uploadPath.CoverFilePath");
		String fileName = coverName;
		File file = new File(path + fileName);
		byte[] buff;
		logger.info(path + fileName);
		if (!file.isFile()) {
			file = new File(path + "default.jpg");
		}
		
		try {
			@SuppressWarnings("resource")
			InputStream input = new FileInputStream(file);
			buff = new byte[input.available()]; // 获取文件大小
			input.read(buff);
		} catch (Exception e) {
			throw e;
		}
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Disposition", "attachment;filename=" + fileName);
		HttpStatus status = HttpStatus.OK;
		ResponseEntity<byte[]> entity = new ResponseEntity<byte[]>(buff, headers, status);
		return entity;
	}

	@Override
	public Map getResourcesInfo(String resId) {
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResID", resId);
		return resourcesmapper.getVideoResourcesInfo(map);
	}

	/**
	 * 获取随机推荐资源10条 
	 */
	@Override
	public List<Map> getResourcesRandomList(HttpServletRequest request) {
		String resType = request.getParameter("ResType");
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResType", resType);
		return resourcesmapper.getResourcesRandomList(map);
	}

	/**
	 * 获取用户视频资源10条 
	 */
	@Override
	public List<Map> getUserVideoResourcesList(HttpServletRequest request) {

		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResType", "1");
		map.put("UserID", user.getUserID().toString());
		map.put("Page", request.getParameter("Page"));
		return resourcesmapper.getUserResourcesList(map);
	}

	@Override
	public Integer getUserVideoResourcesCount(HttpServletRequest request) {

		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResType", "1");
		map.put("UserID", user.getUserID().toString());
		return resourcesmapper.getUserResourcesNumber(map);
	}

	@Transactional(readOnly = false)
	@Override
	public void deleteUserResources(HttpServletRequest request) throws IOException {

		String resId = request.getParameter("ResID");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		// 判断资源是否属于当前用户
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResID", resId);
		map.put("UserID", user.getUserID().toString());
		Resources resources = resourcesmapper.findResourcesByResIDAndUserID(map);

		if (resources == null) {
			throw new RuntimeException("Non-user resources");
		}
		logger.info(resources.toString());

		String resFilePath = PropertiesUtil.getProperty("uploadPath.VideoFilePath");
		File resFile = new File(resFilePath + "/" + resources.getResSrc());
		logger.info("Delete File " + resFilePath);

		String resCoverFilePath = PropertiesUtil.getProperty("uploadPath.CoverFilePath");
		File resCoverFile = new File(resCoverFilePath + "/" + resources.getResCoverSrc());
		logger.info("Delete Cover File " + resCoverFile);

		// 删除资源文件夹以及文件夹下目录文件
		if (resFile.isDirectory()) {
			FileUtils.deleteDirectory(resFile);
			logger.info("Delete Directory Success");
		}

		if (resCoverFile.isFile()) {
			FileUtils.deleteQuietly(resCoverFile);
			logger.info("Delete Directory Success");
		}

		// 删除资源表关联的文件表数据
		HashMap<String, String> fileMap = new HashMap<String, String>();
		fileMap.put("ResID", resources.getResID());

		try {
			int result = resourcesmapper.deleteResourcesById(fileMap);
			if (result < 1) {
				throw new RuntimeException("Delete Error");
			}
			result = resourcesmapper.deleteResourcesFileById(fileMap);
			if (result < 1) {
				throw new RuntimeException("Delete Error");
			}

			 commentMapper.deleteCommentById(fileMap);
			resourcesmapper.deleteReportByResID(fileMap);

		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		// 删除资源表数据
		// 删除资源封面文件
	}

	/**
	 * 上传文章资源
	 */
	@Override
	public void uploadArticleResourcesInfo(HttpServletRequest request) {

		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		if (user == null) {
			throw new RuntimeException("User is not logged in");
		}
		String resTitle = request.getParameter("ResTitle");
		String resMark = request.getParameter("ResMark");
		String resHtml = request.getParameter("ResHtml");
		String resLabel = request.getParameter("ResLabel");

		// 检查文本是否输入
		if (resTitle.equals("") || resTitle == null) {
			logger.error("resTitle is null");
			throw new RuntimeException("resTitle is null");
		}

		if (resMark.equals("") || resMark == null) {
			logger.error("resMark is null");
			throw new RuntimeException("resMark is null");
		}

		if (resHtml.equals("") || resHtml == null) {
			logger.error("resHtml is null");
			throw new RuntimeException("resHtml is null");
		}

		if (resLabel.equals("") || resLabel == null) {
			logger.error("resLabel is null");
			throw new RuntimeException("resLabel is null");
		}

		// 获取资源UUID
		String uuid = UUID.randomUUID().toString().replace("-", "").toLowerCase();

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResID", uuid);
		map.put("UserID", user.getUserID().toString());
		map.put("ResTitle", resTitle);
		map.put("ResContent", resHtml);
		map.put("ResMark", resMark);
		map.put("ResSrc", null);
		map.put("ResCoverSrc", null);
		map.put("ResLabel", resLabel);

		try {
			resourcesmapper.insertArticleResource(map);
		} catch (Exception e) {
			logger.info("Add exception");
			throw e;
		}
	}

	/**
	 * 通过资源id获取用户其他的同样类型资源推荐
	 */
	@Override
	public List<Map> getUserResourcesRandomList(String resId) {
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResID", resId);
		return resourcesmapper.getUserResourcesRandomList(map);
	}

	/**
	 * 更新资源点击次数
	 */
	@Override
	public void updataResourcesCheck(HttpServletRequest request) {
		String resId=request.getParameter("ResID");
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResID", resId);
		try {
			int result = resourcesmapper.updataResourcesCheck(map);
			if (result < 1) {
				throw new RuntimeException("Click updates failed");
			}
		} catch (Exception e) {
			throw e;
		}
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		if(user!=null) {
			map.put("UserID", user.getUserID().toString());
			int result = resourcesmapper.findHistoryByUserIDAndResID(map);
			if(result<1) {
				resourcesmapper.insertHistory(map);
			}
			else {
				resourcesmapper.updateHistory(map);
			}
			
		}

	}

	/**
	 * 下载资源接口
	 */
	@Override
	public void downloadResources(String resId, String fileName,HttpServletResponse response) throws Exception {
		
		// 解决下载中文名称文件时出现乱码问题
		response.setHeader("Content-Disposition","attachment;filename="+URLEncoder.encode(fileName,"UTF-8"));
		response.addHeader("Content-Type","application/json;charset=UTF-8");
		
		String filePath = PropertiesUtil.getProperty("uploadPath.VideoFilePath");
		File fileTemp = new File(filePath + "/" + resId + "/" + fileName);
		logger.info("Download:" +filePath + "/" + resId + "/" + fileName);
		if (!fileTemp.isFile()) {
			throw new RuntimeException();
		}
		//try括号内的资源会在try语句结束后自动释放
		//Java7新特性
		 try(
				InputStream is = new FileInputStream(fileTemp);
				OutputStream os = response.getOutputStream();
		){
			int read = 0;
			byte[] bytes = new byte[2048];
			while ((read = is.read(bytes)) != -1)
			os.write(bytes, 0, read);
		}
		
		
	
	}

	@Transactional(readOnly = false)
	@Override
	public void uploadOtherRespircesInfo(HttpServletRequest request) {

		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		List<Map> filelist = (List<Map>) httpSession.getAttribute("FileList");

		String coverType = httpSession.getAttribute("ResourceCoverType").toString();
		String folderName = httpSession.getAttribute("FolderName").toString();
		String resTitle = request.getParameter("ResTitle");
		String resMark = request.getParameter("ResMark");
		String resHtml = request.getParameter("ResHtml");
		String resLabel = request.getParameter("ResLabel");
		String resType = request.getParameter("ResType");
		if (user == null) {
			logger.error("user is null");
			throw new RuntimeException("user is null");
		}

		if (filelist == null) {
			logger.error("filelist is null");
			throw new RuntimeException("filelist is null");
		}
		// 检查空字符
		if (coverType.equals("") || coverType == null) {
			logger.error("coverType is null");
			throw new RuntimeException("coverType is null");
		}

		if (folderName.equals("") || folderName == null) {
			logger.error("folderName is null");
			throw new RuntimeException("folderName is null");
		}

		if (resTitle.equals("") || resTitle == null) {
			logger.error("resTitle is null");
			throw new RuntimeException("resTitle is null");
		}

		if (resMark.equals("") || resMark == null) {
			logger.error("resMark is null");
			throw new RuntimeException("resMark is null");
		}

		if (resHtml.equals("") || resHtml == null) {
			logger.error("resHtml is null");
			throw new RuntimeException("resHtml is null");
		}

		if (resLabel.equals("") || resLabel == null) {
			logger.error("resLabel is null");
			throw new RuntimeException("resLabel is null");
		}
		
		if (resType.equals("") || resType == null) {
			logger.error("resType is null");
			throw new RuntimeException("resType is null");
		}

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResID", folderName);
		map.put("UserID", user.getUserID().toString());
		map.put("ResTitle", resTitle);
		map.put("ResContent", resHtml);
		map.put("ResMark", resMark);
		map.put("ResSrc", folderName);
		map.put("ResCoverSrc", folderName + "." + coverType);
		map.put("ResLabel", resLabel);
		map.put("ResType", resType);

		int result = resourcesmapper.insertOtherResource(map);
		if (result < 0) {
			throw new RuntimeException("Insertion exception");
		}
		for (Map fileMap : filelist) {
			int cycleResult = resourcesmapper.insertFile(fileMap);
			if (result < 0) {
				throw new RuntimeException("Insertion exception");
			}
		}

		// 清理SESSION
		httpSession.removeAttribute("FileList");
		httpSession.removeAttribute("FolderName");
		httpSession.removeAttribute("FileNumber");
		httpSession.removeAttribute("ResourceCoverType");
		logger.info("Session RemoveAttribute");

	}


	@Override
	public List<Map> getOtherResourcesFileMap(String resId) {
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResID", resId);
		return resourcesmapper.getResourcesFileMap(map);
	}

	@Override
	public Integer getUserOtherResourcesCount(HttpServletRequest request) {
		String resType = request.getParameter("ResType");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResType", resType);
		map.put("UserID", user.getUserID().toString());
		return resourcesmapper.getUserResourcesNumber(map);
	}

	@Override
	public List<Map> getUserOtherResourcesList(HttpServletRequest request) {
		String resType = request.getParameter("ResType");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResType", resType );
		map.put("UserID", user.getUserID().toString());
		map.put("Page", request.getParameter("Page"));
		return resourcesmapper.getUserResourcesList(map);
	}

	@Override
	public Integer getUserArticleResourcesCount(HttpServletRequest request) {

		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResType", "2");
		map.put("UserID", user.getUserID().toString());
		return resourcesmapper.getUserResourcesNumber(map);
	}

	@Override
	public List<Map> getUserArticleResourcesList(HttpServletRequest request) {

		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResType", "2");
		map.put("UserID", user.getUserID().toString());
		map.put("Page", request.getParameter("Page"));
		return resourcesmapper.getUserResourcesList(map);
	}

	/**
	 * 删除用户文章资源 不涉及文件删除功能
	 */
	@Transactional(readOnly = false)
	@Override
	public void deleteUserArticleResources(HttpServletRequest request) throws IOException {

		String resId = request.getParameter("ResID");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		// 判断资源是否属于当前用户
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResID", resId);
		map.put("UserID", user.getUserID().toString());
		Resources resources = resourcesmapper.findResourcesByResIDAndUserID(map);

		if (resources == null) {
			throw new RuntimeException("Non-user resources");
		}
		logger.info(resources.toString());

		// 删除资源表关联的文件表数据
		HashMap<String, String> fileMap = new HashMap<String, String>();
		fileMap.put("ResID", resources.getResID());

		try {
			int result = resourcesmapper.deleteResourcesById(fileMap);
			if (result < 1) {
				throw new RuntimeException("Delete Error");
			}
			commentMapper.deleteCommentById(fileMap);
			resourcesmapper.deleteReportByResID(fileMap);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}

	@Override
	public List<Map> getResourcesTypeMap() {
		return resourcesmapper.getResourcesTypeMap();
	}
	
	@Override
	public List<Map> getOtherResourcesTypeMap() {
		return resourcesmapper.getOtherResourcesTypeMap();
	}

	@Override
	public Integer getOPArticleCount(HttpServletRequest request) {

		String resName = request.getParameter("ResName");
		String userID = request.getParameter("UserID");

		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");

		if (user.getUserLevel() != 5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResName", resName);
		map.put("UserID", userID);
		map.put("ResType", "2");

		return resourcesmapper.getOpResourcesCount(map);
	}

	@Override
	public List<Map> getOPArticleList(HttpServletRequest request) {
		String resName = request.getParameter("ResName");
		String userID = request.getParameter("UserID");
		String page = request.getParameter("Page");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");

		if (user.getUserLevel() != 5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResName", resName);
		map.put("UserID", userID);
		map.put("Page", page);
		map.put("ResType", "2");

		return resourcesmapper.getOpResourcesList(map);
	}

	@Override
	public void opDeleteArticleResources(HttpServletRequest request) throws IOException {

		String resId = request.getParameter("ResID");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		// 判断当前用户是否管理员
		if (user.getUserLevel() != 5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}
		logger.info(resId.toString());

		// 删除资源表关联的文件表数据
		HashMap<String, String> fileMap = new HashMap<String, String>();
		fileMap.put("ResID", resId);

		try {
			int result = resourcesmapper.deleteResourcesById(fileMap);
			if (result < 1) {
				throw new RuntimeException("Delete Error");
			}
			commentMapper.deleteCommentById(fileMap);
			
			resourcesmapper.deleteReportByResID(fileMap);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}

	}

	@Override
	public void opDeleteResources(HttpServletRequest request) throws IOException {

		String resId = request.getParameter("ResID");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		// 判断资源是否属于当前用户
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResID", resId);
		Resources resources = resourcesmapper.findResourcesByResID(map);

		if (user.getUserLevel() != 5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}

		if (resources == null) {
			throw new RuntimeException("Non-user resources");
		}
		logger.info(resources.toString());

		String resFilePath = PropertiesUtil.getProperty("uploadPath.VideoFilePath");
		File resFile = new File(resFilePath + "/" + resources.getResSrc());
		logger.info("Delete File " + resFilePath);

		String resCoverFilePath = PropertiesUtil.getProperty("uploadPath.CoverFilePath");
		File resCoverFile = new File(resCoverFilePath + "/" + resources.getResCoverSrc());
		logger.info("Delete Cover File " + resCoverFile);

		// 删除资源文件夹以及文件夹下目录文件
		if (resFile.isDirectory()) {
			FileUtils.deleteDirectory(resFile);
			logger.info("Delete Directory Success");
		}

		if (resCoverFile.isFile()) {
			FileUtils.deleteQuietly(resCoverFile);
			logger.info("Delete Directory Success");
		}

		// 删除资源表关联的文件表数据
		HashMap<String, String> fileMap = new HashMap<String, String>();
		fileMap.put("ResID", resources.getResID());

		try {
			int result = resourcesmapper.deleteResourcesById(fileMap);
			if (result < 1) {
				throw new RuntimeException("Delete Error");
			}
			result = resourcesmapper.deleteResourcesFileById(fileMap);
			if (result < 1) {
				throw new RuntimeException("Delete Error");
			}
			

			commentMapper.deleteCommentById(fileMap);
			
			resourcesmapper.deleteReportByResID(fileMap);

		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		// 删除资源表数据
		// 删除资源封面文件

	}

	@Override
	public Integer getOPVideoCount(HttpServletRequest request) {
		String resName = request.getParameter("ResName");
		String userID = request.getParameter("UserID");

		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");

		if (user.getUserLevel() != 5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResName", resName);
		map.put("UserID", userID);
		map.put("ResType", "1");

		return resourcesmapper.getOpResourcesCount(map);
	}

	@Override
	public List<Map> getOPVideoList(HttpServletRequest request) {
		String resName = request.getParameter("ResName");
		String userID = request.getParameter("UserID");
		String page = request.getParameter("Page");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");

		if (user.getUserLevel() != 5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResName", resName);
		map.put("UserID", userID);
		map.put("Page", page);
		map.put("ResType", "1");

		return resourcesmapper.getOpResourcesList(map);
	}

	@Override
	public Integer getOPOtherCount(HttpServletRequest request) {
		String resName = request.getParameter("ResName");
		String userID = request.getParameter("UserID");
		String resType = request.getParameter("ResType");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");

		if (user.getUserLevel() != 5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResName", resName);
		map.put("UserID", userID);
		map.put("ResType", resType);

		return resourcesmapper.getOpResourcesCount(map);
	}

	@Override
	public List<Map> getOPOtherList(HttpServletRequest request) {
		String resName = request.getParameter("ResName");
		String userID = request.getParameter("UserID");
		String page = request.getParameter("Page");
		String resType = request.getParameter("ResType");
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");

		if (user.getUserLevel() != 5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResName", resName);
		map.put("UserID", userID);
		map.put("Page", page);
		map.put("ResType", resType);

		return resourcesmapper.getOpResourcesList(map);
	}

	@Override
	public List<Map> getResourcesTop5List(HttpServletRequest request) {
		String resType = request.getParameter("ResType");
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResType", resType);
		return resourcesmapper.getResourcesTop5List(map);
	}
	
	@Override
	public void uploadCarouselImg(MultipartHttpServletRequest request) throws IOException {

		String fileName = request.getParameter("FileName");
		String fileSize = request.getParameter("FileSize");
		String md5 = request.getParameter("MD5");
		// 获取文件
		MultipartFile file = request.getFile("File");
		// 获取文件后缀
		String[] strArray = fileName.split("\\.");
		String suffix = strArray[strArray.length - 1];
		// 获取session中用户信息
		HttpSession httpSession = request.getSession();

		// 未登录抛出异常
		User user = (User) httpSession.getAttribute("UserInfo");
		if (user == null) {
			throw new RuntimeException("User is not logged in");
		}
		// 非管理员权限抛出异常
		if (user.getUserLevel() != 5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}

		String uuid = UUID.randomUUID().toString().replace("-", "").toLowerCase();
		// 将文件复制到轮播文件夹中

		String path = PropertiesUtil.getProperty("uploadPath.CarouselFilePath");
		File fileTemp = new File(path + uuid + "." + suffix);

		// 将文件名写入Session中
		httpSession.setAttribute("CarouselImg", uuid + "." + suffix);

		FileUtils.copyInputStreamToFile(file.getInputStream(), fileTemp);

		logger.info("-----------Head-----------");
		logger.info("封面文件名：" + fileName);
		logger.info("封面MD5：" + md5);
		logger.info("封面文件大小：" + fileSize);
		logger.info("-----------End------------");

	}

	@Override
	public void addCarouse(HttpServletRequest request) {

		HttpSession httpSession = request.getSession();
		// 未登录抛出异常
		User user = (User) httpSession.getAttribute("UserInfo");
		if (user == null) {
			throw new RuntimeException("User is not logged in");
		}
		// 非管理员权限抛出异常
		if (user.getUserLevel() != 5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}

		String imgTitle = request.getParameter("ImgTitle");
		String imgIndex = request.getParameter("ImgIndex");
		String link = request.getParameter("Link");
		String carouseImg = (String) httpSession.getAttribute("CarouselImg");
		if (imgIndex.equals("") || imgIndex == null) {
			throw new RuntimeException("Data is empty");
		}
		if (imgTitle.equals("") || imgTitle == null) {
			throw new RuntimeException("Data is empty");
		}
		if (carouseImg.equals("") || carouseImg == null) {
			throw new RuntimeException("Data is empty");
		}

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("NUMBER", imgIndex);
		map.put("IMG_URL", carouseImg);
		map.put("IMG_TITLE", imgTitle);
		map.put("LINK", link);

		try {
			int result = resourcesmapper.insertCarousel(map);
			if (result < 1) {
				throw new RuntimeException("Insert Exception");
			}
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public ResponseEntity<byte[]> getCarousel(String carouselName) throws Exception {
		String path = PropertiesUtil.getProperty("uploadPath.CarouselFilePath");
		String fileName = carouselName;
		File file = new File(path + fileName);
		logger.info(path + fileName);
		if (!file.isFile()) {
			return null;
		}
		byte[] buff;
		try {
			@SuppressWarnings("resource")
			InputStream input = new FileInputStream(file);
			buff = new byte[input.available()]; // 获取文件大小
			input.read(buff);
		} catch (Exception e) {
			throw e;
		}
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Disposition", "attachment;filename=" + fileName);
		HttpStatus status = HttpStatus.OK;
		ResponseEntity<byte[]> entity = new ResponseEntity<byte[]>(buff, headers, status);
		return entity;
	}

	@Override
	public List<Map> getCarouselList() {

		return resourcesmapper.getCarouselList();
	}

	@Override
	public void deleteCarousel(HttpServletRequest request) {

		HttpSession httpSession = request.getSession();
		// 未登录抛出异常
		User user = (User) httpSession.getAttribute("UserInfo");
		if (user == null) {
			throw new RuntimeException("User is not logged in");
		}
		// 非管理员权限抛出异常
		if (user.getUserLevel() != 5) {
			logger.error("Insufficient user level");
			throw new RuntimeException("Insufficient user level");
		}

		String number = request.getParameter("NUMBER");
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("NUMBER", number);
		try {
			int result = resourcesmapper.deleteCarouselByNumber(map);
			if (result < 1) {
				throw new RuntimeException("Delete Exception");
			}
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map> getSearchResourcesList(String searchChar, String check, String time, String page, String pageLength, String resType) {
		String checkSql = null;
		String timeSql = null;

		if (check.equals("most")) {
			checkSql = "DESC";
		}
		if (check.equals("least")) {
			checkSql = "ASC";
		}
		if (time.equals("latest")) {
			timeSql = "DESC";
		}
		if (time.equals("earliest")) {
			timeSql = "ASC";
		}

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("SearchChar", searchChar);
		map.put("Check", checkSql);
		map.put("Time", timeSql);
		map.put("Page", page);
		map.put("PageLength", pageLength);
		map.put("ResType", resType);
		return resourcesmapper.getSearchResourcesList(map);
	}

	@Override
	public Integer getSearchResourcesCount(String searchChar, String check, String time, String resType) {
		String checkSql = null;
		String timeSql = null;

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("SearchChar", searchChar);
		map.put("ResType", resType);
		return resourcesmapper.getSearchResourcesCount(map);
	}

	@Override
	public List<Map> getUserHomeResourcesList(String page, String userID, String resType) {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResType", resType);
		map.put("UserID", userID);
		map.put("Page", page);
		return resourcesmapper.getUserResourcesList(map);
	}

	@Override
	public Integer getUserHomeResourcesCount(String userID, String resType) {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResType", resType);
		map.put("UserID", userID);
		return resourcesmapper.getUserResourcesNumber(map);
	}

	@Override
	public Map getUserResourcesStatistics(String userID) {
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("UserID", userID);
		return resourcesmapper.findUserResourceStatistics(map);
	}
	
	@Override
	public void insertReport(String resID, String reportContent) {
		
		if(resID==null||resID.equals("")) {
			throw new RuntimeException();
		}
		if(reportContent==null||reportContent.equals("")) {
			throw new RuntimeException();
		}
		
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ResID", resID);
		map.put("ReportContent", reportContent);
		try {
			int result = resourcesmapper.insertReport(map);
			if(result <1) {
				throw new RuntimeException();
			}
		} catch (Exception e) {
			throw e;
		}
		
	}
	
	/*
	 * 获取举报条数
	 */
	@Override
	public Integer getReportCount(HttpServletRequest request) {
		String resTitle = request.getParameter("ResTitle");
		String repContent = request.getParameter("RepContent");
		String resType = request.getParameter("ResType");
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ReportContent", repContent);
		map.put("ResTitle", resTitle);
		map.put("ResType", resType);
		return resourcesmapper.getReportCount(map);
	}
	/*
	 * 获取举报列表
	 */
	@Override
	public List<Map> getReportList(HttpServletRequest request) {
		String resTitle = request.getParameter("ResTitle");
		String repContent = request.getParameter("RepContent");
		String resType = request.getParameter("ResType");
		String page = request.getParameter("Page");
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("ReportContent", repContent);
		map.put("ResTitle", resTitle);
		map.put("ResType", resType);
		map.put("Page", page);
		return resourcesmapper.getReportList(map);
	}
	
	@Override
	public void opDeleteReport(HttpServletRequest request) {
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		
		if(user.getUserLevel()!=5) {
			throw new RuntimeException("");
		}
		
		String repID = request.getParameter("ReportID");
		HashMap<String, String> map = new HashMap<String, String>();
		
		map.put("ReportID", repID);
		
		try {
			int result = resourcesmapper.deleteReport(map);
			if(result<1) {
				throw new RuntimeException();
			}
		} catch (Exception e) {
			throw e;
		} 
	}
	
	@Override
	public List<Map> getHistoryList(HttpServletRequest request) {
		HttpSession httpSession = request.getSession();
		User user = (User) httpSession.getAttribute("UserInfo");
		if(user==null) {
			throw new RuntimeException();
		}
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("UserID", user.getUserID().toString());
		return resourcesmapper.selectHistory(map);
	}
	
}
