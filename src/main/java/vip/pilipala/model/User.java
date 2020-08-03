package vip.pilipala.model;

public class User {
	
	private Long userID;
	private String userName;
	private String userPassword;
	private String userEmail;
	private int userLevel;
	private String userDescription;
	
	public User(Long userID, String userName, String userPassword, String userEmail, int userLevel,
			String userDescription) {
		this.userID = userID;
		this.userName = userName;
		this.userPassword = userPassword;
		this.userEmail = userEmail;
		this.userLevel = userLevel;
		this.userDescription = userDescription;
	}
	
	public User() {
		
	}
	
	public Long getUserID() {
		return userID;
	}
	public void setUserID(Long userID) {
		this.userID = userID;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getUserPassword() {
		return userPassword;
	}
	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}
	public String getUserEmail() {
		return userEmail;
	}
	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}
	public int getUserLevel() {
		return userLevel;
	}
	public void setUserLevel(int userLevel) {
		this.userLevel = userLevel;
	}
	public String getUserDescription() {
		return userDescription;
	}
	public void setUserDescription(String userDescription) {
		this.userDescription = userDescription;
	}
	
	@Override
	public String toString() {
		return "User [userID=" + userID + ", userName=" + userName + ", userPassword=" + userPassword + ", userEmail="
				+ userEmail + ", userLevel=" + userLevel + ", userDescription=" + userDescription + "]";
	}
	
	
	
	
}
