
	//国际化
	console.clear();
	const messages = {
		en: {
			message: {
			}
		},
		zh: {
			message: {
			}
		}
	}
	// 通过选项创建 VueI18n 实例
	const i18n = new VueI18n({
	locale: 'zh', // 设置地区
	messages, // 设置地区信息
	});
	
	// 创建 Vue 实例
	new Vue({
		i18n:i18n,
		el: '#app',
		data: {
			name:'',
			resources:'',
			resourcesType:'',
			userHomeInfo:'',
			attentionStatus:false,
			resList:{},
			resCount:0,
			tabs:'video',
			pageSize:10,
			userID:'',
		},
		methods: {
			china: function () {
				// 动态修改更改语言
				i18n.locale = 'zh';
			},
			english: function () {
				// 动态修改更改语言
				i18n.locale = 'en';
			},
			searchEvents:function() {
				window.open("search.html?name="+this.resources, "_blank");
			},
			userOut:function() {
				axios.get('userOut',null,{
				}).then(res=>{
					if(res.data.code!=1) {
						this.$Notice.open({
							title: '退出成功！',
							desc: '即将跳转！',
							// 显示时间两秒
							duration: 2
						});  
						// 两秒刷新页面
						setTimeout("window.location.reload()", 2000);
					}else {
						
					}
				}).catch(err=>{
					
				});
			},
			getUserInfo:function() {
				let isurl='userInfo';
				axios.get(isurl,null,{header:{'Content-Type':'application/x-www-form-urlencoded'}
				}).then(res=>{
					if(res.data.code!=0) {
						this.$Notice.open({
							title: '你没有登录',
							desc: '快去登录吧!',
							// 显示时间两秒
							duration: 2
						});
					}else {
						this.name=res.data.data.userName;
					}
				}).catch(err=>{
			
				});
			},
			getQueryString:function (name) {
				// 解决中文乱码问题
				let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				let r = window.location.search.substr(1).match(reg);
				if (r != null) {
					return decodeURI(r[2]);
				};
					return null;
			},
			getUserHomePageInfo:function(value) {
				let isurl='getUserHomePageInfo';
				axios.get(isurl, {
					params: {
						UserID:value,
					}
				}).then(res=>{
					this.userHomeInfo=res.data.data;
				}).catch(err=>{
					
				});
			},
			attentionLab:function() {
				if(this.attentionStatus==false) {
					let isurl='attention';
					let map={
						UserID:this.userHomeInfo.USER_ID,
					};
					axios.post(isurl,Qs.stringify(map),{
						header:{
							'Content-Type':'application/x-www-form-urlencoded'
					}
					}).then(res=>{
						if(res.data.code=='0') {
							this.$Message.info('关注成功！');
							this.attentionStatus=!this.attentionStatus;
						} else {
							this.$Message.info('你没有登录无法关注！');
						}
					}).catch(err=>{
						
					});
				}
				else {
					axios.delete('attention',{params: {UserID: this.userHomeInfo.USER_ID,}
					}).then(res=>{
						this.$Message.info('取消关注！');
						this.attentionStatus=!this.attentionStatus;
					}).catch(err=>{
						
					});
					
				}
			},
			getAttentionStatus:function(value) {
				axios.get('attention', {
					params: {
						UserID:value,
					}
				}).then(res=>{
					if(res.data.data==1) {
						this.attentionStatus=true;
					}
					else {
						this.attentionStatus=false;
					}	
				}).catch(err=>{
					
				});  
			},
			getUserResList:function(page,userID,resType) {
				axios.get('getUserHomeResourcesList',{params: {Page: page,UserID: userID,ResType: resType,}
				}).then(res=>{
					this.resList=res.data.data;
				}).catch(err=>{
				
				});
			},
			getUserResCount:function(value,resType) {
				axios.get('getUserHomeResourcesCount',{params: {UserID: value,ResType: resType,}},{header:{'Content-Type':'application/x-www-form-urlencoded'}
				}).then(res=>{
					this.resCount=res.data.data;
				}).catch(err=>{
				
				});
			},
			PageDown:function(value) {
				this.pageNumber=value;
				this.$Message.info('当前页面:'+this.pageNumber+'页');
				if(this.tabs=='video') {
					this.getUserResList((value-1)*10,this.userID,1);
					this.getUserResCount(this.userID,1);
				}
				if(this.tabs=='other') {
					this.getUserResList((value-1)*10,this.userID,3);
					this.getUserResCount(this.userID,3);
				}
				if(this.tabs=='article') {
					this.getUserResList((value-1)*10,this.userID,2);
					this.getUserResCount(this.userID,2);
				}
				if(this.tabs=='book') {
					this.getUserResList((value-1)*10,this.userID,4);
					this.getUserResCount(this.userID,4);
				}
				if(this.tabs=='software') {
					this.getUserResList((value-1)*10,this.userID,5);
					this.getUserResCount(this.userID,5);
				}
				if(this.tabs=='code') {
					this.getUserResList((value-1)*10,this.userID,6);
					this.getUserResCount(this.userID,6);
				}
				
			},
			tabClick:function(value) {
				console.log(value);
				var str = this.getQueryString("name");
				if(value=='video') {
					this.getUserResList(0,this.userID,1);
					this.getUserResCount(this.userID,1);
				}
				if(value=='video') {
					this.getUserResList(0,this.userID,1);
					this.getUserResCount(this.userID,1);
				}
				if(value=='article') {
					this.getUserResList(0,this.userID,2);
					this.getUserResCount(this.userID,2);
				}
				if(value=='other') {
					this.getUserResList(0,this.userID,3);
					this.getUserResCount(this.userID,3);
				}
				if(value=='book') {
					this.getUserResList(0,this.userID,4);
					this.getUserResCount(this.userID,4);
				}
				if(value=='software') {
					this.getUserResList(0,this.userID,5);
					this.getUserResCount(this.userID,5);
				}
				if(value=='code') {
					this.getUserResList(0,this.userID,6);
					this.getUserResCount(this.userID,6);
				}
				return value;
			},
		},
		mounted() {
			// 该函数会在页面加载时调用
			this.getUserInfo();
			var str = this.getQueryString("name");
			this.userID=str;
			this.getUserHomePageInfo(this.userID);
			this.getAttentionStatus(this.userID);
			this.getUserResList(0,this.userID,1);
			this.getUserResCount(this.userID,1);
			
		}
	});
