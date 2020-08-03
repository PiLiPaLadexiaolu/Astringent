package vip.pilipala.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.google.gson.Gson;

import vip.pilipala.utils.GsonUtil;
/**
 * 该控制类用于返回视图操作请求方法均为GET
 * @author PiLiPaLa
 *
 */
@Controller
public class ViewController{
	
	private Logger logger = LoggerFactory.getLogger(this.getClass());
	
	/**
	 * 返回login.html视图
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/login.html", method = RequestMethod.GET)
	private String viewIndex0001(Model model) {
		logger.info("Logger Messages ViewController viewIndex0001 Execute");
		return "login";
	}
	
	@RequestMapping(value = "/home.html", method = RequestMethod.GET)
	private String viewIndex0002(Model model) {
		logger.info("Logger Messages ViewController viewIndex0002 Execute");
		return "home";
	}
	
	@RequestMapping(value = "/video.html", method = RequestMethod.GET)
	private String viewIndex0003(Model model) {
		logger.info("Logger Messages ViewController viewIndex0003 Execute");
		return "videoPlay";
	}
	
	@RequestMapping(value = "/article.html", method = RequestMethod.GET)
	private String viewIndex0004(Model model) {
		logger.info("Logger Messages ViewController viewIndex0004 Execute");
		return "articlePage";
	}
	
	@RequestMapping(value = "/404.html", method = RequestMethod.GET)
	private String viewIndex0005(Model model) {
		logger.info("Logger Messages ViewController viewIndex0005 Execute");
		return "404";
	}
	
	@RequestMapping(value = "/500.html", method = RequestMethod.GET)
	private String viewIndex0006(Model model) {
		logger.info("Logger Messages ViewController viewIndex0006 Execute");
		return "500";
	}
	
	@RequestMapping(value = "/other.html", method = RequestMethod.GET)
	private String viewIndex0007(Model model) {
		logger.info("Logger Messages ViewController viewIndex0007 Execute");
		return "otherPage";
	}
	
	@RequestMapping(value = "/index.html", method = RequestMethod.GET)
	private String viewIndex0008(Model model) {
		logger.info("Logger Messages ViewController viewIndex0008 Execute");
		return "index";
	}
	
	@RequestMapping(value = "/search.html", method = RequestMethod.GET)
	private String viewIndex0009(Model model) {
		logger.info("Logger Messages ViewController viewIndex0009 Execute");
		return "searchPage";
	}
	@RequestMapping(value = "/user.html", method = RequestMethod.GET)
	private String viewIndex0010(Model model) {
		logger.info("Logger Messages ViewController viewIndex0010 Execute");
		return "userPage";
	}
	
	
}
