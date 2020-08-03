package vip.pilipala.model;

import java.util.Date;

public class Resources {
	
	private String resID;
	private long userID;
	private String resTitle;
	private String resLabel;
	private String resContent;
	private String resMarkDown;
	private String resSrc;
	private String resCoverSrc;
	private Date uploadTime;
	private long checkNumber;
	private int resType;
	public String getResID() {
		return resID;
	}
	public void setResID(String resID) {
		this.resID = resID;
	}
	public long getUserID() {
		return userID;
	}
	public void setUserID(long userID) {
		this.userID = userID;
	}
	public String getResTitle() {
		return resTitle;
	}
	public void setResTitle(String resTitle) {
		this.resTitle = resTitle;
	}
	public String getResLabel() {
		return resLabel;
	}
	public void setResLabel(String resLabel) {
		this.resLabel = resLabel;
	}
	public String getResContent() {
		return resContent;
	}
	public void setResContent(String resContent) {
		this.resContent = resContent;
	}
	public String getResMarkDown() {
		return resMarkDown;
	}
	public void setResMarkDown(String resMarkDown) {
		this.resMarkDown = resMarkDown;
	}
	public String getResSrc() {
		return resSrc;
	}
	public void setResSrc(String resSrc) {
		this.resSrc = resSrc;
	}
	public String getResCoverSrc() {
		return resCoverSrc;
	}
	public void setResCoverSrc(String resCoverSrc) {
		this.resCoverSrc = resCoverSrc;
	}
	public Date getUploadTime() {
		return uploadTime;
	}
	public void setUploadTime(Date uploadTime) {
		this.uploadTime = uploadTime;
	}
	public long getCheckNumber() {
		return checkNumber;
	}
	public void setCheckNumber(long checkNumber) {
		this.checkNumber = checkNumber;
	}
	public int getResType() {
		return resType;
	}
	public void setResType(int resType) {
		this.resType = resType;
	}
	public Resources(String resID, long userID, String resTitle, String resLabel, String resContent, String resMarkDown,
			String resSrc, String resCoverSrc, Date uploadTime, long checkNumber, int resType) {
		this.resID = resID;
		this.userID = userID;
		this.resTitle = resTitle;
		this.resLabel = resLabel;
		this.resContent = resContent;
		this.resMarkDown = resMarkDown;
		this.resSrc = resSrc;
		this.resCoverSrc = resCoverSrc;
		this.uploadTime = uploadTime;
		this.checkNumber = checkNumber;
		this.resType = resType;
	}
	
	public Resources() {
		
	}
	
	@Override
	public String toString() {
		return "Resources [resID=" + resID + ", userID=" + userID + ", resTitle=" + resTitle + ", resLabel=" + resLabel
				+ ", resContent=" + resContent + ", resMarkDown=" + resMarkDown + ", resSrc=" + resSrc
				+ ", resCoverSrc=" + resCoverSrc + ", uploadTime=" + uploadTime + ", checkNumber=" + checkNumber
				+ ", resType=" + resType + "]";
	}
	
	
}
