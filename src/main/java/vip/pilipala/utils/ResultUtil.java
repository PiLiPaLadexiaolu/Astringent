package vip.pilipala.utils;
/**
 * 
 * @author PiLiPaLa
 *
 * @param <T>
 */
public class ResultUtil<T> {
	
	//{"code":0,"msg":"ok","message":"ok","data":[]}
	
	private String code;
	private String msg;
	private String message;
	private T data;
	
	public static ResultUtil<String> SUCCESS() {
		return new ResultUtil<String>("0", "ok", "ok", null);
	}
	
	public static ResultUtil<String> FAILURE() {
		return new ResultUtil<String>("1", "error", "error", null);
	}
	
	public static <D> ResultUtil<D> SUCCESS(D data) {
		return new ResultUtil<D>("0", "ok", "ok", data);
	}
	
	public static <D> ResultUtil<D> FAILURE(D data) {
		return new ResultUtil<D>("1", "error", "error", data);
	}
	
	
	public ResultUtil() {
		
	}

	public ResultUtil(String code, String msg, String message, T data) {
		this.code = code;
		this.msg = msg;
		this.message = message;
		this.data = data;
	}
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public T getData() {
		return data;
	}
	public void setData(T data) {
		this.data = data;
	}
	
	
}
