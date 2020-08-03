
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

	const router = new VueRouter({
		routes:[
			{
                path:'/reportManagement',
                component:{
                    methods: {
                        getResourcesTypeMap:function() {
                            axios.get('getResourcesTypeMap',{params: {}
                            }).then(res=>{
                                  this.resourceType=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        searchBtn:function(value) {
                        	axios.get('opGetReportList',{params: {
                        		ResTitle:this.resourceName,
                        		ReportContent:this.reportContent,
                        		ResType:this.selectResourceType,
                        		Page:0,
                        	}
                            }).then(res=>{
                                  this.reportList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        	
                        	axios.get('opGetReportCount',{params: {
                        		ResTitle:this.resourceName,
                        		ReportContent:this.reportContent,
                        		ResType:this.selectResourceType,
                        		}
                            }).then(res=>{
                                  this.reportNumber=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        clearBtn:function() {
                        	this.selectResourceType=null;
                        	this.resourceName=null;
                        	this.reportContent=null;
                        	this.searchBtn(1);
                        },
                        PageDown:function(value) {
                        	this.pageNumber=value;
                        	this.$Message.info('当前页面:'+this.pageNumber+'页');
                        	axios.get('opGetReportList',{params: {
                        		ResName:this.resourceName,
                        		ReportContent:this.reportContent,
                        		ResType:this.selectResourceType,
                        		Page:(value-1)*10,
                        	}
                            }).then(res=>{
                                  this.reportList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        	
                        	axios.get('opGetReportCount',{params: {
                        		ResName:this.resourceName,
                        		ReportContent:this.reportContent,
                        		ResType:this.selectResourceType,
                        		}
                            }).then(res=>{
                                  this.reportNumber=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        deleteBtn:function(value) {
                        	this.$Modal.confirm({
                        		title:"你确定要以管理员身份删除这个评论吗？",
                        		content:"被删除的评论不能被找回奥！",
                        		closable:true,
                        		onOk: () => {
                        			console.log("删除了"+value);
                        			axios.delete('opReport',{params: {ReportID: value}
                                    }).then(res=>{
                                    	this.searchBtn();
                                    }).catch(err=>{
                                     
                                    });
                                },
                        		onCancel: () => {
                        			console.log("点击了取消");
                        		}
                        	});
                        },
                        deleteResBtn:function(value,type) {
                        	this.$Modal.confirm({
                        		title:"你确定要以管理员身份删除这个资源吗？",
                        		content:"被删除的资源不能被找回奥！",
                        		closable:true,
                        		onOk: () => {
                        			console.log("删除了"+value);
                        			if(type=='4') {
                        				axios.delete('opArticleResource',{params: {ResID: value}
                                        }).then(res=>{
                                        	this.searchBtn();
                                        }).catch(err=>{
                                         
                                        });
                        			}else {
                        				axios.delete('opResource',{params: {ResID: value}
                                        }).then(res=>{
                                        	this.searchBtn();
                                        }).catch(err=>{
                                         
                                        });
                        			}
                        			
                                },
                        		onCancel: () => {
                        			console.log("点击了取消");
                        		}
                        	});
                        },
                    },
                    data: function () {
                        return {
                        	resourceName:'',
                        	reportContent:'',
                        	resourceType:[],
                        	selectResourceType:'',
                        	reportList:{},
                        	reportNumber:null,
                        	pageNumber:1,
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        this.getResourcesTypeMap();
                        this.searchBtn();
                    },
                    template:
                    '<div v-bind:class="reportNumber!=0 ? \'content-card\':\'content-background-card\'">'+
                        '<divider><h1 class="font-type">(管理员)举报管理</h1></divider>'+
                        '<div class="card-900-body">'+
                            '<div class="card-row">'+
                                '<row>'+
                                    '<i-col span="6">'+
                                      
                                        '<Input v-model="resourceName" style="width: 160px" placeholder="请输入资源名称关键字" />'+
                                    '</i-col >'+
                                    '<i-col span="6">'+
                          
                                        '<Input v-model="reportContent" style="width: 160px" placeholder="请输入举报关键字" />'+
                                    '</i-col >'+
                                    '<i-col span="6">'+
                                     
                                        '<i-select v-model="selectResourceType" style="width:160px">'+
                                            '<i-option v-for="item in resourceType" :value="item.DATA_ID" :key="item.DATA_ID">{{ item.DATA_INFO }}</i-option>'+
                                        '</i-select>'+
                                    '</i-col >'+
                                    '<i-col span="3">'+
                                        '<span>'+
                                            '<i-button type="primary" class="button-ordinary" style="width:90px" @click="searchBtn" icon="md-search">Search</i-button>'+
                                        '</span>'+
                                    '</i-col >'+
                                    
                                    '<i-col span="3">'+
                                    
                                        '<span>'+
                                            '<i-button type="primary" class="button-ordinary" style="width:90px" @click="clearBtn" icon="md-close">Clear</i-button>'+
                                        '</span>'+
                                    '</i-col >'+
                                '</row>'+
                            '</div>'+
                            '<div>'+
                                '<List>'+
                                    '<ListItem v-for="item in reportList" :key="item.RES_ID">'+
                                        '<ListItemMeta :title="item.RESOURCES_TITLE" :description="\'举报内容:\'+item.REPORT_CONTENT" />'+
                                        '<template slot="action">'+
                                            '<li>'+
                                                '<p>{{item.REPORT_TIME}}</p>'+
                                            '</li>'+
                                            '<li>'+
                                            	'<a class="a-ordinary" :href="\'user.html?name=\'+item.USER_ID">查看用户</a>'+
                                            '</li>'+
                                            '<li>'+
                                            '<a class="a-ordinary" @click="deleteResBtn(item.RES_ID,item.RESOURCES_TYPE)">删除此资源</a>'+
                                            '</li>'+
                                            '<li v-if="item.RESOURCES_TYPE == \'1\'">'+
                                                '<a class="a-ordinary" :href="\'video.html?name=\'+item.RES_ID">查看资源</a>'+
                                            '</li>'+
                                            '<li v-else-if="item.RESOURCES_TYPE == \'2\'">'+
                                                '<a class="a-ordinary" :href="\'article.html?name=\'+item.RES_ID">查看资源</a>'+
                                            '</li>'+
                                            '<li v-else>'+
                                                '<a class="a-ordinary" :href="\'other.html?name=\'+item.RES_ID">查看资源</a>'+
                                            '</li>'+
                                            '<li>'+
                                            '<a class="a-ordinary" @click="deleteBtn(item.REPORT_ID)">删除此举报信息</a>'+
                                        '</li>'+
                                        '</template>'+
                                    '</ListItem>'+
                                '</List>'+
                            '</div>'+
                            '<div style="text-align: center; margin-top: 30px;" v-show="reportNumber==0">'+
								'<p>没有这种举报信息哟!</p>'+
							'</div>'+
                            '<div class="card-row" style="text-align:center;" v-show="reportNumber>10">'+
                                '<Page :total="reportNumber" :current="pageNumber" @on-change="PageDown" />' +
                            '</div>'+
                        '</div>'+
                    '</div>'
                    
                }
            },
			{
                path:'/opUserManagement',
                component:{
                    methods: {
                    	
                    	PageDown:function(value) {
                        	this.pageNumber=value;
                        	this.$Message.info('当前页面:'+this.pageNumber+'页');
                        	this.getUserList((value-1)*10);
                        	this.getUserCount();
                        },
                        getUserList:function(value){
                        	axios.get('opGetUserList',{params: {
                        		Page:value,
                        		UserID:this.userID,
                        		UserName:this.userName,
                        		UserEmail:this.userEmail,
                        		UserLeveL:this.userLevel,
                        	}
                            }).then(res=>{
                                  this.userList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        getUserCount:function(){
                        	axios.get('opGetUserCount',{params: {
                        		UserID:this.userID,
                        		UserName:this.userName,
                        		UserEmail:this.userEmail,
                        		UserLeveL:this.userLevel,
                        	}
                            }).then(res=>{
                                  this.userNumber=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        searchBtn:function() {
                        	this.getUserCount();
                            this.getUserList(0);
                        },
                        clearBtn:function() {
                        	this.userID=null,
                        	this.userName=null,
                        	this.userEmail=null,
                        	this.userLevel=null;
                        	this.getUserCount();
                            this.getUserList(0);
                        },
                        updata (index) {
                        	
                            this.$Modal.info({
                                title: '用户详细信息',
                                content: `用户ID：${this.attentionList[index].USER_ID} </br> 用户名：${this.attentionList[index].USER_NAME} </br> 关注时间：${this.attentionList[index].FOLLOWED_TIME} </br> 被关注ID：${this.attentionList[index].USER_FOLLOWED} </br> 被关注用户名：${this.attentionList[index].FOLLOWED_NAME} </br>`
                            })
                        },
                        getUserLevelList: function() {
            				axios.get('getUserLevelList',{params: null},{header:{'Content-Type':'application/x-www-form-urlencoded'}
							}).then(res=>{
								this.userLevelList=res.data.data;
							}).catch(err=>{
						
							});
            			},
                        remove (index) {
                            this.$Modal.confirm({
								title:"你确定要以管理员身份注销该用户吗？",
								content:"被删除的用户不能被找回奥！",
								closable:true,
								onOk: () => {
									axios.delete('opUser',{params: {
										UserID: this.userList[index].USER_ID,
										}
									}).then(res=>{
										if(res.data.code == '0') {
										this.$Notice.success({
	                            			title: '删除成功!',
	                            			desc: '接下来干什么呢?',
	                            			duration: 2,
	                            		});
										}else {
											this.$Notice.error({
		                            			title: '删除失败!',
		                            			desc: '管理员无法注销,或被注销用户有其他关联数据未被清除!',
		                            			duration: 5,
		                            		});
										}
										this.getUserList(0);
			                        	this.getUserCount();
									}).catch(err=>{
										
									});
                                },
                        		onCancel: () => {
                        			console.log("点击了取消");
                        		}
                        	});
                        }
                    },
                    data: function () {
                        return {
                        	userID:null,
                        	userName:null,
                        	userEmail:null,
                        	userLevel:null,
                        	userList:[],
                        	userNumber:null,
                        	pageNumber:1,
                        	userLevelList:[],
                        	
                        	 columns2: [
                        		 {
                                     title: '用户ID',
                                     slot: 'USER_ID'
                                 },
                                 {
                                     title: '用户名',
                                     key: 'USER_NAME'
                                 },
                                 {
                                     title: '用户邮箱',
                                     key: 'USER_EMAIL'
                                 },
                                 {
                                     title: '用户个人描述',
                                     key: 'USER_DESCRIPTION'
                                 },
                                 {
                                     title: '用户等级',
                                     key: 'USER_LEVEL_INFO'
                                 },
                                 {
                                     title: '操作',
                                     slot: 'action',
                                     width: 250,
                                     align: 'center'
                                 }
                             ],
 
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        this.getUserLevelList();
                        this.getUserCount();
                        this.getUserList(0);
                        
                    },
                    template:
                    '<div v-bind:class="userNumber!=0? \'content-card\':\'content-card\'">'+
                        '<divider><h1 class="font-type">(管理员)用户管理</h1></divider>'+
                        '<div class="card-1150-body">'+
                        '<div class="card-row">'+
                            '<row>'+
                                '<i-col span="5">'+
                                    '<Input v-model="userID" style="width: 160px" placeholder="用户ID" />'+
                                '</i-col >'+
                                '<i-col span="5">'+
                                    '<Input v-model="userName" style="width: 160px" placeholder="用户名" />'+
                                '</i-col >'+
                                '<i-col span="5">'+
                                    '<Input v-model="userEmail" style="width: 160px" placeholder="用户邮箱" />'+
                                '</i-col >'+
                                '<i-col span="5">'+
		                           '<i-select v-model="userLevel" style="width:160px" placeholder="用户等级">'+
		                           		'<i-option v-for="item in userLevelList" :value="item.LEVEL_ID" :key="item.LEVEL_ID">{{ item.LEVEL_INFO }}</i-option>'+
		                           	'</i-select>'+
		                        '</i-col >'+
                                '<i-col span="2">'+
                                    '<span>'+
                                        '<i-button type="primary" class="button-ordinary" style="width:90px" @click="searchBtn" icon="md-search">Search</i-button>'+
                                    '</span>'+
                                '</i-col >'+
                                '<i-col span="2">'+
                                    '<span>'+
                                        '<i-button type="primary" class="button-ordinary" style="width:90px" @click="clearBtn" icon="md-close">Clear</i-button>'+
                                    '</span>'+
                                '</i-col >'+
                            '</row>'+
                        '</div>'+
                        '<div class="card-row">'+
	                        '<i-table border :columns="columns2" :data="userList">'+
		                        '<template slot-scope="{ row }" slot="USER_ID">'+
		                        	'<strong>{{ row.USER_ID }}</strong>'+
		                        '</template>'+
		                        '<template slot-scope="{ row, index }" slot="action">'+
			                        '<i-button type="error" size="small" @click="remove(index)">注销用户</i-button>'+
		                        '</template>'+
	                        '</i-table>'+
                        '</div>'+
						'<div style="text-align: center; margin-top: 30px;" v-show="userNumber>10">'+
							'<page :total="userNumber" @on-change="PageDown" show-elevator ></page>'+
						'</div>'+
                    '</div>'+
                 '</div>'
                }
            },
			{
                path:'/opAddUser',
                component: 
                {
                    methods: {
                    	emailVerificationCheck: function() {
                    		var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            				var flag=reg.test(this.email);
            				if(flag==false) {
            					this.$Message.error('邮箱验证码格式错误');
            					return false;
            				}
            				return true;
            			},
            			getUserLevelList: function() {
            				axios.get('getUserLevelList',{params: null},{header:{'Content-Type':'application/x-www-form-urlencoded'}
							}).then(res=>{
								this.userLevelList=res.data.data;
							}).catch(err=>{
						
							});
            			},
            			okBtn:function () {
            				let isurl='opAddUser';
                            let map={
                            		Email:this.email,
                            		UserName:this.userName,
                            		Password:this.password,
                            		Level:this.level,
                            };
                            axios.post(isurl,Qs.stringify(map),{
                                header:{
                                    'Content-Type':'application/x-www-form-urlencoded'
                                }
                            }).then(res=>{
                            	if(res.data.code=='0') {
                            		this.$Notice.success({
                            			title: '创建成功',
                            			desc: '接下来干什么呢?',
                            			duration: 2,
                            		});
                            		this.email='';
                            		this.userName='';
                            		this.password='';
                            		this.level='';
                            	}
                            }).catch(err=>{
                            	
                            });
            			},
                    },
                    data: function () {
                        return {
                          userLevelList:{},
                          email:'',
                          userName:'',
                          password:'',
                          level:'',
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        // 获取用户等级列表
                        this.getUserLevelList();
                    },
                    template:
                    '<div class="content-background-card" >'+
                    '<divider><h1 class="font-type">(管理员)添加用户</h1></divider>'+
                        '<div class="card-900-body" style="text-align:center;">'+
		                     '<div class="card-row">'+
		                        '<span class="row-span ">'+
		                           '<span class="font-p-type">用户昵称：</span>'+
		                        '</span>'+
		                        '<span class="row-span ">'+
		                           ' <i-input placeholder="Enter something..." style="width: 500px" v-model="userName"></i-input>'+
		                        '</span>'+
		                    '</div>'+
		                    '<div class="card-row">'+
		                        '<span class="row-span ">'+
		                           '<span class="font-p-type">用户等级：</span>'+
		                        '</span>'+
		                        '<span class="row-span ">'+
		                           '<i-select v-model="level" style="width:500px">'+
		                           		'<i-option v-for="item in userLevelList" :value="item.LEVEL_ID" :key="item.LEVEL_ID">{{ item.LEVEL_INFO }}</i-option>'+
		                           	'</i-select>'+
		                        '</span>'+
	                        '</div>'+
	                        '<div class="card-row">'+
		                        '<span class="row-span ">'+
		                           '<span class="font-p-type">用户密码：</span>'+
		                        '</span>'+
		                        '<span class="row-span ">'+
		                           ' <i-input placeholder="Enter something..." type="password" password  style="width: 500px" v-model="password"></i-input>'+
		                        '</span>'+
	                        '</div>'+
                            '<div class="card-row">'+
                                '<span class="row-span ">'+
                                    '<span class="font-p-type">用户邮箱：</span>'+
                                '</span>'+
                                '<span class="row-span ">'+
                                    ' <i-input type="email" @on-blur="emailVerificationCheck" placeholder="Enter something..." style="width: 500px" v-model="email"></i-input>'+
                                '</span>'+
                            '</div>'+
                            '<div class="card-row" style="text-align:center;">'+
                            	'<divider ></divider>'+
                                '<span class="row-span">'+
                                    '<i-button @click="okBtn" class="button-ordinary">创建</i-button>'+
                                '</span>'+
                            '</div>'+
                        '</div>'+
                    '</div>'
                },
                
            },
			{
                path:'/opAttentionManagement',
                component:{
                    methods: {
                    	
                    	PageDown:function(value) {
                        	this.pageNumber=value;
                        	this.$Message.info('当前页面:'+this.pageNumber+'页');
                        	this.getAttentionList((value-1)*10);
                        	this.getAttentionCount();
                        },
                        getAttentionList:function(value){
                        	axios.get('opAttentionList',{params: {
                        		Page:value,
                        		UserID:this.userID,
                        		FollowedID:this.followedID,
                        	}
                            }).then(res=>{
                                  this.attentionList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        getAttentionCount:function(){
                        	axios.get('opAttentionCount',{params: {
                        		UserID:this.userID,
                        		FollowedID:this.FollowedID,
                        	}
                            }).then(res=>{
                                  this.attentionNumber=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        searchBtn:function() {
                        	this.getAttentionList(0);
                        	this.getAttentionCount();
                        },
                        clearBtn:function() {
                        	this.userID='';
                        	this.followedID='';
                        	this.getAttentionList(0);
                        	this.getAttentionCount();
                        },
                        show (index) {
                            this.$Modal.info({
                                title: '用户详细信息',
                                content: `用户ID：${this.attentionList[index].USER_ID} </br> 用户名：${this.attentionList[index].USER_NAME} </br> 关注时间：${this.attentionList[index].FOLLOWED_TIME} </br> 被关注ID：${this.attentionList[index].USER_FOLLOWED} </br> 被关注用户名：${this.attentionList[index].FOLLOWED_NAME} </br>`
                            })
                        },
                        remove (index) {
                            this.$Modal.confirm({
								title:"你确定要以管理员身份删除吗？",
								content:"被删除的信息不能被找回奥！",
								closable:true,
								onOk: () => {
									axios.delete('opAttention',{params: {
										UserID: this.attentionList[index].USER_ID,
										FollowedID: this.attentionList[index].USER_FOLLOWED
										}
									}).then(res=>{
										this.getAttentionList(0);
			                        	this.getAttentionCount();
									}).catch(err=>{
										
									});
                                },
                        		onCancel: () => {
                        			console.log("点击了取消");
                        		}
                        	});
                        }
                    },
                    data: function () {
                        return {
                        	userID:null,
                        	followedID:null,
                        	attentionList:[],
                        	attentionNumber:null,
                        	pageNumber:1,
                        	
                        	 columns2: [
                        		 {
                                     title: '用户ID',
                                     slot: 'USER_ID'
                                 },
                                 {
                                     title: '用户名',
                                     key: 'USER_NAME'
                                 },
                                 {
                                     title: '被关注用户ID',
                                     key: 'USER_FOLLOWED'
                                 },
                                 {
                                     title: '被关注用户名',
                                     key: 'FOLLOWED_NAME'
                                 },
                                 {
                                     title: '操作',
                                     slot: 'action',
                                     width: 150,
                                     align: 'center'
                                 }
                             ],
 
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        this.getAttentionList(0);
                        this.getAttentionCount();
                    },
                    template:
                    '<div v-bind:class="attentionNumber!=0? \'content-card\':\'content-background-card\'">'+
                        '<divider><h1 class="font-type">(管理员)关注管理</h1></divider>'+
                        '<div class="card-1150-body">'+
                        '<div class="card-row">'+
                            '<row>'+
                                '<i-col span="9">'+
                                  
                                    '<Input v-model="userID" style="width: 160px" placeholder="用户ID" />'+
                                '</i-col >'+
                                '<i-col span="9">'+
                      
                                    '<Input v-model="followedID" style="width: 160px" placeholder="被关注用户ID" />'+
                                '</i-col >'+
                                '<i-col span="3">'+
                                
                                    '<span>'+
                                        '<i-button type="primary" class="button-ordinary" style="width:90px" @click="searchBtn" icon="md-search">Search</i-button>'+
                                    '</span>'+
                                '</i-col >'+
                                
                                '<i-col span="3">'+
                                    '<span>'+
                                        '<i-button type="primary" class="button-ordinary" style="width:90px" @click="clearBtn" icon="md-close">Clear</i-button>'+
                                    '</span>'+
                                '</i-col >'+
                            '</row>'+
                        '</div>'+
                        '<div class="card-row">'+
	                        '<i-table border :columns="columns2" :data="attentionList">'+
		                        '<template slot-scope="{ row }" slot="USER_ID">'+
		                        	'<strong>{{ row.USER_ID }}</strong>'+
		                        '</template>'+
		                        '<template slot-scope="{ row, index }" slot="action">'+
			                        '<i-button type="primary" size="small" style="margin-right: 5px" @click="show(index)">详细</i-button>'+
			                        '<i-button type="error" size="small" @click="remove(index)">删除</i-button>'+
		                        '</template>'+
	                        '</i-table>'+
                        '</div>'+
                        '<div style="text-align: center; margin-top: 30px;" v-show="attentionNumber==0">'+
							'<p>这个人没有上传过哟!</p>'+
						'</div>'+
						'<div style="text-align: center; margin-top: 30px;" v-show="attentionNumber>10">'+
							'<page :total="attentionNumber" @on-change="PageDown" show-elevator ></page>'+
						'</div>'+
                    '</div>'+
                 '</div>'
                }
            },
			{
				path:'/',
				component:{
					methods: {
						getUserInfo:function() {
							let isurl='userInfo';
							return axios.get(isurl,null,{header:{'Content-Type':'application/x-www-form-urlencoded'}
							}).then(res=>{
								if(res.data.code!=0) {
									this.$Notice.open({
										title: '你没有登录',
										desc: '快去登录吧!',
										// 显示时间两秒
										duration: 2
									});
								}else {
									this.user=res.data.data;
								}
								return;
							}).catch(err=>{
								
							});
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
						getUserResourcesStatistics:function(value) {
							let isurl='getUserResourcesStatistics';
							axios.get(isurl, {
								params: {
									UserID:value,
								}
							}).then(res=>{
								this.userResourcesStatistics=res.data.data;
								console.log(this.userResourcesStatistics);
								this.bookShare=parseInt(parseFloat(this.userResourcesStatistics.BOOK_RESOURCES)/parseFloat(this.userResourcesStatistics.ALL_RESOURCES) *100);
								this.codeShare=parseInt(parseFloat(this.userResourcesStatistics.CODE_RESOURCES)/parseFloat(this.userResourcesStatistics.ALL_RESOURCES) *100);
								this.softwareShare=parseInt(parseFloat(this.userResourcesStatistics.SOFTWARE_RESOURCES)/parseFloat(this.userResourcesStatistics.ALL_RESOURCES) *100);
								this.videoShare=parseInt(parseFloat(this.userResourcesStatistics.VIDEO_RESOURCES)/parseFloat(this.userResourcesStatistics.ALL_RESOURCES) *100);
								this.otherShare=parseInt(parseFloat(this.userResourcesStatistics.OTHER_RESOURCES)/parseFloat(this.userResourcesStatistics.ALL_RESOURCES) *100);
								this.articleShare=parseInt(parseFloat(this.userResourcesStatistics.ARTICLE_RESOURCES)/parseFloat(this.userResourcesStatistics.ALL_RESOURCES) *100);
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
								this.getUserResList((value-1)*10,this.user.userID,1);
								this.getUserResCount(this.user.userID,1);
							}
							if(this.tabs=='other') {
								this.getUserResList((value-1)*10,this.user.userID,3);
								this.getUserResCount(this.user.userID,3);
							}
							if(this.tabs=='article') {
								this.getUserResList((value-1)*10,this.user.userID,2);
								this.getUserResCount(this.user.userID,2);
							}
							if(this.tabs=='book') {
								this.getUserResList((value-1)*10,this.user.userID,4);
								this.getUserResCount(this.user.userID,4);
							}
							if(this.tabs=='software') {
								this.getUserResList((value-1)*10,this.user.userID,5);
								this.getUserResCount(this.user.userID,5);
							}
							if(this.tabs=='code') {
								this.getUserResList((value-1)*10,this.user.userID,6);
								this.getUserResCount(this.user.userID,6);
							}
							
						},
						tabClick:function(value) {
							console.log(value);
							if(value=='video') {
								this.getUserResList(0,this.user.userID,1);
								this.getUserResCount(this.user.userID,1);
							}
							if(value=='video') {
								this.getUserResList(0,this.user.userID,1);
								this.getUserResCount(this.user.userID,1);
							}
							if(value=='article') {
								this.getUserResList(0,this.user.userID,2);
								this.getUserResCount(this.user.userID,2);
							}
							if(value=='other') {
								this.getUserResList(0,this.user.userID,3);
								this.getUserResCount(this.user.userID,3);
							}
							if(value=='book') {
								this.getUserResList(0,this.user.userID,4);
								this.getUserResCount(this.user.userID,4);
							}
							if(value=='software') {
								this.getUserResList(0,this.user.userID,5);
								this.getUserResCount(this.user.userID,5);
							}
							if(value=='code') {
								this.getUserResList(0,this.user.userID,6);
								this.getUserResCount(this.user.userID,6);
							}
							return value;
						},
						getTimeState:function() {
							let timeNow = new Date();
							// 获取当前小时
							let hours = timeNow.getHours();
							// 设置默认文字
							let text = ``;
							// 判断当前时间段
							if (hours >= 0 && hours <= 10) {
								 text = `早上好`;
							} else if (hours > 10 && hours <= 14) {
								 	text = `中午好`;
							} else if (hours > 14 && hours <= 18) {
								text = `下午好`;
							} else if (hours > 18 && hours <= 24) {
								text = `晚上好`;
							}
							return text;
						},
					},
					data: function () {
						return {
							user:{},
							userHomeInfo:{},
							userResourcesStatistics:{},
							videoShare:0,
							otherShare:0,
							articleShare:0,
							bookShare:0,
							codeShare:0,
							softwareShare:0,
							resList:{},
							resCount:0,
							tabs:'video',
							pageSize:10,
							time:'你好',
						}
					},
					mounted() {
						// 该函数会在组件加载时调用
						console.log("组件执行");
						this.getUserInfo().then(()=>{
							this.getUserHomePageInfo(this.user.userID);
							this.getUserResourcesStatistics(this.user.userID);
							this.getUserResList(0,this.user.userID,1);
							this.getUserResCount(this.user.userID,1);
							
						});
						this.time=this.getTimeState();
					},
					template:
						'<div class="content-card">'+
						'<!--首页-->'+
							'<div class="card-1150-body">'+
								'<div class="card-row">'+
									'<span class="row-span font-p-type " style="font-size: 36px;">'+
										'<span class="row-span">'+
											'{{time}}!'+
										'</span>'+
										'<span class="row-span">'+
											'{{userHomeInfo.USER_NAME}}'+
										'</span>'+
									'</span>'+
									'<span class="row-span font-p-type "> '+
										'<tag color="primary">{{userHomeInfo.USER_LEVEL}}</tag>'+
									'</span>'+
								'</div>'+
								'<div class="card-row" >'+
									'<span class="row-span font-p-type " style="float: left;">'+
										'{{userHomeInfo.USER_DESCRIPTION}}'+
									'</span>'+
								'</div>'+
								'<div class="card-row" >'+
									'<span class="row-span font-type " style="float: right;">'+
										'<icon type="md-folder" size="18"></icon>资源数:{{userHomeInfo.RES}}'+
									'</span>'+
									'<span class="row-span font-type " style="float: right;">'+
										'<icon type="md-chatboxes" size="18"></icon>评论数:{{userHomeInfo.COMMENT}}'+
									'</span>'+
									'<span class="row-span font-type " style="float: right;">'+
										'<icon type="md-glasses" size="18"></icon>关注用户数:{{userHomeInfo.ATTENTION}}'+
									'</span>'+
									'<span class="row-span font-type " style="float: right;">'+
										'<icon type="md-rose" size="18"></icon>粉丝数:{{userHomeInfo.FANS}}'+
									'</span>'+
								'</div>'+
								'<div class="card-row" style="text-align:center; margin-top:100px; float: clear;" >'+
									'<span class="row-span" >'+
										'<i-circle :percent="videoShare" :size="240" :trail-width="4" :stroke-width="5" stroke-linecap="square" stroke-color="#43a3fb">'+
											'<div class="circle-custom">'+
												'<h1>视频资源</h1>'+
												'<p>资源数:{{userResourcesStatistics.VIDEO_RESOURCES }}</p>'+
												'<span>'+
													'占比'+
													'<i>{{videoShare}}%</i>'+
												'</span>'+
											'</div>'+
										'</i-circle>'+
									'</span>'+
									'<span class="row-span" >'+
										'<i-circle :percent="otherShare" :size="240" :trail-width="4" :stroke-width="5" stroke-linecap="square" stroke-color="#5cb85c">'+
											'<div class="circle-custom">'+
												'<h1>其他资源</h1>'+
												'<p>资源数:{{userResourcesStatistics.OTHER_RESOURCES }}</p>'+
												'<span>'+
													'占比'+
													'<i>{{otherShare}}%</i>'+
												'</span>'+
											'</div>'+
										'</i-circle>'+
									'</span>'+
									'<span class="row-span" >'+
										'<i-circle :percent="articleShare" :size="240" :trail-width="4" :stroke-width="5" stroke-linecap="square" stroke-color="#ff5500">'+
											'<div class="circle-custom">'+
												'<h1>文章专栏</h1>'+
												'<p>资源数:{{userResourcesStatistics.ARTICLE_RESOURCES }}</p>'+
												'<span>'+
													'占比'+
													'<i>{{articleShare}}%</i>'+
												'</span>'+
											'</div>'+
										'</i-circle>'+
									'</span>'+
								'</div>'+
								'<div class="card-row" style="text-align:center; margin-top:100px; float: clear;" >'+
								'<span class="row-span" >'+
									'<i-circle :percent="bookShare" :size="240" :trail-width="4" :stroke-width="5" stroke-linecap="square" stroke-color="#ff9900">'+
										'<div class="circle-custom">'+
											'<h1>书籍文档</h1>'+
											'<p>资源数:{{userResourcesStatistics.BOOK_RESOURCES }}</p>'+
											'<span>'+
												'占比'+
												'<i>{{bookShare}}%</i>'+
											'</span>'+
										'</div>'+
									'</i-circle>'+
								'</span>'+
								'<span class="row-span" >'+
									'<i-circle :percent="softwareShare" :size="240" :trail-width="4" :stroke-width="5" stroke-linecap="square" stroke-color="#19be6b">'+
										'<div class="circle-custom">'+
											'<h1>工具软件</h1>'+
											'<p>资源数:{{userResourcesStatistics.SOFTWARE_RESOURCES }}</p>'+
											'<span>'+
												'占比'+
												'<i>{{softwareShare}}%</i>'+
											'</span>'+
										'</div>'+
									'</i-circle>'+
								'</span>'+
								'<span class="row-span" >'+
									'<i-circle :percent="codeShare" :size="240" :trail-width="4" :stroke-width="5" stroke-linecap="square" stroke-color="#808695">'+
										'<div class="circle-custom">'+
											'<h1>项目源码</h1>'+
											'<p>资源数:{{userResourcesStatistics.CODE_RESOURCES }}</p>'+
											'<span>'+
												'占比'+
												'<i>{{codeShare}}%</i>'+
											'</span>'+
										'</div>'+
									'</i-circle>'+
								'</span>'+
							'</div>'+
								'<div class="card-row font-p-type" >'+
									'<tabs value="video" :animated="false" v-model="tabs" @on-click="tabClick">'+
										'<tab-pane  label="视频资源" name="video">'+
											'<div class="card-row" >'+
												'<div>'+
													'<div v-for="(item, index)  in resList" class="span-piece">'+
														'<a v-bind:href="\'video.html?name=\' + item.RES_ID">'+
															'<img alt="Cover" v-bind:src="\'getResourcesCover?CoverName=\' + item.RESOURCES_COVER_SRC" style="border-radius:10px;" width="100%" height="100%"/>'+
															'<p class="a-ordinary">{{item.RESOURCES_TITLE}}</p>'+
															'<p class="a-ordinary" style="font-size:10px;">{{item.RESOURCES_LABEL}}</p>'+
															'<tag type="border"><icon type="md-clock" ></icon>{{item.UPLOAD_TIME}}</tag>'+
															'<tag type="border"><icon type="md-flame"></icon>{{item.CHECK_NUMBER}}</tag>'+
															'<tag type="border">{{item.USER_NAME}}</tag>'+
														'</a>'+
													'</div>'+
												'</div>'+
												'<div style="text-align: center; margin-top: 30px;" v-show="resCount==0">'+
													'<p>这个人没有上传过哟!</p>'+
												'</div>'+
												'<div style="text-align: center; margin-top: 30px;" v-show="resCount>10">'+
													'<page :total="resCount" :page-size="pageSize" @on-change="PageDown" show-elevator ></page>'+
												'</div>'+
											'</div>'+
										'</tab-pane>'+
										'<tab-pane label="项目源码" name="code">'+
											'<div class="card-row" >'+
												'<div>'+
													'<div v-for="(item, index)  in resList" class="span-piece">'+
														'<a v-bind:href="\'other.html?name=\' + item.RES_ID">'+
															'<img alt="Cover" v-bind:src="\'getResourcesCover?CoverName=\' + item.RESOURCES_COVER_SRC" style="border-radius:10px;" width="100%" height="100%"/>'+
															'<p class="a-ordinary">{{item.RESOURCES_TITLE}}</p>'+
															'<p class="a-ordinary" style="font-size:10px;">{{item.RESOURCES_LABEL}}</p>'+
															'<tag type="border"><icon type="md-clock" ></icon>{{item.UPLOAD_TIME}}</tag>'+
															'<tag type="border"><icon type="md-flame"></icon>{{item.CHECK_NUMBER}}</tag>'+
															'<tag type="border">{{item.USER_NAME}}</tag>'+
														'</a>'+
													'</div>'+
												'</div>'+
												'<div style="text-align: center; margin-top: 30px;" v-show="resCount==0">'+
													'<p>这个人没有上传过哟!</p>'+
												'</div>'+
												'<div style="text-align: center; margin-top: 30px;" v-show="resCount>10">'+
													'<page :total="resCount" :page-size="pageSize" @on-change="PageDown" show-elevator ></page>'+
												'</div>'+
											'</div>'+
										'</tab-pane>'+
										'<tab-pane label="书籍文档" name="book">'+
										'<div class="card-row" >'+
											'<div>'+
												'<div v-for="(item, index)  in resList" class="span-piece">'+
													'<a v-bind:href="\'other.html?name=\' + item.RES_ID">'+
														'<img alt="Cover" v-bind:src="\'getResourcesCover?CoverName=\' + item.RESOURCES_COVER_SRC" style="border-radius:10px;" width="100%" height="100%"/>'+
														'<p class="a-ordinary">{{item.RESOURCES_TITLE}}</p>'+
														'<p class="a-ordinary" style="font-size:10px;">{{item.RESOURCES_LABEL}}</p>'+
														'<tag type="border"><icon type="md-clock" ></icon>{{item.UPLOAD_TIME}}</tag>'+
														'<tag type="border"><icon type="md-flame"></icon>{{item.CHECK_NUMBER}}</tag>'+
														'<tag type="border">{{item.USER_NAME}}</tag>'+
													'</a>'+
												'</div>'+
											'</div>'+
											'<div style="text-align: center; margin-top: 30px;" v-show="resCount==0">'+
												'<p>这个人没有上传过哟!</p>'+
											'</div>'+
											'<div style="text-align: center; margin-top: 30px;" v-show="resCount>10">'+
												'<page :total="resCount" :page-size="pageSize" @on-change="PageDown" show-elevator ></page>'+
											'</div>'+
										'</div>'+
									'</tab-pane>'+
									'<tab-pane label="工具软件" name="software">'+
									'<div class="card-row" >'+
										'<div>'+
											'<div v-for="(item, index)  in resList" class="span-piece">'+
												'<a v-bind:href="\'other.html?name=\' + item.RES_ID">'+
													'<img alt="Cover" v-bind:src="\'getResourcesCover?CoverName=\' + item.RESOURCES_COVER_SRC" style="border-radius:10px;" width="100%" height="100%"/>'+
													'<p class="a-ordinary">{{item.RESOURCES_TITLE}}</p>'+
													'<p class="a-ordinary" style="font-size:10px;">{{item.RESOURCES_LABEL}}</p>'+
													'<tag type="border"><icon type="md-clock" ></icon>{{item.UPLOAD_TIME}}</tag>'+
													'<tag type="border"><icon type="md-flame"></icon>{{item.CHECK_NUMBER}}</tag>'+
													'<tag type="border">{{item.USER_NAME}}</tag>'+
												'</a>'+
											'</div>'+
										'</div>'+
										'<div style="text-align: center; margin-top: 30px;" v-show="resCount==0">'+
											'<p>这个人没有上传过哟!</p>'+
										'</div>'+
										'<div style="text-align: center; margin-top: 30px;" v-show="resCount>10">'+
											'<page :total="resCount" :page-size="pageSize" @on-change="PageDown" show-elevator ></page>'+
										'</div>'+
									'</div>'+
								'</tab-pane>'+
								'<tab-pane label="其他资源" name="other">'+
								'<div class="card-row" >'+
									'<div>'+
										'<div v-for="(item, index)  in resList" class="span-piece">'+
											'<a v-bind:href="\'other.html?name=\' + item.RES_ID">'+
												'<img alt="Cover" v-bind:src="\'getResourcesCover?CoverName=\' + item.RESOURCES_COVER_SRC" style="border-radius:10px;" width="100%" height="100%"/>'+
												'<p class="a-ordinary">{{item.RESOURCES_TITLE}}</p>'+
												'<p class="a-ordinary" style="font-size:10px;">{{item.RESOURCES_LABEL}}</p>'+
												'<tag type="border"><icon type="md-clock" ></icon>{{item.UPLOAD_TIME}}</tag>'+
												'<tag type="border"><icon type="md-flame"></icon>{{item.CHECK_NUMBER}}</tag>'+
												'<tag type="border">{{item.USER_NAME}}</tag>'+
											'</a>'+
										'</div>'+
									'</div>'+
									'<div style="text-align: center; margin-top: 30px;" v-show="resCount==0">'+
										'<p>这个人没有上传过哟!</p>'+
									'</div>'+
									'<div style="text-align: center; margin-top: 30px;" v-show="resCount>10">'+
										'<page :total="resCount" :page-size="pageSize" @on-change="PageDown" show-elevator ></page>'+
									'</div>'+
								'</div>'+
							'</tab-pane>'+
										'<tab-pane label="文章专栏" name="article">'+
											'<div class="card-row" >'+
												'<div>'+
													'<list item-layout="vertical">'+
														'<list-item v-for="item in resList" :key="item.RES_ID">'+
															'<a v-bind:href="\'article.html?name=\' + item.RES_ID">'+
																'<list-item-meta :title="item.RESOURCES_TITLE" :description="item.RESOURCES_LABEL" ></list-item-meta>'+
															'</a>'+
															'<template slot="action">'+
																'<li>'+
																	'<icon type="md-time" ></icon> {{item.UPLOAD_TIME}}'+
																'</li>'+
																'<li>'+
																	'<icon type="md-flame" ></icon> {{item.CHECK_NUMBER}}'+
																'</li>'+
																'<li>'+
																	'<icon type="md-chatboxes" ></icon> {{item.COMMENT_NUMBER}}'+
																'</li>'+
																'<li>'+
																	'<span><icon type="md-person" ></icon> {{item.USER_NAME}}</span>'+
																'</li>'+
															'</template>'+
														'</list-item>'+
													'</list>'+
												'</div>'+
												'<div style="text-align: center; margin-top: 30px;" v-show="resCount==0">'+
													'<p>这个人没有上传过哟!</p>'+
												'</div>'+
												'<div style="text-align: center; margin-top: 30px;" v-show="resCount>10">'+
													'<page :total="resCount" :page-size="pageSize" @on-change="PageDown" show-elevator ></page>'+
												'</div>'+
											'</div>'+
										'</tab-pane>'+
									'</tabs>'+
								'</div>'+
							'</div>'+
							'<back-top></back-top>'+
						'</div>'
				}
			},
			{
				path:'/carouselList',
				component:{
					methods: {
						getCarouselList:function() {
							let isurl='getCarouselList';
							axios.get(isurl, {
								params: {
									
								}
							}).then(res=>{
								this.carouselList=res.data.data;
							}).catch(err=>{
								
							});
						},
						deleteBtn:function(value) {
							this.$Modal.confirm({
								title:"你确定要以管理员身份删除这条轮播吗？",
								content:"被删除的信息不能被找回奥！",
								closable:true,
								onOk: () => {
									console.log("删除了"+value);
									axios.delete('carousel',{params: {NUMBER: value}
									}).then(res=>{
										this.getCarouselList();
									}).catch(err=>{
										
									});
                                },
                        		onCancel: () => {
                        			console.log("点击了取消");
                        		}
                        	});
                        },
                    },
                    data: function () {
                        return {
                        	carouselList:{},
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        this.getCarouselList();
                    },
                    template:
                    '<div class="content-background-card">'+
                        '<divider><h1 class="font-type">轮播列表</h1></divider>'+
                        '<div class="card-900-body">'+
                        '<List item-layout="vertical">'+
                        '<ListItem v-for="item in carouselList" :key="item.NUMBER">'+
                            '<ListItemMeta :title="\'轮播标题:\'+item.IMG_TITLE"/>'+
                               '<a class="a-ordinary" v-bind:href="item.LINK">跳转链接:{{ item.LINK }}</a>'+
                               '<template slot="action">'+
                                 '<li>'+
                                      '<span><Icon type="md-trash" /></span><a @click="deleteBtn(item.NUMBER)" class="a-ordinary">删除</a>'+
                                 '</li>'+
                                 '<li>'+
                                      '<span><Icon type="md-list" /></span><span class="a-ordinary">轮播顺序编号:{{item.NUMBER}}</span>'+
                                 '</li>'+
                             '</template>'+
                             '<template slot="extra">'+
                                 '<img v-bind:src="\'carousel?CarouselName=\' + item.IMG_URL" style="width: 280px;border-radius:5px;">'+
                            '</template>'+
                       '</ListItem>'+
                       '</List>'+
                        '</div>'+
                    '</div>'
                    
                }
            },
            
            {
                path:'/addCarousel',
                component:{
                    methods: {
                            downUploadImgBtn:function () {
                                document.getElementById("imgfile").click();
                            },
                            selectImgOver:function () {
                                var _this=this;
                                // 获取封面文件对象
                                var preview = document.getElementById("carouselImg");
                                var file    = document.getElementById("imgfile").files[0];
                                var inputFile =document.getElementById("imgfile");
                                // 开启文件读入流
                                var reader  = new FileReader();
                                // 转换大小单位
                                var size = file.size /1024/1024;
                                // 判断文件是否选中
                                if (file) {
                                  reader.readAsDataURL(file);
                                } else {
                                  preview.src = "";
                                }
                                // 设置封面图片上传大小
                                if(size>3){
                                	this.$Notice.open(
                                            {
                                                 title: '图片太大了!',
                                                 desc: '图片大小不能超过3MB!',
                                                 // 显示时间两秒
                                                 duration: 2
                                            }
                                        );  
                                   inputFile.value="";
                                   return;
                                }
                                // 显示图片
                                this.pageImgShow=true;
                                
                                // 读入完成显示到图片控件
                                reader.onloadend = function () {
                                  preview.src = reader.result;
                                }
                                
                                // 判断文件是否存在并将图片上传
                                if (file) {
                                	let reader = new FileReader();
                                    reader.readAsArrayBuffer(file);
                                    reader.addEventListener("load", function(e) {
                                  	  
                                    spark = new SparkMD5.ArrayBuffer();
                                    var formData = new FormData();
                                        // 数据块文件名称
                                        formData.append('FileName', file.name);
                                        // 文件类型
                                        formData.append('FileType', file.type);
                                        // 文件大小
                                        formData.append('FileSize', file.size);
                                        // 将ArrayBuffer变为二进制类型 传输
                                        spark.append(e.target.result);
                                        var blob = new Blob([e.target.result], { type: "text/plain"});
                                        formData.append('File', blob);
                                        var md5=spark.end();
                                        formData.append('MD5', md5);
                                        // 输出日志信息
                                        console.log("FileName："+file.name);
                                        console.log("MD5："+md5);
                                        console.log("FileSize："+file.size);
                                        // 创建Ajax对象
                                        $.ajax({
                                            url: 'uploadCarouselImg',
                                            type: 'post',
                                            data: formData,
                                            cache: false,
                                            processData: false,
                                            contentType: false,
                                            success : function(response,status,xhr) {
                                                _this.$Notice.success(
                                                        {
                                                            title: '封面上传成功!',
                                                            desc: '填写资源信息吧!',
                                                            // 显示时间两秒
                                                            duration: 2
                                                       }
                                                   );
                                                inputFile.value="";
                                            },
                                            error: function (response,status,xhr) {
                                            
                                            }
                                        });
                                    });
                                }
                            },
                            downSubmitBtn:function() {
                                
                                let isurl='carousel';
                                let map={
                                	ImgTitle: this.imgTitle,
                                	ImgIndex: this.imgIndex,
                                	Link: this.link,
                                };
                                axios.post(isurl,Qs.stringify(map),{
                                    header:{
                                        'Content-Type':'application/x-www-form-urlencoded'
                                    }
                                }).then(res=>{
                              	  if(res.data.code==1) {
                                		
                                		this.$Notice.error({
                                			title: '提交失败!',
                                			desc: '接下来干什么呢?',
                                			duration: 2,
                                		});
                                	}
                                	else {
                                		this.$Notice.success({
                                			title: '提交成功',
                                			desc: '接下来干什么呢?',
                                			duration: 2,
                                		});
                                		// 返回头部
                                		$('html').animate( {scrollTop: 0}, 1000);
                                		this.imgTitle='',
                                    	this.imgIndex=null,
                                    	this.link='';
                                		var preview = document.getElementById("carouselImg");
                                		preview.src="";
                                		this.pageImgShow=false;
                                	}
                                }).catch(err=>{
                                	
                                });
                            },
                            imgIndexCheck: function() {
                                var reg = /^\d{1,4}$/;
                                var flag=reg.test(this.imgIndex);
                                if(flag==false) {
                                    this.$Message.error('只能输入1-4位数字');
                                    return false;
                                }
                                return true;
                            },
                    },
                    
                    data: function () {
                        return {
                        	pageImgShow:false,
                        	imgTitle:'',
                        	imgIndex:null,
                        	link:'',
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                    },
                    template:
                    '<div class="content-background-card">'+
                        '<divider><h1 class="font-type">添加轮播图</h1></divider>'+
                        '<div class="card-900-body">'+
                            '<div class="card-row" style="text-align: center;">'+
                                '<divider dashed ><p class="font-p-type">轮播图片</p></divider>'+
                                '<input type="file" id="imgfile" accept="image/png,image/jpeg" v-on:change="selectImgOver" hidden="hidden">'+
                                '<i-button icon="md-cloud-upload" class="button-ordinary" @click="downUploadImgBtn">上传图片</i-button>'+
                                '<span>（格式jpeg、png,文件大小≤3MB, 建议上传21:9 1050*450图片）</span>'+
                                '<br>'+
                                '<img id="carouselImg" src="" v-show="pageImgShow" height="200" alt="Image preview...">'+
                            '</div>'+
                            '<div class="card-row" style="text-align: center;">'+
                                '<divider dashed ><p class="font-p-type">图片信息</p></divider>'+
                                '<span class="row-span ">'+
                                   '<span class="font-p-type">图片描述：</span>'+
                                '</span>'+
                                '<span class="row-span ">'+
                                  ' <i-input placeholder="鼠标放到轮播图片上会显示的文字" style="width: 300px" v-model="imgTitle"></i-input>'+
                               '</span>'+
                            '</div>'+
                            '<div class="card-row" style="text-align: center;">'+
                               '<span class="row-span ">'+
                                   '<span class="font-p-type">轮播顺序：</span>'+
                                '</span>'+
                                '<span class="row-span ">'+
                                  ' <i-input placeholder="轮播列表的顺序,不能重复" style="width: 300px" @on-blur="imgIndexCheck" v-model="imgIndex"></i-input>'+
                                '</span>'+
                            '</div>'+
                            '<div class="card-row" style="text-align: center;">'+
                                '<span class="row-span ">'+
                                   '<span class="font-p-type">链接地址：</span>'+
                                '</span>'+
                                '<span class="row-span ">'+
                                  ' <i-input placeholder="点击图片跳转的地址" style="width: 300px" v-model="link"></i-input>'+
                                '</span>'+
                           '</div>'+
                           '<div class="card-row" style="text-align: center;">'+
                               '<i-button icon="md-checkmark" class="button-ordinary" @click="downSubmitBtn">提交</i-button>'+
                           '</div>'+
                        '</div>'+
                    '</div>'
                    
                }
            },
            
            {
                path:'/opCommentManagement',
                component:{
                    methods: {
                        getResourcesTypeMap:function() {
                            axios.get('getResourcesTypeMap',{params: {}
                            }).then(res=>{
                                  this.resourceType=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        searchBtn:function() {
                        	axios.get('getOpComment',{params: {
                        		ResName:this.resourceName,
                        		ComWords:this.commentWords,
                        		ResType:this.selectResourceType,
                        		Page:0,
                        	}
                            }).then(res=>{
                                  this.commentList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        	
                        	axios.get('getOpCommentNumber',{params: {
                        		ResName:this.resourceName,
                        		ComWords:this.commentWords,
                        		ResType:this.selectResourceType,
                        	}
                            }).then(res=>{
                                  this.commentNumber=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        clearBtn:function() {
                        	this.selectResourceType=null;
                        	this.resourceName=null;
                        	this.commentWords=null;
                        	this.searchBtn();
                        },
                        PageDown:function(value) {
                        	this.pageNumber=value;
                        	this.$Message.info('当前页面:'+this.pageNumber+'页');
                        	axios.get('getOpComment',{params: {
                        		ResName:this.resourceName,
                        		ComWords:this.commentWords,
                        		ResType:this.selectResourceType,
                        		Page:(this.pageNumber-1)*10,
                        	}
                            }).then(res=>{
                                  this.commentList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        deleteBtn:function(value) {
                        	this.$Modal.confirm({
                        		title:"你确定要以管理员身份删除这个评论吗？",
                        		content:"被删除的评论不能被找回奥！",
                        		closable:true,
                        		onOk: () => {
                        			console.log("删除了"+value);
                        			axios.delete('opComment',{params: {CommID: value}
                                    }).then(res=>{
                                    	this.searchBtn();
                                    }).catch(err=>{
                                     
                                    });
                                },
                        		onCancel: () => {
                        			console.log("点击了取消");
                        		}
                        	});
                        },
                    },
                    data: function () {
                        return {
                        	resourceName:'',
                        	commentWords:'',
                        	resourceType:{},
                        	selectResourceType:'',
                        	commentList:{},
                        	commentNumber:0,
                        	pageNumber:1,
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        this.getResourcesTypeMap();
                        this.searchBtn();
                    },
                    template:
                    '<div class="content-card">'+
                        '<divider><h1 class="font-type">(管理员)评论管理</h1></divider>'+
                        '<div class="card-900-body">'+
                            '<div class="card-row">'+
                                '<row>'+
                                    '<i-col span="6">'+
                                      
                                        '<Input v-model="resourceName" style="width: 160px" placeholder="请输入资源名称关键字" />'+
                                    '</i-col >'+
                                    '<i-col span="6">'+
                          
                                        '<Input v-model="commentWords" style="width: 160px" placeholder="请输入评论关键字" />'+
                                    '</i-col >'+
                                    '<i-col span="6">'+
                                     
                                        '<i-select v-model="selectResourceType" style="width:160px">'+
                                            '<i-option v-for="item in resourceType" :value="item.DATA_ID" :key="item.DATA_ID">{{ item.DATA_INFO }}</i-option>'+
                                        '</i-select>'+
                                    '</i-col >'+
                                    '<i-col span="3">'+
                                    
                                        '<span>'+
                                            '<i-button type="primary" class="button-ordinary" style="width:90px" @click="searchBtn" icon="md-search">Search</i-button>'+
                                        '</span>'+
                                    '</i-col >'+
                                    
                                    '<i-col span="3">'+
                                    
                                        '<span>'+
                                            '<i-button type="primary" class="button-ordinary" style="width:90px" @click="clearBtn" icon="md-close">Clear</i-button>'+
                                        '</span>'+
                                    '</i-col >'+
                                '</row>'+
                            '</div>'+
                            '<div>'+
                                '<List>'+
                                    '<ListItem v-for="item in commentList" :key="item.RES_ID">'+
                                        '<ListItemMeta :title="\'评论内容:\'+item.COMMENT_CONTENT" :description="\'资源标题:\'+item.RESOURCES_TITLE" />'+
                                        '<template slot="action">'+
                                            '<li>'+
                                                '<p>{{item.RESOURCES_TYPE_INFO}}</p>'+
                                            '</li>'+
                                            '<li>'+
                                                '<p>{{item.COMMENT_DATE}}</p>'+
                                            '</li>'+
                                            '<li>'+
                                                '<a class="a-ordinary">{{item.REVIEW_USER}}</a>'+
                                            '</li>'+
                                            '<li v-if="item.RESOURCES_TYPE == \'1\'">'+
                                                '<a class="a-ordinary" :href="\'video.html?name=\'+item.RESOURCES_ID">查看</a>'+
                                            '</li>'+
                                            '<li v-else-if="item.RESOURCES_TYPE == \'2\'">'+
                                                '<a class="a-ordinary" :href="\'article.html?name=\'+item.RESOURCES_ID">查看</a>'+
                                            '</li>'+
                                            '<li v-else>'+
                                                '<a class="a-ordinary" :href="\'other.html?name=\'+item.RESOURCES_ID">查看</a>'+
                                            '</li>'+
                                            '<li>'+
                                            '<a class="a-ordinary" @click="deleteBtn(item.COMM_ID)">删除</a>'+
                                        '</li>'+
                                        '</template>'+
                                    '</ListItem>'+
                                '</List>'+
                            '</div>'+
                            '<div class="card-row" style="text-align:center;">'+
                                '<Page :total="commentNumber" :current="pageNumber" @on-change="PageDown" />' +
                            '</div>'+
                        '</div>'+
                    '</div>'
                    
                }
            },
            
            {
                path:'/opOtherManagement',
                component:{
                    methods: {
                    	getOpOtherList:function(value) {
                    		axios.get('getOpOtherList',{params: {
                    			Page: value,
                    			ResName:this.resourceName,
                    			UserID:this.userID,
                    			ResType:this.selectResourceType,
                    			}
                            }).then(res=>{
                                  this.resList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        getOpOtherCount:function() {
                    		axios.get('getOpOtherCount',{params: {
                    			ResName:this.resourceName,
                    			UserID:this.userID,
                    			ResType:this.selectResourceType,
                    			}},{
                                header:{
                                    'Content-Type':'application/x-www-form-urlencoded'
                                }
                            }).then(res=>{
                                  this.resCount=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        deleteBtn:function(value) {
                        	this.$Modal.confirm({
                        		title:"你确定要以管理员身份删除这个资源吗？",
                        		content:"被删除的资源不能被找回奥！",
                        		closable:true,
                        		onOk: () => {
                        			console.log("删除了"+value);
                        			axios.delete('opResource',{params: {ResID: value}
                                    }).then(res=>{
                                    	this.getOpOtherCount();
                                    	this.getOpOtherList(0);
                                    }).catch(err=>{
                                     
                                    });
                                },
                        		onCancel: () => {
                        			console.log("点击了取消");
                        		}
                        	});
                        },
                        PageDown:function(value) {
                        	this.pageNumber=value;
                        	this.$Message.info('当前页面:'+this.pageNumber+'页');
                        	this.getOpOtherList((value-1)*10);
                        	this.getOpOtherCount();
                        },
                        eyeBtn:function(value) {
                        	window.open("other.html?name="+value);
                        },
                        userBtn:function(value) {
                        	window.open("user.html?name="+value);
                        },
                        searchBtn:function() {
                        	this.getOpOtherList(0);
                        	this.getOpOtherCount();
                        },
                        clearBtn:function() {
                        	this.pageNumber=1;
                        	this.resourceName=null;
                        	this.userID=null;
                        	this.getOpOtherList(0);
                        	this.getOpOtherCount();
                        },
                        getResourcesTypeMap:function() {
                            axios.get('getOtherResourcesTypeMap',{params: {}
                            }).then(res=>{
                                  this.resourcesType=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        
               },
                    data: function () {
                        return {
                        	userInfo:'',
                        	resList:{},
                        	resCount:0,
                        	pageNumber:1,
                        	resourceName:'',
                        	userID:'',
                        	selectResourceType:3,
                        	resourcesType:[],
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        //
                        this.getResourcesTypeMap();
                        this.getOpOtherList(0);
                        // 获取资源数量
                        this.getOpOtherCount();
                        
                    },
                    template:
                    '<div v-bind:class="resCount!=0? \'content-card\':\'content-background-card\'">'+
                        '<divider><h1 class="font-type">(管理员)书籍、软件、源码等其他管理</h1></divider>'+
                        '<div class="card-900-body">'+
                        '<div class="card-row">'+
                        '<row>'+
                        '<i-col span="6">'+
                            '<Input v-model="resourceName" style="width: 160px" placeholder="资源名称关键字" />'+
                        '</i-col >'+
                        '<i-col span="6">'+
                            '<Input v-model="userID" style="width: 160px" placeholder="用户ID" />'+
                        '</i-col >'+
                        
                        '<i-col span="6">'+
	                        '<i-select v-model="selectResourceType" placeholder="资源类型" style="width:160px">'+
	                        	'<i-option v-for="item in resourcesType"  :value="item.DATA_ID" :key="item.DATA_ID">{{ item.DATA_INFO }}</i-option>'+
	                        '</i-select>'+
                        '</i-col >'+
                        '<i-col span="3">'+
                            '<span>'+
                                '<i-button type="primary" class="button-ordinary" style="width:90px" @click="searchBtn" icon="md-search">查找</i-button>'+
                            '</span>'+
                        '</i-col >'+
                        
                        '<i-col span="3">'+
                            '<span>'+
                                '<i-button type="primary" class="button-ordinary" style="width:90px" @click="clearBtn" icon="md-close">重置</i-button>'+
                            '</span>'+
                        '</i-col >'+
                        '</row>'+
                        '</div>'+
                        '<div class="card-row">'+
                        '<List item-layout="vertical">'+
                        '<ListItem v-for="item in resList" :key="item.RES_ID">'+
                            '<ListItemMeta :title="item.RESOURCES_TITLE" :description="item.RESOURCES_LABEL" />'+
                               '<Icon type="md-time" />{{ item.UPLOAD_TIME }}'+
                               '<template slot="action">'+
                                  '<li>'+
                                      '<Icon type="md-folder" /> {{item.FILE_NUMBER}}'+
                                  '</li>'+
                                  '<li>'+
                                      '<Icon type="md-flame" /> {{item.CHECK_NUMBER}}'+
                                  '</li>'+
                                  '<li>'+
                                      '<Icon type="md-text" /> {{item.COMMENT_NUMBER}}'+
                                 '</li>'+
                                 '<li>'+
                                      '<span><Icon type="md-trash" /></span><a @click="deleteBtn(item.RES_ID)" class="a-ordinary">删除</a>'+
                                 '</li>'+
                                 '<li>'+
                                     '<span><Icon type="md-eye" /></span><a @click="eyeBtn(item.RES_ID)" class="a-ordinary">查看</a>'+
                                 '</li>'+
                             '</template>'+
                             '<template slot="extra">'+
                                 '<img v-bind:src="\'getResourcesCover?CoverName=\' + item.RESOURCES_COVER_SRC" style="width: 280px;border-radius:5px;">'+
                            '</template>'+
                       '</ListItem>'+
                   '</List>'+
                        '</div>'+
                        '<div style="text-align: center; margin-top: 30px;" v-show="resCount==0">'+
							'<p class="font-p-type">没有找到这种资源哟!</p>'+
						'</div>'+
                        '<div class="card-row" style="text-align:center;" v-show="resCount>10">'+
                            '<Page :total="resCount" :current="pageNumber" @on-change="PageDown" />' +
                        '</div>'+
                        '</div>'+
                    '</div>'
                    
                }
            },
            
            {
                path:'/opVideoManagement',
                component:{
                    methods: {
                    	getOpArticleList:function(value) {
                    		axios.get('getOpVideoList',{params: {
                    			Page: value,
                    			ResName:this.resourceName,
                    			UserID:this.userID
                    			}
                            }).then(res=>{
                                  this.resList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        getOpArticleCount:function() {
                    		axios.get('getOpVideoCount',{params: {
                    			ResName:this.resourceName,
                    			UserID:this.userID
                    			}},{
                                header:{
                                    'Content-Type':'application/x-www-form-urlencoded'
                                }
                            }).then(res=>{
                                  this.resCount=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        deleteBtn:function(value) {
                        	this.$Modal.confirm({
                        		title:"你确定要以管理员身份删除这个资源吗？",
                        		content:"被删除的资源不能被找回奥！",
                        		closable:true,
                        		onOk: () => {
                        			console.log("删除了"+value);
                        			axios.delete('opResource',{params: {ResID: value}
                                    }).then(res=>{
                                    	this.getOpArticleCount();
                                    	this.getOpArticleList(0);
                                    }).catch(err=>{
                                     
                                    });
                                },
                        		onCancel: () => {
                        			console.log("点击了取消");
                        		}
                        	});
                        },
                        PageDown:function(value) {
                        	this.pageNumber=value;
                        	this.$Message.info('当前页面:'+this.pageNumber+'页');
                        	this.getOpArticleList((value-1)*10);
                        	this.getOpArticleCount();
                        },
                        eyeBtn:function(value) {
                        	window.open("video.html?name="+value);
                        },
                        userBtn:function(value) {
                        	window.open("user.html?name="+value);
                        },
                        searchBtn:function() {
                        	this.getOpArticleList(0);
                        	this.getOpArticleCount();
                        },
                        clearBtn:function() {
                        	this.pageNumber=1;
                        	this.resourceName=null;
                        	this.userID=null;
                        	this.getOpArticleList(0);
                        	this.getOpArticleCount();
                        },
                        
               },
                    data: function () {
                        return {
                        	userInfo:'',
                        	resList:{},
                        	resCount:0,
                        	pageNumber:1,
                        	resourceName:'',
                        	userID:'',
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        //
                        this.getOpArticleList(0);
                        // 获取资源数量
                        this.getOpArticleCount();
                        
                    },
                    template:
                    '<div class="content-card">'+
                        '<divider><h1 class="font-type">(管理员)视频管理</h1></divider>'+
                        '<div class="card-900-body">'+
                        '<div class="card-row">'+
                        '<row>'+
                        '<i-col span="8">'+
                            '<Input v-model="resourceName" style="width: 160px" placeholder="资源名称关键字" />'+
                        '</i-col >'+
                        '<i-col span="8">'+
                            '<Input v-model="userID" style="width: 160px" placeholder="用户ID" />'+
                        '</i-col >'+
                        '<i-col span="4">'+
                            '<span>'+
                                '<i-button type="primary" class="button-ordinary" style="width:90px" @click="searchBtn" icon="md-search">查找</i-button>'+
                            '</span>'+
                        '</i-col >'+
                        
                        '<i-col span="4">'+
                            '<span>'+
                                '<i-button type="primary" class="button-ordinary" style="width:90px" @click="clearBtn" icon="md-close">重置</i-button>'+
                            '</span>'+
                        '</i-col >'+
                        '</row>'+
                        '</div>'+
                        '<div class="card-row">'+
                        '<List item-layout="vertical">'+
                        '<ListItem v-for="item in resList" :key="item.RES_ID">'+
                            '<ListItemMeta :title="item.RESOURCES_TITLE" :description="item.RESOURCES_LABEL" />'+
                               '<Icon type="md-time" />{{ item.UPLOAD_TIME }}'+
                               '<template slot="action">'+
                                  '<li>'+
                                      '<Icon type="md-folder" /> {{item.FILE_NUMBER}}'+
                                  '</li>'+
                                  '<li>'+
                                      '<Icon type="md-flame" /> {{item.CHECK_NUMBER}}'+
                                  '</li>'+
                                  '<li>'+
                                      '<Icon type="md-text" /> {{item.COMMENT_NUMBER}}'+
                                 '</li>'+
                                 '<li>'+
                                      '<span><Icon type="md-trash" /></span><a @click="deleteBtn(item.RES_ID)" class="a-ordinary">删除</a>'+
                                 '</li>'+
                                 '<li>'+
                                     '<span><Icon type="md-eye" /></span><a @click="eyeBtn(item.RES_ID)" class="a-ordinary">查看</a>'+
                                 '</li>'+
                             '</template>'+
                             '<template slot="extra">'+
                                 '<img v-bind:src="\'getResourcesCover?CoverName=\' + item.RESOURCES_COVER_SRC" style="width: 280px;border-radius:5px;">'+
                            '</template>'+
                       '</ListItem>'+
                   '</List>'+
                        '</div>'+
                        '<div class="card-row" style="text-align:center;">'+
                            '<Page :total="resCount" :current="pageNumber" @on-change="PageDown" />' +
                        '</div>'+
                        '</div>'+
                    '</div>'
                    
                }
            },
            
            {
                path:'/opArticleManagement',
                component:{
                    methods: {
                    	getOpArticleList:function(value) {
                    		axios.get('getOpArticleList',{params: {
                    			Page: value,
                    			ResName:this.resourceName,
                    			UserID:this.userID
                    			}
                            }).then(res=>{
                                  this.videoList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        getOpArticleCount:function() {
                    		axios.get('getOpArticleCount',{params: {
                    			ResName:this.resourceName,
                    			UserID:this.userID
                    			}},{
                                header:{
                                    'Content-Type':'application/x-www-form-urlencoded'
                                }
                            }).then(res=>{
                                  this.videoCount=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        deleteBtn:function(value) {
                        	this.$Modal.confirm({
                        		title:"你确定要以管理员身份删除这个资源吗？",
                        		content:"被删除的资源不能被找回奥！",
                        		closable:true,
                        		onOk: () => {
                        			console.log("删除了"+value);
                        			axios.delete('opArticleResource',{params: {ResID: value}
                                    }).then(res=>{
                                    	this.getOpArticleCount();
                                    	this.getOpArticleList(0);
                                    }).catch(err=>{
                                     
                                    });
                                },
                        		onCancel: () => {
                        			console.log("点击了取消");
                        		}
                        	});
                        },
                        PageDown:function(value) {
                        	this.pageNumber=value;
                        	this.$Message.info('当前页面:'+this.pageNumber+'页');
                        	this.getOpArticleList((value-1)*10);
                        	this.getOpArticleCount();
                        },
                        eyeBtn:function(value) {
                        	window.open("article.html?name="+value);
                        },
                        userBtn:function(value) {
                        	window.open("user.html?name="+value);
                        },
                        searchBtn:function() {
                        	this.getOpArticleList(0);
                        	this.getOpArticleCount();
                        },
                        clearBtn:function() {
                        	this.pageNumber=1;
                        	this.resourceName=null;
                        	this.userID=null;
                        	this.getOpArticleList(0);
                        	this.getOpArticleCount();
                        },
                        
               },
                    data: function () {
                        return {
                        	userInfo:'',
                        	videoList:{},
                        	videoCount:0,
                        	pageNumber:1,
                        	resourceName:'',
                        	userID:'',
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        //
                        this.getOpArticleList(0);
                        // 获取资源数量
                        this.getOpArticleCount();
                        
                    },
                    template:
                    '<div class="content-card">'+
                        '<divider><h1 class="font-type">(管理员)文章管理</h1></divider>'+
                        '<div class="card-900-body">'+
                        '<div class="card-row">'+
                        '<row>'+
                        '<i-col span="8">'+
                            '<Input v-model="resourceName" style="width: 160px" placeholder="资源名称关键字" />'+
                        '</i-col >'+
                        '<i-col span="8">'+
                            '<Input v-model="userID" style="width: 160px" placeholder="用户ID" />'+
                        '</i-col >'+
                        '<i-col span="4">'+
                            '<span>'+
                                '<i-button type="primary" class="button-ordinary" style="width:90px" @click="searchBtn" icon="md-search">查找</i-button>'+
                            '</span>'+
                        '</i-col >'+
                        
                        '<i-col span="4">'+
                            '<span>'+
                                '<i-button type="primary" class="button-ordinary" style="width:90px" @click="clearBtn" icon="md-close">重置</i-button>'+
                            '</span>'+
                        '</i-col >'+
                        '</row>'+
                        '</div>'+
                        '<div class="card-row">'+
                        '<List item-layout="vertical">'+
                            '<ListItem v-for="item in videoList" :key="item.RES_ID">'+
                                '<ListItemMeta :title="item.RESOURCES_TITLE" :description="item.RESOURCES_LABEL" />'+
                                   '<Icon type="md-time" />{{ item.UPLOAD_TIME }}'+
                                   '<template slot="action">'+
                                      '<li>'+
                                          '<Icon type="md-flame" /> {{item.CHECK_NUMBER}}'+
                                      '</li>'+
                                      '<li>'+
                                          '<Icon type="md-text" /> {{item.COMMENT_NUMBER}}'+
                                     '</li>'+
                                     '<li>'+
                                         '<span><Icon type="md-person" /></span><a @click="userBtn(item.USER_ID)" class="a-ordinary">{{item.USER_NAME}}</a>'+
                                     '</li>'+
                                     '<li>'+
                                          '<span><Icon type="md-trash" /></span><a @click="deleteBtn(item.RES_ID)" class="a-ordinary">删除</a>'+
                                     '</li>'+
                                     '<li>'+
                                         '<span><Icon type="md-eye" /></span><a @click="eyeBtn(item.RES_ID)" class="a-ordinary">查看</a>'+
                                     '</li>'+
                                    
                                 '</template>'+
                           '</ListItem>'+
                       '</List>'+
                        '</div>'+
                        '<div class="card-row" style="text-align:center;">'+
                            '<Page :total="videoCount" :current="pageNumber" @on-change="PageDown" />' +
                        '</div>'+
                        '</div>'+
                    '</div>'
                    
                }
            },
            
            {
                path:'/iFollow',
                component:{
                    methods: {
                    	
                    	PageDown:function(value) {
                        	this.pageNumber=value;
                        	this.$Message.info('当前页面:'+this.pageNumber+'页');
                        	axios.get('getIFollowList',{params: {
                        		Page:(this.pageNumber-1)*10,
                        	}
                            }).then(res=>{
                                  this.followList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        getFollowNumber:function(){
                        	axios.get('getIFollowNumber',{params: {
                        	}
                            }).then(res=>{
                                  this.followNumber=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        unsubscribe:function(value){
                        	axios.delete('attention',{params: {UserID: value,}
                            }).then(res=>{
                         	   this.$Message.info('取消关注！');
                         	   this.attentionStatus=!this.attentionStatus;
                            }).catch(err=>{
                             
                            });
                        	this.pageNumber=1;
                        	this.PageDown(1);
                        	this.getFollowNumber();
                        	
                        	
                        },
                    },
                    data: function () {
                        return {
                        	followList:{},
                        	followNumber:null,
                        	pageNumber:1,
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        this.getFollowNumber();
                        this.PageDown(1);
                    },
                    template:
                    '<div v-bind:class="followNumber!=0? \'content-card\':\'content-background-card\'">'+
                        '<divider><h1 class="font-type">我关注的用户</h1></divider>'+
                        '<div class="card-900-body">'+
                        '<div class="card-row">'+
                        '<List>'+
                            '<ListItem v-for="item in followList" :key="item.RES_ID">'+
                                '<ListItemMeta :title="\'用户名:\'+item.USER_NAME" :description="\'个人描述:\'+item.USER_DESCRIPTION" />'+
                                '<template slot="action">'+
                                    '<li>'+
                                        '<p>{{item.USER_LEVEL}}</p>'+
                                    '</li>'+
                                    '<li>'+
                                        '<a class="a-ordinary" @click="unsubscribe(item.USER_ID)">取消关注</a>'+
                                    '</li>'+
                                    '<li>'+
                                        '<a class="a-ordinary" :href="\'user.html?name=\'+item.USER_ID">查看</a>'+
                                    '</li>'+
                                '</template>'+
                            '</ListItem>'+
                        '</List>'+
                    '</div>'+
                    '<div class="card-row font-p-type" style="text-align: center; margin-top: 30px;" v-show="followNumber==0">'+
						'<p>你没有关注其他人!</p>'+
					'</div>'+
					'<div class="card-row" style="text-align: center;" v-show="followNumber>10">'+
						'<page :total="followNumber" :current="pageNumber" @on-change="PageDown" show-elevator ></page>'+
						'</div>'+
                        '</div>'+
                    '</div>'
                    
                }
            },
            
            {
                path:'/followMe',
                component:{
                    methods: {
                    	PageDown:function(value) {
                        	this.pageNumber=value;
                        	this.$Message.info('当前页面:'+this.pageNumber+'页');
                        	axios.get('getFollowMeList',{params: {
                        		Page:(this.pageNumber-1)*10,
                        	}
                            }).then(res=>{
                                  this.followList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        getFollowNumber:function(){
                        	axios.get('getFollowMeNumber',{params: {
                        	}
                            }).then(res=>{
                                  this.followNumber=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                    },
                    data: function () {
                        return {
                        	followList:{},
                        	followNumber:null,
                        	pageNumber:1,
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        this.getFollowNumber();
                        this.PageDown(1);
                    },
                    template:
                    '<div v-bind:class="followNumber!=0? \'content-card\':\'content-background-card\'">'+
                        '<divider><h1 class="font-type">关注我的用户</h1></divider>'+
                        '<div class="card-900-body">'+
                        '<div class="card-row">'+
                        '<List>'+
                            '<ListItem v-for="item in followList" :key="item.RES_ID">'+
                                '<ListItemMeta :title="\'用户名:\'+item.USER_NAME" :description="\'个人描述:\'+item.USER_DESCRIPTION" />'+
                                '<template slot="action">'+
                                    '<li>'+
                                        '<p>{{item.USER_LEVEL}}</p>'+
                                    '</li>'+
                                    '<li>'+
                                        '<a class="a-ordinary" :href="\'user.html?name=\'+item.USER_ID">查看</a>'+
                                    '</li>'+
                                '</template>'+
                            '</ListItem>'+
                        '</List>'+
                    '</div>'+
                    '<div class="card-row font-p-type" style="text-align: center; margin-top: 30px;" v-show="followNumber==0">'+
						'<p>还没有人关注你!</p>'+
					'</div>'+
					'<div class="card-row" style="text-align: center;" v-show="followNumber>10">'+
						'<page :total="followNumber" :current="pageNumber" @on-change="PageDown" show-elevator ></page>'+
					'</div>'+
                        '</div>'+
                    '</div>'
                    
                }
            },
            
            {
                path:'/myComment',
                component:{
                    methods: {
                        getResourcesTypeMap:function() {
                            axios.get('getResourcesTypeMap',{params: {}
                            }).then(res=>{
                                  this.resourceType=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        searchBtn:function() {
                        	axios.get('getMyComment',{params: {
                        		ResName:this.resourceName,
                        		ComWords:this.commentWords,
                        		ResType:this.selectResourceType,
                        		Page:0,
                        	}
                            }).then(res=>{
                                  this.commentList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        	
                        	axios.get('getMyCommentNumber',{params: {
                        		ResName:this.resourceName,
                        		ComWords:this.commentWords,
                        		ResType:this.selectResourceType,
                        	}
                            }).then(res=>{
                                  this.commentNumber=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        clearBtn:function() {
                        	this.selectResourceType=null;
                        	this.resourceName=null;
                        	this.commentWords=null;
                        	this.searchBtn();
                        },
                        PageDown:function(value) {
                        	this.pageNumber=value;
                        	this.$Message.info('当前页面:'+this.pageNumber+'页');
                        	axios.get('getMyComment',{params: {
                        		ResName:this.resourceName,
                        		ComWords:this.commentWords,
                        		ResType:this.selectResourceType,
                        		Page:(this.pageNumber-1)*10,
                        	}
                            }).then(res=>{
                                  this.commentList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        deleteBtn:function(value) {
                        	this.$Modal.confirm({
                        		title:"你确定要删除这个评论吗？",
                        		content:"被删除的评论不能被找回奥！",
                        		closable:true,
                        		onOk: () => {
                        			console.log("删除了"+value);
                        			axios.delete('comment',{params: {CommID: value}
                                    }).then(res=>{
                                    	this.searchBtn();
                                    }).catch(err=>{
                                     
                                    });
                                },
                        		onCancel: () => {
                        			console.log("点击了取消");
                        		}
                        	});
                        },
                    },
                    data: function () {
                        return {
                        	resourceName:'',
                        	commentWords:'',
                        	resourceType:{},
                        	selectResourceType:'',
                        	commentList:{},
                        	commentNumber:null,
                        	pageNumber:1,
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        this.getResourcesTypeMap();
                        this.searchBtn();
                    },
                    template:
                    '<div v-bind:class="commentNumber!=0? \'content-card\':\'content-background-card\'">'+
                        '<divider><h1 class="font-type">我的评论</h1></divider>'+
                        '<div class="card-900-body">'+
                            '<div class="card-row">'+
                                '<row>'+
                                    '<i-col span="6">'+
                                        '<Input v-model="resourceName" style="width: 160px" placeholder="资源名称关键字" />'+
                                    '</i-col >'+
                                    '<i-col span="6">'+
                                        '<Input v-model="commentWords" style="width: 160px" placeholder="评论关键字" />'+
                                    '</i-col >'+
                                    '<i-col span="6">'+
                                        '<i-select v-model="selectResourceType" placeholder="资源类型" style="width:160px">'+
                                            '<i-option v-for="item in resourceType"  :value="item.DATA_ID" :key="item.DATA_ID">{{ item.DATA_INFO }}</i-option>'+
                                        '</i-select>'+
                                    '</i-col >'+
                                    '<i-col span="3">'+
                                      
                                        '<span>'+
                                            '<i-button type="primary" class="button-ordinary" style="width:90px" @click="searchBtn" icon="md-search">查找</i-button>'+
                                        '</span>'+
                                    '</i-col >'+
                                    
                                    '<i-col span="3">'+
                                       
                                        '<span>'+
                                            '<i-button type="primary" class="button-ordinary" style="width:90px" @click="clearBtn" icon="md-close">重置</i-button>'+
                                        '</span>'+
                                    '</i-col >'+
                                '</row>'+
                            '</div>'+
                            '<div class="card-row">'+
                                '<List>'+
                                    '<ListItem v-for="item in commentList" :key="item.RES_ID">'+
                                        '<ListItemMeta :title="\'评论内容:\'+item.COMMENT_CONTENT" :description="\'资源标题:\'+item.RESOURCES_TITLE" />'+
                                        '<template slot="action">'+
                                            '<li>'+
                                                '<p>{{item.RESOURCES_TYPE_INFO}}</p>'+
                                            '</li>'+
                                            '<li>'+
                                                '<p>{{item.COMMENT_DATE}}</p>'+
                                            '</li>'+
                                            '<li>'+
                                                '<a @click="deleteBtn(item.COMM_ID)" class="a-ordinary">删除评论</a>'+
                                            '</li>'+
                                            '<li v-if="item.RESOURCES_TYPE == \'1\'">'+
                                                '<a class="a-ordinary" :href="\'video.html?name=\'+item.RESOURCES_ID">查看</a>'+
                                            '</li>'+
                                            '<li v-else-if="item.RESOURCES_TYPE == \'2\'">'+
                                                '<a class="a-ordinary" :href="\'article.html?name=\'+item.RESOURCES_ID">查看</a>'+
                                            '</li>'+
                                            '<li v-else>'+
                                                '<a class="a-ordinary" :href="\'other.html?name=\'+item.RESOURCES_ID">查看</a>'+
                                            '</li>'+
                                        '</template>'+
                                    '</ListItem>'+
                                '</List>'+
                            '</div>'+
                            '<div class="card-row font-p-type" style="text-align: center; margin-top: 30px;" v-show="commentNumber==0">'+
                            	'<p>没有找到这种评论哟!</p>'+
							'</div>'+
							'<div class="card-row" style="text-align: center;" v-show="commentNumber>10">'+
								'<page :total="commentNumber" :current="pageNumber" @on-change="PageDown" show-elevator ></page>'+
							'</div>'+
                        '</div>'+
                    '</div>'
                    
                }
            },
            
            {
                path:'/readReviews',
                component:{
                    methods: {
                        getResourcesTypeMap:function() {
                            axios.get('getResourcesTypeMap',{params: {}
                            }).then(res=>{
                                  this.resourceType=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        searchBtn:function() {
                        	axios.get('getUserComment',{params: {
                        		ResName:this.resourceName,
                        		ComWords:this.commentWords,
                        		ResType:this.selectResourceType,
                        		Page:0,
                        	}
                            }).then(res=>{
                                  this.commentList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        	
                        	axios.get('getUserCommentNumber',{params: {
                        		ResName:this.resourceName,
                        		ComWords:this.commentWords,
                        		ResType:this.selectResourceType,
                        	}
                            }).then(res=>{
                                  this.commentNumber=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        clearBtn:function() {
                        	this.selectResourceType=null;
                        	this.resourceName=null;
                        	this.commentWords=null;
                        	this.searchBtn();
                        },
                        PageDown:function(value) {
                        	this.pageNumber=value;
                        	this.$Message.info('当前页面:'+this.pageNumber+'页');
                        	axios.get('getUserComment',{params: {
                        		ResName:this.resourceName,
                        		ComWords:this.commentWords,
                        		ResType:this.selectResourceType,
                        		Page:(this.pageNumber-1)*10,
                        	}
                            }).then(res=>{
                                  this.commentList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                    },
                    data: function () {
                        return {
                        	resourceName:'',
                        	commentWords:'',
                        	resourceType:{},
                        	selectResourceType:'',
                        	commentList:{},
                        	commentNumber:null,
                        	pageNumber:1,
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        this.getResourcesTypeMap();
                        this.searchBtn();
                    },
                    template:
                    '<div v-bind:class="commentNumber!=0? \'content-card\':\'content-background-card\'">'+
                        '<divider><h1 class="font-type">查看其他用户给我的评论</h1></divider>'+
                        '<div class="card-900-body">'+
                            '<div class="card-row">'+
                                '<row>'+
                                    '<i-col span="6">'+
                                        
                                        '<Input v-model="resourceName" style="width: 160px" placeholder="请输入资源名称关键字" />'+
                                    '</i-col >'+
                                    '<i-col span="6">'+
                                        
                                        '<Input v-model="commentWords" style="width: 160px" placeholder="请输入评论关键字" />'+
                                    '</i-col >'+
                                    '<i-col span="6">'+
                                        
                                        '<i-select v-model="selectResourceType" placeholder="资源类型" style="width:160px">'+
                                            '<i-option v-for="item in resourceType" :value="item.DATA_ID" :key="item.DATA_ID">{{ item.DATA_INFO }}</i-option>'+
                                        '</i-select>'+
                                    '</i-col >'+
                                    '<i-col span="3">'+
                                        
                                        '<span>'+
                                            '<i-button type="primary" class="button-ordinary" style="width:90px" @click="searchBtn" icon="md-search">查找</i-button>'+
                                        '</span>'+
                                    '</i-col >'+
                                    
                                    '<i-col span="3">'+
                                        
                                        '<span>'+
                                            '<i-button type="primary" class="button-ordinary" style="width:90px" @click="clearBtn" icon="md-close">重置</i-button>'+
                                        '</span>'+
                                    '</i-col >'+
                                '</row>'+
                            '</div>'+
                            '<div class="card-row">'+
                                '<List>'+
                                    '<ListItem v-for="item in commentList" :key="item.RES_ID">'+
                                        '<ListItemMeta :title="\'评论内容:\'+item.COMMENT_CONTENT" :description="\'资源标题:\'+item.RESOURCES_TITLE" />'+
                                        '<template slot="action">'+
                                            '<li>'+
                                                '<p>{{item.RESOURCES_TYPE_INFO}}</p>'+
                                            '</li>'+
                                            '<li>'+
                                                '<p>{{item.COMMENT_DATE}}</p>'+
                                            '</li>'+
                                            '<li>'+
                                                '<a v-bind:href="\'user.html?name=\'+item.USER_ID" class="a-ordinary">{{item.REVIEW_USER}}</a>'+
                                            '</li>'+
                                            '<li v-if="item.RESOURCES_TYPE == \'1\'">'+
                                                '<a class="a-ordinary" :href="\'video.html?name=\'+item.RESOURCES_ID">查看</a>'+
                                            '</li>'+
                                            '<li v-else-if="item.RESOURCES_TYPE == \'2\'">'+
                                                '<a class="a-ordinary" :href="\'article.html?name=\'+item.RESOURCES_ID">查看</a>'+
                                            '</li>'+
                                            '<li v-else>'+
                                                '<a class="a-ordinary" :href="\'other.html?name=\'+item.RESOURCES_ID">查看</a>'+
                                            '</li>'+
                                        '</template>'+
                                    '</ListItem>'+
                                '</List>'+
                            '</div>'+
                            '<div class="card-row font-p-type" style="text-align: center; margin-top: 30px;" v-show="commentNumber==0">'+
                            	'<p>没有人给你评论哟!</p>'+
							'</div>'+
							'<div class="card-row" style="text-align: center;" v-show="commentNumber>10">'+
								'<page :total="commentNumber" :current="pageNumber" @on-change="PageDown" show-elevator ></page>'+
							'</div>'+
                        '</div>'+
                    '</div>'
                    
                }
            },
            
            {
                path:'/articleManagement',
                component:{
                    methods: {
                    	getUserArticleList:function(value) {
                    		axios.get('getUserArticleList',{params: {Page: value}
                            }).then(res=>{
                                  this.resList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        getUserArticleCount:function() {
                    		axios.get('getUserArticleCount',null,{
                                header:{
                                    'Content-Type':'application/x-www-form-urlencoded'
                                }
                            }).then(res=>{
                                  this.resCount=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        deleteBtn:function(value) {
                        	this.$Modal.confirm({
                        		title:"你确定要删除这个资源吗？",
                        		content:"被删除的资源不能被找回奥！",
                        		closable:true,
                        		onOk: () => {
                        			console.log("删除了"+value);
                        			axios.delete('userResource',{params: {ResID: value}
                                    }).then(res=>{
                                    	this.getUserArticleCount();
                                    	this.getUserArticleList(0);
                                    }).catch(err=>{
                                     
                                    });
                                },
                        		onCancel: () => {
                        			console.log("点击了取消");
                        		}
                        	});
                        },
                        PageDown:function(value) {
                        	this.pageNumber=value;
                        	this.$Message.info('当前页面:'+this.pageNumber+'页');
                        	this.getUserArticleList((value-1)*10);
                        },
                        eyeBtn:function(value) {
                        	window.open("article.html?name="+value);
                        }
                    
               },
                    data: function () {
                        return {
                        	userInfo:'',
                        	resList:{},
                        	resCount:null,
                        	pageNumber:1,
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        //
                        this.getUserArticleList(0);
                        // 获取资源数量
                        this.getUserArticleCount();
                        
                    },
                    template:
                    '<div v-bind:class="resCount!=0? \'content-card\':\'content-background-card\'" >'+
                        '<divider><h1 class="font-type">个人文章管理</h1></divider>'+
                        '<div class="card-1150-body">'+
                        '<div class="card-row">'+
                        '<List item-layout="vertical">'+
                            '<ListItem v-for="item in resList" :key="item.RES_ID">'+
                                '<ListItemMeta :title="item.RESOURCES_TITLE" :description="item.RESOURCES_LABEL" />'+
                                   '<Icon type="md-time" />{{ item.UPLOAD_TIME }}'+
                                   '<template slot="action">'+
                                      '<li>'+
                                          '<Icon type="md-flame" /> {{item.CHECK_NUMBER}}'+
                                      '</li>'+
                                      '<li>'+
                                          '<Icon type="md-text" /> {{item.COMMENT_NUMBER}}'+
                                     '</li>'+
                                     '<li>'+
                                          '<span><Icon type="md-trash" /></span><a @click="deleteBtn(item.RES_ID)" class="a-ordinary">删除</a>'+
                                     '</li>'+
                                     '<li>'+
                                         '<span><Icon type="md-eye" /></span><a @click="eyeBtn(item.RES_ID)" class="a-ordinary">查看</a>'+
                                     '</li>'+
                                 '</template>'+
                           '</ListItem>'+
                       '</List>'+
                        '</div>'+
                        '<div class="card-row font-p-type" style="text-align: center; margin-top: 30px;" v-show="resCount==0">'+
							'<p>你没有上传过哟!</p>'+
						'</div>'+
						'<div class="card-row" style="text-align: center;" v-show="resCount>10">'+
							'<page :total="resCount" @on-change="PageDown" show-elevator ></page>'+
						'</div>'+
                        '</div>'+
                    '</div>'
                    
                }
            },
            {
                path:'/otherManagement',
                component:{
                    methods: {
                    	getUserOtherList:function(value,type) {
                    		axios.get('getUserOtherList',{params: {Page: value,ResType:type}
                            }).then(res=>{
                                  this.resList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        getUserOtherCount:function(type) {
                    		axios.get('getUserOtherCount',{params: {ResType:type}
                            },{
                                header:{
                                    'Content-Type':'application/x-www-form-urlencoded'
                                }
                            }).then(res=>{
                                  this.resCount=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        deleteBtn:function(value) {
                        	this.$Modal.confirm({
                        		title:"你确定要删除这个资源吗？",
                        		content:"被删除的资源不能被找回奥！",
                        		closable:true,
                        		onOk: () => {
                        			console.log("删除了"+value);
                        			axios.delete('userResources',{params: {ResID: value}
                                    }).then(res=>{
                                    	this.getUserOtherCount();
                                    	this.getUserOtherList(0);
                                    }).catch(err=>{
                                     
                                    });
                                },
                        		onCancel: () => {
                        			console.log("点击了取消");
                        		}
                        	});
                        },
                        PageDown:function(value) {
                        	this.pageNumber=value;
                        	this.$Message.info('当前页面:'+this.pageNumber+'页');
                        	this.getUserOtherList((value-1)*10,this.selectResourceType);
                        	this.getUserOtherCount(this.selectResourceType);
                        },
                        eyeBtn:function(value) {
                        	window.open("other.html?name="+value);
                        },
                        getResourcesTypeMap:function() {
                            axios.get('getOtherResourcesTypeMap',{params: {}
                            }).then(res=>{
                                  this.resourcesType=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        selectDown:function(value) {
                        	this.getUserOtherList(0,value);
                        	this.getUserOtherCount(value);
                        },
               },
                    data: function () {
                        return {
                        	userInfo:'',
                        	resList:{},
                        	resCount:null,
                        	pageNumber:1,
                        	resourcesType:[],
                        	selectResourceType:3,
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        // 获取资源数量
                        this.getResourcesTypeMap();
                        this.getUserOtherList(0,this.selectResourceType);
                    	this.getUserOtherCount(this.selectResourceType);
                        
                    },
                    template:
                    '<div v-bind:class="resCount!=0? \'content-card\':\'content-background-card\'" >'+
                        '<divider><h1 class="font-type">个人文档、软件或其他资源管理</h1></divider>'+
                        '<div class="card-1150-body">'+
                        '<div class="card-row" style="text-align:center;">'+
	                        '<divider dashed ><p class="font-p-type">资源分类</p></divider>'+
	                        '<i-select v-model="selectResourceType" @on-change="selectDown" placeholder="资源类型" style="width:500px">'+
	                            '<i-option v-for="item in resourcesType"  :value="item.DATA_ID" :key="item.DATA_ID">{{ item.DATA_INFO }}</i-option>'+
	                        '</i-select>'+
	                    '</div>'+
                        '<div class="card-row">'+
                        '<List item-layout="vertical">'+
                            '<ListItem v-for="item in resList" :key="item.RES_ID">'+
                                '<ListItemMeta :title="item.RESOURCES_TITLE" :description="item.RESOURCES_LABEL" />'+
                                   '<Icon type="md-time" />{{ item.UPLOAD_TIME }}'+
                                   '<template slot="action">'+
                                      '<li>'+
                                          '<Icon type="md-folder" /> {{item.FILE_NUMBER}}'+
                                      '</li>'+
                                      '<li>'+
                                          '<Icon type="md-flame" /> {{item.CHECK_NUMBER}}'+
                                      '</li>'+
                                      '<li>'+
                                          '<Icon type="md-text" /> {{item.COMMENT_NUMBER}}'+
                                     '</li>'+
                                     '<li>'+
                                          '<span><Icon type="md-trash" /></span><a @click="deleteBtn(item.RES_ID)" class="a-ordinary">删除</a>'+
                                     '</li>'+
                                     '<li>'+
                                         '<span><Icon type="md-eye" /></span><a @click="eyeBtn(item.RES_ID)" class="a-ordinary">查看</a>'+
                                     '</li>'+
                                 '</template>'+
                                 '<template slot="extra">'+
                                     '<img v-bind:src="\'getResourcesCover?CoverName=\' + item.RESOURCES_COVER_SRC" style="width: 280px;border-radius:5px;">'+
                                '</template>'+
                           '</ListItem>'+
                       '</List>'+
                        '</div>'+
                        '<div class="card-row font-p-type" style="text-align: center; margin-top: 30px;" v-show="resCount==0">'+
							'<p>你没有上传过哟!</p>'+
						'</div>'+
						'<div class="card-row" style="text-align: center;" v-show="resCount>10">'+
							'<page :total="resCount" @on-change="PageDown" show-elevator ></page>'+
						'</div>'+
                        '</div>'+
                    '</div>'
                    
                }
            },
            
            {
                path:'/otherResourceUpload',
                component:{
                	data: function () {
                        return {
                          uploadPlayShow:false,
                          contentShow:false,
                          uploadPlay:0,
                          fileSize:"",
                          fileType:"",
                          fileName:"",
                          resourcesTitle:"",
                          resourcesLabel:"",
                          resourcesType:[],
                          selectResourceType:"",
                          uploadFileList:null,
                          editor:null,
                          pageImgShow:false,
                          floatCount:0.0,
                        }
                      },
                      methods: {
                          uploadBtnDown:function() {
                          	document.getElementById("files").click();
                          },
                          selectFileOver:function() {
                          	
                          },
                          getContent:function () {
                          	this.$Modal.info({
                                title: 'Markdown',
                                content: this.editor.getContent(),
                            });
                          },
                          getHtml:function(){
                            this.$Modal.info({
                                title: 'Html',
                                content: '<xmp style="white-space:normal;">'+this.editor.getHtml()+'</xmp>',
                            });
                          },
                          isUploadFile:function() {
                        	  axios.get('isUploadFile',null,{
                                  header:{
                                      'Content-Type':'application/x-www-form-urlencoded'
                                  }
                              }).then(res=>{
                                    if(res.data.code==0) {
                                      this.$Notice.info({
                                         title: '你有上传文件的记录哟！',
                                         desc: '可以上传多个文件！'
                                     });
                                      this.uploadFileList=res.data.data;
                                      //显示内容
                                      this.contentShow=true;
                                    }
                              }).catch(err=>{
                               
                              });
                          },
                          getResourcesTypeMap:function() {
                              axios.get('getOtherResourcesTypeMap',{params: {}
                              }).then(res=>{
                                    this.resourcesType=res.data.data;
                              }).catch(err=>{
                               
                              });
                          },
                          downSubmitBtn:function() {
                              
                              let isurl='uploadOtherResourcesInfo';
                              let map={
                                  ResTitle: this.resourcesTitle,
                                  ResMark: this.editor.getContent(),
                                  ResHtml: this.editor.getHtml(),
                                  ResLabel: this.resourcesLabel,
                                  ResType: this.selectResourceType,
                              };
                              axios.post(isurl,Qs.stringify(map),{
                                  header:{
                                      'Content-Type':'application/x-www-form-urlencoded'
                                  }
                              }).then(res=>{
                            	  if(res.data.code==1) {
                              		
                              		this.$Notice.error({
                              			title: '提交失败!',
                              			desc: '接下来干什么呢?',
                              			duration: 2,
                              		});
                              	}
                              	else {
                              		this.$Notice.success({
                              			title: '提交成功',
                              			desc: '接下来干什么呢?',
                              			duration: 2,
                              		});
                              		// 返回头部
                              		$('html').animate( {scrollTop: 0}, 1000);
                              		this.fileSize=null;
                              		this.fileType=null;
                              		this.fileName=null;
                              		this.fileSize=null;
                              		this.resourcesTitle=null;
                              		this.resourcesLabel=null;
                              		this.uploadFileList=null;
                              		document.getElementById('md_editor').value=null;
                              		this.uploadPlayShow=false;
                              		this.contentShow=false;
                              		var preview = document.getElementById("pageImg");
                              		preview.src="";
                              		this.pageImgShow=false;
                              	}
                              }).catch(err=>{
                              	
                              });
                          },
                          downUploadBtn: function () {
                              document.getElementById("files").click();
                          },
                          downUploadImgBtn:function () {
                          	if(this.uploadPlay!=100&&this.uploadFileList==null) {
                          		this.$Notice.open(
                                          {
                                               title: '请等待资源上传完成',
                                               desc: '稍微等一下哦!',
                                               // 显示时间两秒
                                               duration: 2
                                          }
                                      );  
                          		return;
                          	}
                              document.getElementById("imgfile").click();
                          },
                          searchEvents:function() {
                          	// window.open("searchResources?name="+this.resources,
							// "_blank");
                          	window.open("searchResources?name="+this.resources);
                          },
                          selectImgOver:function () {
                              var _this=this;
                              // 获取封面文件对象
                              var preview = document.getElementById("pageImg");
                              var file    = document.getElementById("imgfile").files[0];
                              var inputFile =document.getElementById("imgfile");
                              // 开启文件读入流
                              var reader  = new FileReader();
                              // 转换大小单位
                              var size = file.size /1024/1024;
                              // 判断文件是否选中
                              if (file) {
                                reader.readAsDataURL(file);
                              } else {
                                preview.src = "";
                              }
                              // 设置封面图片上传大小
                              if(size>3){
                              	this.$Notice.open(
                                          {
                                               title: '图片太大了!',
                                               desc: '图片大小不能超过3MB!',
                                               // 显示时间两秒
                                               duration: 2
                                          }
                                      );  
                                 inputFile.value="";
                                 return;
                              }
                              // 显示图片
                              this.pageImgShow=true;
                              
                              // 读入完成显示到图片控件
                              reader.onloadend = function () {
                                preview.src = reader.result;
                              }
                              
                              // 判断文件是否存在并将图片上传
                              if (file) {
                              	let reader = new FileReader();
                                  reader.readAsArrayBuffer(file);
                                  reader.addEventListener("load", function(e) {
                                	  
                                  spark = new SparkMD5.ArrayBuffer();
                                  var formData = new FormData();
                                      // 数据块文件名称
                                      formData.append('FileName', file.name);
                                      // 文件类型
                                      formData.append('FileType', file.type);
                                      // 文件大小
                                      formData.append('FileSize', file.size);
                                      // 将ArrayBuffer变为二进制类型 传输
                                      spark.append(e.target.result);
                                      var blob = new Blob([e.target.result], { type: "text/plain"});
                                      formData.append('File', blob);
                                      var md5=spark.end();
                                      formData.append('MD5', md5);
                                      // 输出日志信息
                                      console.log("FileName："+file.name);
                                      console.log("MD5："+md5);
                                      console.log("FileSize："+file.size);
                                      // 创建Ajax对象
                                      $.ajax({
                                          url: 'uploadResourcesCover',
                                          type: 'post',
                                          data: formData,
                                          cache: false,
                                          processData: false,
                                          contentType: false,
                                          success : function(response,status,xhr) {
                                              _this.$Notice.success(
                                                      {
                                                          title: '封面上传成功!',
                                                          desc: '填写资源信息吧!',
                                                          // 显示时间两秒
                                                          duration: 2
                                                     }
                                                 );
                                              inputFile.value="";
                                          },
                                          error: function (response,status,xhr) {
                                          
                                          }
                                      });
                                  });
                              }
                          },
                      },
                      mounted() {
                    	// 该函数会在组件加载时调用
                    	// 查看是否上传过文件
                        this.isUploadFile();
                        //获取资源类型
                        this.getResourcesTypeMap();
                    	// 定义一个休眠函数
                    	function sleep (time) {
                    		return new Promise((resolve) => setTimeout(resolve, time));
                    	}
                        console.log("组件执行");
                        // 创建文本域对象
                        this.editor = new mditor(document.getElementById('md_editor'));
                        // 将本对象传入其他方法中
                        var _this=this;
                        // 给上传控件设置change事件
                        document.getElementById('files').addEventListener('change', function () { 
                            // 重置上传进度条
                            _this.uploadPlay=0;
                            _this.floatCount=0.0;
                            // 文件切片对象解决兼容性问题
                            var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                            // 选择第一个文件
                            file = this.files[0];
                            if(file==null) {
                            	// 将进度条隐藏
                            	// _this.uploadPlayShow=false;
                            	// 如果没有选择则直接退出
                            	return;
                            }
                            // 显示文件信息
                            _this.fileSize=Math.ceil(file.size/1024/1024);
                            _this.fileName=file.name;
                            _this.fileType=file.type;
                            // 显示进度条
                            _this.uploadPlayShow=true;
                            //显示内容
                            _this.contentShow=true;
                            
                            // 将页面返回到头部
                            // 设置读取一次的文件大小
                            chunkSize = 2*1024*1024; // 2MB
                            chunks = Math.ceil(file.size / chunkSize);
                            console.log('分段数为:'+chunks);
                            currentChunk = 0;
                            spark = new SparkMD5.ArrayBuffer();
                            sparkChunk = new SparkMD5.ArrayBuffer();
                            fileReader = new FileReader();
                            fileReader.onload = function (e) {
                                console.log('加载中');
                                console.log('read chunk nr', currentChunk + 1, 'of', chunks);
                                spark.append(e.target.result);                   // Append
																					// array
																					// buffer
                                sparkChunk.append(e.target.result);
                                console.log('文件内数据');
                                console.log(e.target.result);
                                var md5Chunk=sparkChunk.end()
                                console.info('文件块Hash:', md5Chunk); 
                                
                                var slice = e.target.result;
                                let formData = new FormData();
                                // 数据块索引
                                formData.append('ChunkIndex', currentChunk);
                                // 数据块文件名称
                                formData.append('FileName', file.name);
                                // 将文件数组变为二进制类型 传输
                                var blob = new Blob([slice]);
                                // 将二进制文件变量添加到form对象中
                                formData.append("File", blob);
                                // 添加MD5码摘要 用来校验数据
                                formData.append('MD5', md5Chunk);
                                // 文件块大小
                                formData.append("ChunkSize",blob.size);
                                // 创建ajax对象
                                // Jquery Ajax上传
                                    $.ajax({
                                        url: 'uploadResources',
                                        type: 'POST',
                                        data: formData,
                                        cache: false,
                                        processData: false,
                                        contentType: false,
                                        success : function(response,status,xhr) {
                                            console.log(status);
                                            // 发送成功进行下一块发送
                                            currentChunk++;
                                            if (currentChunk < chunks) {
                                                loadNext();
                                                if(_this.uploadPlay+100.00/chunks>=100) {
                                                	_this.uploadPlay=100;
                                                }else {
                                                	_this.floatCount+=100/chunks;
                                                	_this.uploadPlay=Math.ceil(_this.floatCount);
                                                }
                                            } else {
                                                console.log('全部加载完毕');
                                                var fileMD5 = spark.end();
                                                console.info('文件整体Hash:', fileMD5);  // Compute
																						// hash
                                                // 准备合并数据参数
                                                var mergeData = new FormData();
                                                // 文件名
                                                mergeData.append('FileName', file.name);
                                                // 文件类型
                                                mergeData.append('FileType', file.type);
                                                console.log(file.type);
                                                // 文件名
                                                mergeData.append('ChunkCount', chunks);
                                                // 添加文件整体MD5码摘要 用来校验数据
                                                mergeData.append('MD5', fileMD5);
                                                // 文件块大小
                                                mergeData.append("FileSize",blob.size);
                                                
                                                function ajaxResult(data) {
                                                	var json = JSON.parse(data);
                                                	if(json.code=="0"){
                                                		_this.uploadFileList = json.data;
                                                	}
                                                }
                                                // 内嵌ajax
                                                $.ajax({
                                                    url:'mergeResourcesFile',
                                                    type: 'post',
                                                    data: mergeData,
                                                    cache: false,
                                                    processData: false,
                                                    contentType: false,
                                                    success: function (response,status,xhr) {
                                                    	var json = JSON.parse(response);
                                                        if(json.code=="0") {
                                                             _this.$Notice.success({
                                                                title: '上传成功！',
                                                                desc: '可以上传多个资源文件哦！'
                                                            });
                                                             document.getElementById('files').value="";
                                                        }else {
                                                            _this.$Notice.error({
                                                                title: '上传失败！',
                                                                desc: '好像没有登录或者已经上传过了！'
                                                            });
                                                    	}
                                                        _this.uploadPlay=100;
                                                    },
                                                    error: function (response,status,xhr) {
                                                        _this.$Notice.error({
                                                            title: '上传失败！',
                                                            desc: '网络好像不太好呢！'
                                                        });
                                                    }
                                                }).done(function(data){
                                                    // 闭包
                                                    ajaxResult(data);
                                                });
                                                // 内嵌结束
                                            }
                                        },
                                        error : function(response,status,xhr){
                                                
                                                if(response.status==404) {
                                                	_this.$Notice.error({
                                                        title: '请求地址错误或服务器已关闭',
                                                        desc: '',
                                                    });
                                                	return;
                                                }
                                                if(response.status==403) {
                                                	_this.$Notice.error({
                                                        title: '你没有登录呢',
                                                        desc: '',
                                                    });
                                                	return;
                                                }
                                                console.log('传输失败,准备从新发送');
                                                sleep(500).then(() => {
                                                	console.log("休眠");
                                                	$.ajax(this);
                                                })
                                                
                                        },
                                    });
                                    // Ajax结束
                               
                            };
                            
                            
                            // 出现异常信息
                            fileReader.onerror = function () {
                                console.warn('oops, something went wrong.');
                            };
                            // 判断读取数据是否结束以及读取下一次数据
                            function loadNext() {
                                var start = currentChunk * chunkSize,
                                    end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                                    console.log('开始:',start);
                                    console.log('结束:',end);
                                fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
                            }
                            loadNext();
                            
                        });
                        
                        
                    },
                    template:
                        '<div class="content-card">'+
                        '<divider><h1 class="font-type">书籍、软件、源码等其他资源上传</h1></divider>'+
                        '<div class="card-900-body">'+
                            '<div class="card-row">'+
                                '<input type="file" name="files" id="files" v-on:change="selectFileOver" hidden="hidden"/>'+
                                '<div class="upload-span" @click="uploadBtnDown" >'+
                                    '<icon type="ios-cloud-upload" size="52" style="color: #5c5e61"></icon>'+
                                    '<p>上传资源</p>'+
                                '</div>'+
                            '</div>'+

                                '<div class="card-row" v-show="uploadPlayShow">'+
                                     '<i-progress status="active" :percent="uploadPlay"  :stroke-color="[\'#108ee9\', \'#87d068\']" ></i-progress>'+
                                '</div>'+
                                '<div class="card-row" v-show="uploadPlayShow">'+
                                    '<p class="font-p-type">文件名:{{fileName}}</p>'+
                                    '<p class="font-p-type">文件大小:{{fileSize}}MB</p>'+
                                    '<p class="font-p-type">文件类型:{{fileType}}</p>'+
                                '</div>'+
                                '<div v-show="contentShow">'+
                                '<div v-for="(item, index) in uploadFileList" class="card-row">'+
                                    '<alert show-icon class="font-alert-type">'+
                                    '<icon type="md-film" slot="icon"></icon>'+
                                        '<span class="row-span">资源编号:{{item.FileNumber}} </span>'+
                                        '<span class="row-span">{{item.FileName}}</span>'+
                                    '</alert>'+
                                '</div>'+
                                '<div class="card-row">'+
                                    '<divider dashed ><p class="font-p-type">资源封面</p></divider>'+
                                    '<input type="file" id="imgfile" accept="image/png,image/jpeg" v-on:change="selectImgOver" hidden="hidden">'+
                                    '<i-button icon="md-cloud-upload" class="button-ordinary" @click="downUploadImgBtn">上传封面</i-button>'+
                                    '<span>（格式jpeg、png,文件大小≤3MB, 建议上传16:9图片）</span>'+
                                    '<br>'+
                                    '<img id="pageImg" src="" v-show="pageImgShow" height="200" alt="Image preview...">'+
                               '</div>'+
                               '<div class="card-row" style="text-align:center;">'+
                                   '<divider dashed ><p class="font-p-type">资源分类</p></divider>'+
	                               '<i-select v-model="selectResourceType" placeholder="资源类型" style="width:500px">'+
	                                   '<i-option v-for="item in resourcesType"  :value="item.DATA_ID" :key="item.DATA_ID">{{ item.DATA_INFO }}</i-option>'+
	                               '</i-select>'+
	                           '</div>'+
                               '<div class="card-row">'+
                                    '<divider dashed ><p class="font-p-type">资源信息</p></divider>'+
                               '</div>'+
                               '<div class="card-row">'+
                                   '<p class="font-p-type">资源标题</p>'+
                                   '<i-input v-model="resourcesTitle" maxlength="20" show-word-limit placeholder="请输入资源标题..." ></i-input>'+
                               '</div>'+
                               '<div class="card-row">'+
                                   '<p class="font-p-type">资源介绍</p>'+
                                   '<div class="wrapper">'+
                                       '<textarea id="md_editor">'+
                                       '</textarea>'+
                                   '</div>'+
                               '</div>'+
                               '<div class="card-row">'+
                                   '<span class="row-span">'+
                                       '<i-button class="button-ordinary" @click="getContent" >获取markdown</i-button>'+
                                   '</span>'+
                                   '<span class="row-span">'+
                                       '<i-button class="button-ordinary" @click="getHtml" >获取html</i-button>'+
                                   '</span>'+
                               '</div>'+
                               '<div class="card-row">'+
                                   '<span class="font-p-type">资源标签</span>'+
                                   '<span class="row-span">（用户可以通过标签和标题搜索到你的资源，请慎重填写）</span>'+
                                   '<i-input v-model="resourcesLabel" maxlength="20" show-word-limit placeholder="请输入资源标签...（可以用空格分隔）" ></i-input>'+
                               '</div>'+
                               '<div class="card-row">'+
                                   '<divider dashed ><p class="font-p-type">资料填写完毕</p></divider>'+
                                   '<i-button type="success" @click="downSubmitBtn" long>提交</i-button>'+
                               '</div>'+
                            '</div>'+
                        '</div>'+
                        '<backTop></backTop>'+
                    '</div>'
                    
                }
            },
            
            {
            path:'/articleResourceUpload',
            component:{
                methods: {
                    getContent:function () {
                      	this.$Modal.info({
                            title: 'Markdown',
                            content: this.editor.getContent(),
                        });
                      },
                      getHtml:function(){
                        this.$Modal.info({
                            title: 'Html',
                            content: '<xmp style="white-space:normal;">'+this.editor.getHtml()+'</xmp>',
                        });
                        
                      },
                      downSubmitBtn:function() {
                          
                          let isurl='uploadArticleResourcesInfo';
                          let map={
                              ResTitle: this.resourcesTitle,
                              ResMark: this.editor.getContent(),
                              ResHtml: this.editor.getHtml(),
                              ResLabel: this.resourcesLabel,
                          };
                          axios.post(isurl,Qs.stringify(map),{
                              header:{
                                  'Content-Type':'application/x-www-form-urlencoded'
                              }
                          }).then(res=>{
                        	  if(res.data.code==1) {
                          		
                          		this.$Notice.error({
                          			title: '提交失败!',
                          			desc: '接下来干什么呢?',
                          			duration: 2,
                          		});
                          	}
                          	else {
                          		this.$Notice.success({
                          			title: '提交成功',
                          			desc: '接下来干什么呢?',
                          			duration: 2,
                          		});
                          		// 清除文本域
                          		document.getElementById('md_editor').value=null;
                                this.resourcesTitle='';
                                this.resourcesLabel='';
                          		// 返回头部
                          		$('html').animate( {scrollTop: 0}, 1000);
                          		
                          	}
                          }).catch(err=>{
                          	
                          });
                      },
                },
                data: function () {
                    return {
                    	resourcesTitle:'',
                    	resourcesLabel:'',
                    }
                  },
                  mounted() {
                    // 该函数会在组件加载时调用
                    console.log("组件执行");
                    
                    this.editor = new mditor(document.getElementById('md_editor'));
                    
                },
                template:
                '<div class="content-card">'+
                    '<divider><h1 class="font-type">编写文章</h1></divider>'+
                    '<div class="card-900-body">'+
                        '<div class="card-row">'+
                            '<p class="font-p-type">文章标题</p>'+
                                '<i-input v-model="resourcesTitle" maxlength="20" show-word-limit placeholder="请输入资源标题..." ></i-input>'+
                        '</div>'+
                        '<div class="card-row">'+
                            '<span class="font-p-type">文章标签</span>'+
                            '<span class="row-span">（用户可以通过标签和标题搜索到你的资源，请慎重填写）</span>'+
                            '<i-input v-model="resourcesLabel" maxlength="20" show-word-limit placeholder="请输入资源标签...（可以用空格分隔）" ></i-input>'+
                        '</div>'+
                      
                        '<div class="card-row">'+
                            '<div class="wrapper">'+
                                '<textarea id="md_editor">'+
                                '</textarea>'+
                            '</div>'+
                        '</div>'+
                        
                        '<div class="card-row">'+
                            '<span class="row-span">'+
                                '<i-button class="button-ordinary" @click="getContent" >获取markdown</i-button>'+
                            '</span>'+
                            '<span class="row-span">'+
                                '<i-button class="button-ordinary" @click="getHtml" >获取html</i-button>'+
                            '</span>'+
                        '</div>'+
                        '<div class="card-row">'+
                            '<divider dashed ><p class="font-p-type">资料填写完毕</p></divider>'+
                            '<i-button type="success" @click="downSubmitBtn" long>提交</i-button>'+
                       '</div>'+
                   '</div>'+
               '</div>'
                
                }
            },
            {
                path:'/videoManagement',
                component:{
                    methods: {
                    	getUserVideoList:function(value) {
                    		axios.get('getUserVideoList',{params: {Page: value}
                            }).then(res=>{
                                  this.resList=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        getUserVideoCount:function() {
                    		axios.get('getUserVideoCount',null,{
                                header:{
                                    'Content-Type':'application/x-www-form-urlencoded'
                                }
                            }).then(res=>{
                                  this.resCount=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                        deleteBtn:function(value) {
                        	this.$Modal.confirm({
                        		title:"你确定要删除这个资源吗？",
                        		content:"被删除的资源不能被找回奥！",
                        		closable:true,
                        		onOk: () => {
                        			console.log("删除了"+value);
                        			axios.delete('userResources',{params: {ResID: value}
                                    }).then(res=>{
                                    	this.getUserVideoCount();
                                    	this.getUserVideoList(0);
                                    }).catch(err=>{
                                     
                                    });
                                },
                        		onCancel: () => {
                        			console.log("点击了取消");
                        		}
                        	});
                        },
                        PageDown:function(value) {
                        	this.pageNumber=value;
                        	this.$Message.info('当前页面:'+this.pageNumber+'页');
                        	this.getUserVideoList((value-1)*10);
                        },
                        eyeBtn:function(value) {
                        	window.open("video.html?name="+value);
                        }
                    
               },
                    data: function () {
                        return {
                        	userInfo:'',
                        	resList:{},
                        	resCount:null,
                        	pageNumber:1,
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        function sleep (time) {
                    		return new Promise((resolve) => setTimeout(resolve, time));
                    	}
                        //
                        this.getUserVideoList(0);
                        // 获取资源数量
                        this.getUserVideoCount();
                        
                    },
                    template:
                    '<div v-bind:class="resCount==0? \'content-background-card\':\'content-card\'">'+
                        '<divider><h1 class="font-type">个人视频管理</h1></divider>'+
                        '<div class="card-1150-body">'+
                        '<div class="card-row">'+
                        '<List item-layout="vertical">'+
                            '<ListItem v-for="item in resList" :key="item.RES_ID">'+
                                '<ListItemMeta :title="item.RESOURCES_TITLE" :description="item.RESOURCES_LABEL" />'+
                                   '<Icon type="md-time" />{{ item.UPLOAD_TIME }}'+
                                   '<template slot="action">'+
                                      '<li>'+
                                          '<Icon type="md-folder" /> {{item.FILE_NUMBER}}'+
                                      '</li>'+
                                      '<li>'+
                                          '<Icon type="md-flame" /> {{item.CHECK_NUMBER}}'+
                                      '</li>'+
                                      '<li>'+
                                          '<Icon type="md-text" /> {{item.COMMENT_NUMBER}}'+
                                     '</li>'+
                                     '<li>'+
                                          '<span><Icon type="md-trash" /></span><a @click="deleteBtn(item.RES_ID)" class="a-ordinary">删除</a>'+
                                     '</li>'+
                                     '<li>'+
                                         '<span><Icon type="md-eye" /></span><a @click="eyeBtn(item.RES_ID)" class="a-ordinary">查看</a>'+
                                     '</li>'+
                                 '</template>'+
                                 '<template slot="extra">'+
                                     '<img v-bind:src="\'getResourcesCover?CoverName=\' + item.RESOURCES_COVER_SRC" style="width: 280px;border-radius:5px;">'+
                                '</template>'+
                           '</ListItem>'+
                       '</List>'+
                        '</div>'+
                        '<div class="card-row font-p-type" style="text-align: center; margin-top: 30px;" v-show="resCount==0">'+
							'<p>你没有上传过哟!</p>'+
						'</div>'+
						'<div class="card-row" style="text-align: center;" v-show="resCount>10">'+
							'<page :total="resCount" @on-change="PageDown" show-elevator ></page>'+
						'</div>'+
                        '</div>'+
                    '</div>'
                    
                }
            },
            
            {
                path:'/personalInformation',
                component: 
                {
                    methods: {
                        personalInformationBtnDown:function() {
                            // vue.$data.name="adasdasd";
                            // console.log(vue.$data.name);
                            let isurl='userInfo';
                            let map={
                            		UserName: this.userInfo.userName,
                            		UserDescription:this.userInfo.userDescription,
                            		UserID:this.userInfo.userID,
                            };
                            axios.put(isurl,Qs.stringify(map),{
                                header:{
                                    'Content-Type':'application/x-www-form-urlencoded'
                                }
                            }).then(res=>{
                            	
                            	if(res.data.code==1) {
                            		this.$Notice.open({
                            			title: '修改信息失败!',
                            			desc: '',
                            			duration: 2,
                            		});
                            	}
                            	else {
                            		this.$Notice.open({
                            			title: '修改信息成功!',
                            			desc: '刷新一下哟!',
                            			duration: 1,
                            		});
                            		setTimeout("location.reload()",1000);
                            	}
                            	
                            }).catch(err=>{
                            	
                            });
                        },
                        getUserInfo:function() {
                      	  axios.get('userInfo',null,{
                                header:{
                                    'Content-Type':'application/x-www-form-urlencoded'
                                }
                            }).then(res=>{
                                  this.userInfo=res.data.data;
                            }).catch(err=>{
                             
                            });
                        },
                    },
                    data: function () {
                        return {
                          userInfo:{},
                        }
                      },
                      mounted() {
                        // 该函数会在组件加载时调用
                        console.log("组件执行");
                        // 获取用户信息
                        this.getUserInfo();
                    },
                    template:
                    '<div class="content-background-card" >'+
                    '<divider><h1 class="font-type">个人信息</h1></divider>'+
                        '<div class="card-700-body">'+
		                     '<div class="card-row">'+
		                        '<span class="row-span ">'+
		                           '<span class="font-p-type">个人昵称：</span>'+
		                        '</span>'+
		                        '<span class="row-span ">'+
		                           ' <i-input placeholder="Enter something..." style="width: 500px" v-model="userInfo.userName"></i-input>'+
		                        '</span>'+
		                    '</div>'+
                            '<div class="card-row">'+
                                '<span class="row-span" style="text-align:right">'+
                                    '<span class="font-p-type">用户编号：</span>'+
                                '</span>'+
                                '<span class="row-span ">'+
                                   '<span class="font-p-type">{{userInfo.userID}}</span>'+
                                '</span>'+
                            '</div>'+
                            
                            
                            
                            '<div class="card-row">'+
                                '<span class="row-span ">'+
                                    '<span class="font-p-type">用户邮箱：</span>'+
                                '</span>'+
                                '<span class="row-span ">'+
                                    '<span class="font-p-type">{{userInfo.userEmail}}</span>'+
                                '</span>'+
                            '</div>'+
                            
                            '<div class="card-row">'+
                                '<span class="row-span ">'+
                                    '<span class="font-p-type">个人描述：</span>'+
                                '</span>'+
                                '<span class="row-span ">'+
                                    '<i-input maxlength="100" show-word-limit type="textarea" :rows="5" v-model="userInfo.userDescription" placeholder="Enter something..." style="width: 500px" ></i-input>'+
                                '</span>'+
                            '</div>'+
                            
                            '<div class="card-row" style="text-align:center;">'+
                            	'<divider ></divider>'+
                                '<span class="row-span">'+
                                    '<i-button @click="personalInformationBtnDown" class="button-ordinary">保存</i-button>'+
                                '</span>'+
                            '</div>'+
                        '</div>'+
                    '</div>'
                },
                
            },
            {
                path:'/videoResourceUpload',
                component:{
                	data: function () {
                        return {
                          uploadPlayShow:false,
                          contentShow:false,
                          uploadPlay:0,
                          fileSize:"",
                          fileType:"",
                          fileName:"",
                          resourcesTitle:"",
                          resourcesLabel:"",
                          uploadFileList:null,
                          editor:null,
                          pageImgShow:false,
                          floatCount:0.0,
                        }
                      },
                      methods: {
                          uploadBtnDown:function() {
                          	document.getElementById("files").click();
                          },
                          selectFileOver:function() {
                          	
                          },
                          getContent:function () {
                          	this.$Modal.info({
                                title: 'Markdown',
                                content: this.editor.getContent(),
                            });
                          },
                          getHtml:function(){
                            this.$Modal.info({
                                title: 'Html',
                                content: '<xmp style="white-space:normal;">'+this.editor.getHtml()+'</xmp>',
                            });
                          },
                          isUploadFile:function() {
                        	  axios.get('isUploadFile',null,{
                                  header:{
                                      'Content-Type':'application/x-www-form-urlencoded'
                                  }
                              }).then(res=>{
                                    if(res.data.code==0) {
                                      this.$Notice.info({
                                         title: '你有上传文件的记录哟！',
                                         desc: '可以上传多个文件！'
                                     });
                                      this.uploadFileList=res.data.data;
                                      //显示内容
                                      this.contentShow=true;
                                    }
                              }).catch(err=>{
                               
                              });
                          },
                          downSubmitBtn:function() {
                              
                              let isurl='uploadVideoResourcesInfo';
                              let map={
                                  ResTitle: this.resourcesTitle,
                                  ResMark: this.editor.getContent(),
                                  ResHtml: this.editor.getHtml(),
                                  ResLabel: this.resourcesLabel,
                              };
                              axios.post(isurl,Qs.stringify(map),{
                                  header:{
                                      'Content-Type':'application/x-www-form-urlencoded'
                                  }
                              }).then(res=>{
                            	  if(res.data.code==1) {
                              		
                              		this.$Notice.error({
                              			title: '提交失败!',
                              			desc: '接下来干什么呢?',
                              			duration: 2,
                              		});
                              	}
                              	else {
                              		this.$Notice.success({
                              			title: '提交成功',
                              			desc: '接下来干什么呢?',
                              			duration: 2,
                              		});
                              		// 返回头部
                              		$('html').animate( {scrollTop: 0}, 1000);
                              		this.fileSize=null;
                              		this.fileType=null;
                              		this.fileName=null;
                              		this.fileSize=null;
                              		this.resourcesTitle=null;
                              		this.resourcesLabel=null;
                              		this.uploadFileList=null;
                              		document.getElementById('md_editor').value=null;
                              		this.uploadPlayShow=false;
                              		this.contentShow=false;
                              		var preview = document.getElementById("pageImg");
                              		preview.src="";
                              		this.pageImgShow=false;
                              	}
                              }).catch(err=>{
                              	
                              });
                          },
                          downUploadBtn: function () {
                              document.getElementById("files").click();
                          },
                          downUploadImgBtn:function () {
                          	if(this.uploadPlay!=100&&this.uploadFileList==null) {
                          		this.$Notice.open(
                                          {
                                               title: '请等待资源上传完成',
                                               desc: '稍微等一下哦!',
                                               // 显示时间两秒
                                               duration: 2
                                          }
                                      );  
                          		return;
                          	}
                              document.getElementById("imgfile").click();
                          },
                          selectImgOver:function () {
                              var _this=this;
                              // 获取封面文件对象
                              var preview = document.getElementById("pageImg");
                              var file    = document.getElementById("imgfile").files[0];
                              var inputFile =document.getElementById("imgfile");
                              // 开启文件读入流
                              var reader  = new FileReader();
                              // 转换大小单位
                              var size = file.size /1024/1024;
                              // 判断文件是否选中
                              if (file) {
                                reader.readAsDataURL(file);
                              } else {
                                preview.src = "";
                              }
                              // 设置封面图片上传大小
                              if(size>3){
                              	this.$Notice.open(
                                          {
                                               title: '图片太大了!',
                                               desc: '图片大小不能超过3MB!',
                                               // 显示时间两秒
                                               duration: 2
                                          }
                                      );  
                                 inputFile.value="";
                                 return;
                              }
                              // 显示图片
                              this.pageImgShow=true;
                              
                              // 读入完成显示到图片控件
                              reader.onloadend = function () {
                                preview.src = reader.result;
                              }
                              
                              // 判断文件是否存在并将图片上传
                              if (file) {
                              	let reader = new FileReader();
                                  reader.readAsArrayBuffer(file);
                                  reader.addEventListener("load", function(e) {
                                	  
                                  spark = new SparkMD5.ArrayBuffer();
                                  var formData = new FormData();
                                      // 数据块文件名称
                                      formData.append('FileName', file.name);
                                      // 文件类型
                                      formData.append('FileType', file.type);
                                      // 文件大小
                                      formData.append('FileSize', file.size);
                                      // 将ArrayBuffer变为二进制类型 传输
                                      spark.append(e.target.result);
                                      var blob = new Blob([e.target.result], { type: "text/plain"});
                                      formData.append('File', blob);
                                      var md5=spark.end();
                                      formData.append('MD5', md5);
                                      // 输出日志信息
                                      console.log("FileName："+file.name);
                                      console.log("MD5："+md5);
                                      console.log("FileSize："+file.size);
                                      // 创建Ajax对象
                                      $.ajax({
                                          url: 'uploadResourcesCover',
                                          type: 'post',
                                          data: formData,
                                          cache: false,
                                          processData: false,
                                          contentType: false,
                                          success : function(response,status,xhr) {
                                              _this.$Notice.success(
                                                      {
                                                          title: '封面上传成功!',
                                                          desc: '填写资源信息吧!',
                                                          // 显示时间两秒
                                                          duration: 2
                                                     }
                                                 );
                                              inputFile.value="";
                                          },
                                          error: function (response,status,xhr) {
                                          
                                          }
                                      });
                                  });
                              }
                          },
                      },
                      mounted() {
                    	// 该函数会在组件加载时调用
                    	// 查看是否上传过文件
                        this.isUploadFile();
                    	// 定义一个休眠函数
                    	function sleep (time) {
                    		return new Promise((resolve) => setTimeout(resolve, time));
                    	}
                        console.log("组件执行");
                        // 创建文本域对象
                        this.editor = new mditor(document.getElementById('md_editor'));
                        // 将本对象传入其他方法中
                        var _this=this;
                        // 给上传控件设置change事件
                        document.getElementById('files').addEventListener('change', function () { 
                            // 重置上传进度条
                            _this.uploadPlay=0;
                            _this.floatCount=0.0;
                            // 文件切片对象解决兼容性问题
                            var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                            // 选择第一个文件
                            file = this.files[0];
                            if(file==null) {
                            	// 将进度条隐藏
                            	// _this.uploadPlayShow=false;
                            	// 如果没有选择则直接退出
                            	return;
                            }
                            // 显示文件信息
                            _this.fileSize=Math.ceil(file.size/1024/1024);
                            _this.fileName=file.name;
                            _this.fileType=file.type;
                            // 显示进度条
                            _this.uploadPlayShow=true;
                            //显示内容
                            _this.contentShow=true;
                            
                            // 将页面返回到头部
                            // 设置读取一次的文件大小
                            chunkSize = 2*1024*1024; // 2MB
                            chunks = Math.ceil(file.size / chunkSize);
                            console.log('分段数为:'+chunks);
                            currentChunk = 0;
                            spark = new SparkMD5.ArrayBuffer();
                            sparkChunk = new SparkMD5.ArrayBuffer();
                            fileReader = new FileReader();
                            fileReader.onload = function (e) {
                                console.log('加载中');
                                console.log('read chunk nr', currentChunk + 1, 'of', chunks);
                                spark.append(e.target.result);                   // Append
																					// array
																					// buffer
                                sparkChunk.append(e.target.result);
                                console.log('文件内数据');
                                console.log(e.target.result);
                                var md5Chunk=sparkChunk.end()
                                console.info('文件块Hash:', md5Chunk); 
                                
                                var slice = e.target.result;
                                let formData = new FormData();
                                // 数据块索引
                                formData.append('ChunkIndex', currentChunk);
                                // 数据块文件名称
                                formData.append('FileName', file.name);
                                // 将文件数组变为二进制类型 传输
                                var blob = new Blob([slice]);
                                // 将二进制文件变量添加到form对象中
                                formData.append("File", blob);
                                // 添加MD5码摘要 用来校验数据
                                formData.append('MD5', md5Chunk);
                                // 文件块大小
                                formData.append("ChunkSize",blob.size);
                                // 创建ajax对象
                                // Jquery Ajax上传
                                    $.ajax({
                                        url: 'uploadResources',
                                        type: 'POST',
                                        data: formData,
                                        cache: false,
                                        processData: false,
                                        contentType: false,
                                        success : function(response,status,xhr) {
                                            console.log(status);
                                            // 发送成功进行下一块发送
                                            currentChunk++;
                                            if (currentChunk < chunks) {
                                                loadNext();
                                                if(_this.uploadPlay+100.00/chunks>=100) {
                                                	_this.uploadPlay=100;
                                                }else {
                                                	_this.floatCount+=100/chunks;
                                                	_this.uploadPlay=Math.ceil(_this.floatCount);
                                                }
                                            } else {
                                                console.log('全部加载完毕');
                                                var fileMD5 = spark.end();
                                                console.info('文件整体Hash:', fileMD5);  // Compute
																						// hash
                                                // 准备合并数据参数
                                                var mergeData = new FormData();
                                                // 文件名
                                                mergeData.append('FileName', file.name);
                                                // 文件类型
                                                mergeData.append('FileType', file.type);
                                                console.log(file.type);
                                                // 文件名
                                                mergeData.append('ChunkCount', chunks);
                                                // 添加文件整体MD5码摘要 用来校验数据
                                                mergeData.append('MD5', fileMD5);
                                                // 文件块大小
                                                mergeData.append("FileSize",blob.size);
                                                
                                                function ajaxResult(data) {
                                                	var json = JSON.parse(data);
                                                	if(json.code=="0"){
                                                		_this.uploadFileList = json.data;
                                                	}
                                                }
                                                // 内嵌ajax
                                                $.ajax({
                                                    url:'mergeResourcesFile',
                                                    type: 'post',
                                                    data: mergeData,
                                                    cache: false,
                                                    processData: false,
                                                    contentType: false,
                                                    success: function (response,status,xhr) {
                                                    	var json = JSON.parse(response);
                                                        if(json.code=="0") {
                                                             _this.$Notice.success({
                                                                title: '上传成功！',
                                                                desc: '可以上传多个资源文件哦！'
                                                            });
                                                             document.getElementById('files').value="";
                                                        }else {
                                                            _this.$Notice.error({
                                                                title: '上传失败！',
                                                                desc: '好像没有登录或者已经上传过了！'
                                                            });
                                                    	}
                                                        _this.uploadPlay=100;
                                                    },
                                                    error: function (response,status,xhr) {
                                                        _this.$Notice.error({
                                                            title: '上传失败！',
                                                            desc: '网络好像不太好呢！'
                                                        });
                                                    }
                                                }).done(function(data){
                                                    // 闭包
                                                    ajaxResult(data);
                                                });
                                                // 内嵌结束
                                            }
                                        },
                                        error : function(response,status,xhr){
                                                
                                                if(response.status==404) {
                                                	_this.$Notice.error({
                                                        title: '请求地址错误或服务器已关闭',
                                                        desc: '',
                                                    });
                                                	return;
                                                }
                                                if(response.status==403) {
                                                	_this.$Notice.error({
                                                        title: '你没有登录呢',
                                                        desc: '',
                                                    });
                                                	return;
                                                }
                                                console.log('传输失败,准备从新发送');
                                                sleep(500).then(() => {
                                                	console.log("休眠");
                                                	$.ajax(this);
                                                })
                                                
                                        },
                                    });
                                    // Ajax结束
                               
                            };
                            
                            
                            // 出现异常信息
                            fileReader.onerror = function () {
                                console.warn('oops, something went wrong.');
                            };
                            // 判断读取数据是否结束以及读取下一次数据
                            function loadNext() {
                                var start = currentChunk * chunkSize,
                                    end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                                    console.log('开始:',start);
                                    console.log('结束:',end);
                                fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
                            }
                            loadNext();
                            
                        });
                        
                        
                    },
                    template:
                        '<div class="content-card">'+
                        '<divider><h1 class="font-type">视频资源上传</h1></divider>'+
                        '<div class="card-900-body">'+
                            '<div class="card-row">'+
                                '<input type="file" accept="video/*" name="files" id="files" v-on:change="selectFileOver" hidden="hidden"/>'+
                                '<div class="upload-span" @click="uploadBtnDown" >'+
                                    '<icon type="ios-cloud-upload" size="52" style="color: #5c5e61"></icon>'+
                                    '<p>上传视频</p>'+
                                '</div>'+
                            '</div>'+

                                '<div class="card-row" v-show="uploadPlayShow">'+
                                     '<i-progress status="active" :percent="uploadPlay"  :stroke-color="[\'#108ee9\', \'#87d068\']" ></i-progress>'+
                                '</div>'+
                                '<div class="card-row" v-show="uploadPlayShow">'+
                                    '<p class="font-p-type">文件名:{{fileName}}</p>'+
                                    '<p class="font-p-type">文件大小:{{fileSize}}MB</p>'+
                                    '<p class="font-p-type">文件类型:{{fileType}}</p>'+
                                '</div>'+
                                '<div v-show="contentShow">'+
                                '<div v-for="(item, index) in uploadFileList" class="card-row">'+
                                    '<alert show-icon class="font-alert-type">'+
                                    '<icon type="md-film" slot="icon"></icon>'+
                                        '<span class="row-span">P{{item.FileNumber}}: </span>'+
                                        '<span class="row-span">{{item.FileName}}</span>'+
                                    '</alert>'+
                                '</div>'+
                                '<div class="card-row">'+
                                    '<divider dashed ><p class="font-p-type">资源封面</p></divider>'+
                                    '<input type="file" id="imgfile" accept="image/png,image/jpeg" v-on:change="selectImgOver" hidden="hidden">'+
                                    '<i-button icon="md-cloud-upload" class="button-ordinary" @click="downUploadImgBtn">上传封面</i-button>'+
                                    '<span>（格式jpeg、png,文件大小≤3MB, 建议上传16:9图片）</span>'+
                                    '<br>'+
                                    '<img id="pageImg" src="" v-show="pageImgShow" height="200" alt="Image preview...">'+
                               '</div>'+
                               '<div class="card-row">'+
                                    '<divider dashed ><p class="font-p-type">视频信息</p></divider>'+
                               '</div>'+
                               '<div class="card-row">'+
                                   '<p class="font-p-type">视频标题</p>'+
                                   '<i-input v-model="resourcesTitle" maxlength="20" show-word-limit placeholder="请输入资源标题..." ></i-input>'+
                               '</div>'+
                               '<div class="card-row">'+
                                   '<p class="font-p-type">视频介绍</p>'+
                                   '<div class="wrapper">'+
                                       '<textarea id="md_editor">'+
                                       '</textarea>'+
                                   '</div>'+
                               '</div>'+
                               '<div class="card-row">'+
                                   '<span class="row-span">'+
                                       '<i-button class="button-ordinary" @click="getContent" >获取markdown</i-button>'+
                                   '</span>'+
                                   '<span class="row-span">'+
                                       '<i-button class="button-ordinary" @click="getHtml" >获取html</i-button>'+
                                   '</span>'+
                               '</div>'+
                               '<div class="card-row">'+
                                   '<span class="font-p-type">视频标签</span>'+
                                   '<span class="row-span">（用户可以通过标签和标题搜索到你的资源，请慎重填写）</span>'+
                                   '<i-input v-model="resourcesLabel" maxlength="20" show-word-limit placeholder="请输入视频标签...（可以用空格分隔）" ></i-input>'+
                               '</div>'+
                               '<div class="card-row">'+
                                   '<divider dashed ><p class="font-p-type">资料填写完毕</p></divider>'+
                                   '<i-button type="success" @click="downSubmitBtn" long>提交</i-button>'+
                               '</div>'+
                            '</div>'+
                        '</div>'+
                        '<backTop></backTop>'+
                    '</div>'
                    
                }
            },
        ]
    });
	
    // 创建 Vue 实例
    var vue=new Vue({
        i18n:i18n,
        el: '#app',
        data() {
            return {
            name:'',
            resources:'',
            selectName:'',
            userInfo:{},
            history:false,
            historyList:[],
            }
        },
        router:router,
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
            	window.open("search.html?name="+this.resources);
            },
            getUserLoginInfo:function() {

                let isurl='userInfo';
                axios.get(isurl,null,{
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
                        	this.userInfo=res.data.data;
                        }
                }).catch(err=>{
                    
                });
            },
            selectMeun:function(value) {
                
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
            historySwitch:function() {
            	axios.get('getHistoryList',null,{
                }).then(res=>{
                     this.historyList=res.data.data;
                     // 显示
                     this.history=true;
                }).catch(err=>{
                    
                });
            },
        },
       
        mounted() {
            // 该函数会在页面加载时调用
        	this.getUserLoginInfo();
        }
    });
