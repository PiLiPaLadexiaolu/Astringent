
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
            videoCount:0,
            FileName:'',
            resourcesInfo:{},
            randomResourcesList:{},
            randomUserResourcesList:{},
            comment:'',
            commentCount:0,
            commentContent:{},
            pageNumber:1,
            attentionStatus:false,
            resourcesFileMap:{},
            report:'',
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
            //获取URL参数
            getQueryString:function (name) {
           	 let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                let r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return unescape(r[2]);
                };
                return null;
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
			reportBtn:function() {
				this.$Modal.confirm({
					 onOk: () => {
						 let isurl='report';
							let map={
								ResID:this.resourcesInfo.RES_ID,
								ReportContent:this.report,
							};
							axios.post(isurl,Qs.stringify(map),{
								header:{
									'Content-Type':'application/x-www-form-urlencoded'
								}
							}).then(res=>{
								if(res.data.code=='0') {
									this.$Message.info('举报成功!');
								}
								this.report=null;
								
							}).catch(err=>{
							
							});
	                    },
                    render: (h) => {
                    	 return h('div', [
                    	        h('h2', '请填写举报内容!'),
                    	        h('Input', {
                    	            props: {
                    	                value: this.report,
                    	                autofocus: true,
                    	                type:"textarea",
                                        rows:10,
                    	                placeholder: '请填写举报原因...'
                    	            },
                    	            on: {
                    	                input: (val) => {
                    	                	//输入时触发事件
                    	                    this.report = val;
                    	                    //必须添加不然没有v-model效果
                    	                },
                    	            }
                    	        })
                    	    ])
                    }
				});
			},
           //获取登录用户信息
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
         //获取视频信息
           getVideoFileInfo:function(resId,index) {
        	   let isurl='videoFileInfo';
        	   let map={
        			   VideoID:resId,
        			   VideoIndex:index
                  };
           		axios.get(isurl, {
           		    params: {
           		    	VideoID: resId,
           		    	VideoIndex:index
           		    }
           		}).then(res=>{
           			//将获取的信息放入src中
           			this.FileName=res.data.data.FILE_NAME;
           			var url = this.getQueryString("name");
           			document.getElementById("videoPlay").src='getVideoResources?VideoID='+url+'&FileName='+this.FileName;
           	}).catch(err=>{
           		
           	});
           },
           
           getVideoCount:function(resId) {
        	   let isurl='videoInfoCount';
           		axios.get(isurl, {
           		    params: {
           		    	VideoID: resId
           		    }
           		}).then(res=>{
           			this.videoCount=parseInt(res.data.data)*10;
           	}).catch(err=>{
	           	 this.$Notice.error({
	                 title: '资源信息获取失败',
	                 desc: '发生什么事情了呢!',
	                 //显示时间两秒
	                 duration: 2
	             });  
           	});
           },
           //获取资源各种信息
           getResourcesInfo:function(resId) {
        	   let isurl='getResourcesInfo';
        	   return axios.get(isurl, {
           		    params: {
           		    	ResID: resId
           		    }
           		}).then(res=>{
           			this.resourcesInfo=res.data.data;
           			return this.resourcesInfo;
           	}).catch(err=>{
           		window.location.href='404.html';
           	});
           },
           //获取资源随机列表
           getRandomResourcesList:function(value) {
        	   let isurl='getResourcesRandomList';
           		axios.get(isurl, {
           		    params: {
           		    	ResType:value,
           		    }
           		}).then(res=>{
           			this.randomResourcesList=res.data.data;
           	}).catch(err=>{
           			
           	});
           },
           getRandomUserResourcesList:function(value) {
        	   let isurl='getUserResourcesRandomList';
           		axios.get(isurl, {
           		    params: {
           		    	ResID:value,
           		    }
           		}).then(res=>{
           			this.randomUserResourcesList=res.data.data;
           	}).catch(err=>{
           			
           	});
           },
           
           getResourcesFileMap:function(value) {
        	   let isurl='getOtherResourcesFileMap';
           		axios.get(isurl, {
           		    params: {
           		    	ResID:value,
           		    }
           		}).then(res=>{
           			this.resourcesFileMap=res.data.data;
           	}).catch(err=>{
           			
           	});
           },
           
           getVideoSrc:function(value) {
            var url = this.getQueryString("name");
            this.getVideoFileInfo(url,value-1);
           },
           downloadBtnDown:function() {
        	   //下载功能简略版本
        	   console.log("开始下载");
               var url = this.getQueryString("name");
               window.open('downloadResources?ResID='+url+'&FileName='+this.FileName,'_blank');
               
           },
           commentDown:function() {
        	   if(this.comment=='') {
           		this.$Notice.open(
                           {
                                title: '没有写评论呢！',
                                desc: '这样不好!',
                                //显示时间两秒
                                duration: 2
                           }
                       );
           		return;
           	}
           	let isurl='submitComment';
               let map={
               		ResID:this.resourcesInfo.RES_ID,
               		Comment:this.comment,
               };
               axios.post(isurl,Qs.stringify(map),{
                   header:{
                       'Content-Type':'application/x-www-form-urlencoded'
                   }
               }).then(res=>{
               	if(res.data.code=='1') {
                   	this.$Notice.open(
                               {
                                    title: '你没有登录',
                                    desc: '快去登录吧!',
                                    //显示时间两秒
                                    duration: 2
                               }
                           );
                   }
               	else {
               		this.pageNumber=1;
                   	this.PageDown(1);
                   	this.comment=null;
               	}
               }).catch(err=>{
               	
               });
           },
           PageDown:function(value) {
           	this.pageNumber=value;
           	this.$Message.info('当前评论区:'+this.pageNumber+'页');
           	var url = this.getQueryString("name");
           	this.getCommentNumber();
           	this.getCommentList(url,(value-1)*10);
           },
           getCommentNumber:function() {
        	   var resId=this.getQueryString("name");
               let isurl='getCommentNumber';
               axios.get(isurl, {
           		    params: {
           		    	ResID:resId,
           		    }
           		}).then(res=>{
           			this.commentCount=res.data.data;
               }).catch(err=>{
               	
               });  
           },
           getCommentList:function(url,page) {
               let isurl='getCommentList';
               axios.get(isurl, {
           		    params: {
           		    	ResID:url,
           		    	Page:page,
           		    }
           		}).then(res=>{
           			this.commentContent=res.data.data;
               }).catch(err=>{
               	
               });  
           },
           attentionLab:function() {
        	   if(this.attentionStatus==false) {
        		   let isurl='attention';
                   let map={
                   		UserID:this.resourcesInfo.USER_ID,
                   };
        		   axios.post(isurl,Qs.stringify(map),{
                       header:{
                           'Content-Type':'application/x-www-form-urlencoded'
                       }
                   }).then(res=>{
                	   if(res.data.code=='1') {
                         	this.$Notice.open(
                                     {
                                          title: '你没有登录',
                                          desc: '快去登录吧!',
                                          //显示时间两秒
                                          duration: 2
                                     }
                                 );
                      }
               	   else {
               	   this.$Message.info('关注成功！');
               	   this.attentionStatus=!this.attentionStatus;
               	   }
                   }).catch(err=>{
                   	
                   });
        		   
        	   }
        	   else {
        		   axios.delete('attention',{params: {UserID: this.resourcesInfo.USER_ID,}
                   }).then(res=>{
                	   this.$Message.info('取消关注！');
                	   this.attentionStatus=!this.attentionStatus;
                   }).catch(err=>{
                    
                   });
        		   
        	   }
           },
           getAttentionStatus:function() {
        	   axios.get('attention', {
          		    params: {
          		    	UserID:this.resourcesInfo.USER_ID,
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
           updateCheckNumber:function(value) {
        	   let isurl='updateClicks';
               let map={
               		ResID:value,
               };
               axios.put(isurl,Qs.stringify(map),{
                   header:{
                       'Content-Type':'application/x-www-form-urlencoded'
                   }
               }).then(res=>{
               	
               }).catch(err=>{
               	
               });  
           },
        },
        mounted() {
            //该函数会在页面加载时调用
        	//获取URL上参数信息
            var url = this.getQueryString("name");
            console.log(url);
            //获取登录用户信息
            this.getUserInfo();
            //获取视频数量
//            this.getVideoCount(url);
//            //获取第一个视频
//            this.getVideoFileInfo(url,0);
            //获取视频资源信息
            this.getResourcesInfo(url).then((v) => {
            	this.getAttentionStatus();
            	//获取随便看看信息列表
            	this.getRandomResourcesList(v.RESOURCES_TYPE_ID);
            });
            this.getRandomUserResourcesList(url);
            //获取该视频评论数量
            this.getCommentNumber();
            //获取该视频评论初始
            this.getCommentList(url,0);
            //更新点击次数
            this.updateCheckNumber(url);

            //获取资源全部文件信息将文件名放入select中
            this.getResourcesFileMap(url);
        	
        }
    });
