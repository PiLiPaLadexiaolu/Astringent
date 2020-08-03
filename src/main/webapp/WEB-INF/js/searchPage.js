
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
			searchChar:'',
			heat:'',
			time:'',
			tabs:'video',
			resList:{},
			resCount:null,
			pageSize:15,
		},
		methods: {
			china: function () {
				//动态修改更改语言
				i18n.locale = 'zh';
			},
			english: function () {
				//动态修改更改语言
				i18n.locale = 'en';
			},
			searchEvents:function() {
				window.open("search.html?name="+this.resources, "_blank");
			},
			searchBtn:function() {
				
				if(this.tabs=='video') {
					this.getSearchResList(0,1);
					this.getSearchResCount(1);
				}
				if(this.tabs=='other') {
					this.getSearchResList(0,3);
					this.getSearchResCount(3);
				}
				if(this.tabs=='article') {
					this.getSearchResList(0,2);
					this.getSearchResCount(2);
				}
				if(this.tabs=='book') {
					this.getSearchResList(0,4);
					this.getSearchResCount(4);
				}
				if(this.tabs=='software') {
					this.getSearchResList(0,5);
					this.getSearchResCount(5);
				}
				if(this.tabs=='code') {
					this.getSearchResList(0,6);
					this.getSearchResCount(6);
				}
				
			},
			userOut:function() {
				axios.get('userOut',null,{
				}).then(res=>{
					if(res.data.code!=1) {
						this.$Notice.open({
							title: '退出成功！',
							desc: '即将跳转！',
							//显示时间两秒
							duration: 2
						});  
						//两秒刷新页面
						setTimeout("window.location.reload()", 2000);
					}else {
						
					}
				}).catch(err=>{
					
				});
			},
			tabClick:function(value) {
				console.log(value);
				if(value=='video') {
					this.getSearchResList(0,1);
					this.getSearchResCount(1);
					//改变URL
					var url = window.location.href;
					var valiable = url.split("?")[0];
					window.history.pushState({},0,valiable+'?label=video');
				}
				if(value=='other') {
					this.getSearchResList(0,3);
					this.getSearchResCount(3);
					//改变URL
					var url = window.location.href;
					var valiable = url.split("?")[0];
					window.history.pushState({},0,valiable+'?label=other');
				}
				if(value=='article') {
					this.getSearchResList(0,2);
					this.getSearchResCount(2);
					//改变URL
					var url = window.location.href;
					var valiable = url.split("?")[0];
					window.history.pushState({},0,valiable+'?label=article');
				}
				if(value=='software') {
					this.getSearchResList(0,5);
					this.getSearchResCount(5);
					//改变URL
					var url = window.location.href;
					var valiable = url.split("?")[0];
					window.history.pushState({},0,valiable+'?label=software');
				}
				if(value=='book') {
					this.getSearchResList(0,4);
					this.getSearchResCount(4);
					//改变URL
					var url = window.location.href;
					var valiable = url.split("?")[0];
					window.history.pushState({},0,valiable+'?label=book');
				}
				if(value=='code') {
					this.getSearchResList(0,6);
					this.getSearchResCount(6);
					//改变URL
					var url = window.location.href;
					var valiable = url.split("?")[0];
					window.history.pushState({},0,valiable+'?label=code');
				}
				return value;
			},
			getQueryString:function (name) {
				//解决中文乱码问题
				let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				let r = window.location.search.substr(1).match(reg);
				if (r != null) {
					return decodeURI(r[2]);
				};
				return null;
			},
			getUserInfo:function() {
				let isurl='userInfo';
				axios.get(isurl,null,{
					header:{'Content-Type':'application/x-www-form-urlencoded'}
				}).then(res=>{
					if(res.data.code!=0) {
						this.$Notice.open({
							title: '你没有登录',
							desc: '快去登录吧!',
							//显示时间两秒
							duration: 2
						});  
					}else {
						this.name=res.data.data.userName;
					}
				}).catch(err=>{
					
				});
			},
			getSearchResList:function(value,type) {
				let isurl='getSearchResourcesList';
				axios.get(isurl, {
					params: {
						Check:this.heat,
						Time:this.time,
						Page:value,
						PageLength:this.pageSize,
						ResType:type,
						SearchChar:this.searchChar,
					}
				}).then(res=>{
					this.resList = res.data.data;
				}).catch(err=>{
					
				});
			},
			
			PageDown:function(value) {
				this.pageNumber=value;
				this.$Message.info(this.pageNumber+'页');
				
				if(this.tabs=='video') {
					this.getSearchResList((value-1)*15,1);
					this.getSearchResCount(1);
				}
				if(this.tabs=='other') {
					this.getSearchResList((value-1)*15,3);
					this.getSearchResCount(3);
				}
				if(this.tabs=='article') {
					this.getSearchResList((value-1)*15,2);
					this.getSearchResCount(2);
				}
				if(this.tabs=='book') {
					this.getSearchResList((value-1)*15,4);
					this.getSearchResCount(4);
				}
				if(this.tabs=='software') {
					this.getSearchResList((value-1)*15,5);
					this.getSearchResCount(5);
				}
				if(this.tabs=='code') {
					this.getSearchResList((value-1)*15,6);
					this.getSearchResCount(6);
				}
			},
			getSearchResCount:function(type) {
				let isurl='getSearchResourcesCount';
				axios.get(isurl, {
					params: {
						Check:this.heat,
						Time:this.time,
						ResType:type,
						SearchChar:this.searchChar,
					}
				}).then(res=>{
					this.resCount=res.data.data;
				}).catch(err=>{
					
				});
			},
		},
		mounted() {
			//该函数会在页面加载时调用
			var str = this.getQueryString("name");
			this.searchChar = str;
			
			if(str==''||str==null) {
				this.searchChar = '';
			}
			this.getUserInfo();
			
			var lab = this.getQueryString("label");
			this.tabs =lab;
			
			if(lab==''||lab==null) {
				this.tabs = 'video';
				var url = window.location.href;
				var valiable = url.split("?")[0];
				window.history.pushState({},0,valiable+'?label=video');
			}
			
			this.searchBtn();
		}
	});
