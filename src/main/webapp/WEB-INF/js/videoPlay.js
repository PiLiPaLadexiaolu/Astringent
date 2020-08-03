
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
            currentlyPlaying:1,
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
           //用户退出
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
           			//编码字符解决+号变空格问题
           			var file = encodeURIComponent(this.FileName);
           			console.log(file);
           			//document.getElementById("videoPlay").src=encodeURI('getVideoResources?VideoID='+url+'&FileName='+file);
           			this.videoSrc(encodeURI('getVideoResources?VideoID='+url+'&FileName='+file));
           	}).catch(err=>{
           		
           	});
           },
           
           videoSrc:function(url) {
        	   var video = document.querySelector('video');
               //将隐藏视频控件
               video.controls=false;
               //设置视频源
               var assetURL = url;
               //var assetURL = 'http://192.168.145.131:8080/Astringent/getVideoResources?VideoID=ab3fb6a2e29145b48876217aee13e637&FileName=%25E8%25BD%25AC%25E6%258D%25A2%25E5%2590%258E%25E5%2588%259D%25E9%259F%25B3.webm';
               //设置视频解码方式
               var mimeCodec = 'video/webm; codecs="vp8, vorbis"';
               //var mimeCodec = 'video/mp4; codecs="avc1.64001f, mp4a.40.2"'
               //设置每次读取视频块大小
               var size = 3*1024*1024;//1MB
               //视频总分段数
               var totalSegments = 0;
               //视频段长度
               var segmentLength = 0;
               //视频段时间
               var segmentDuration = 0;
               //已加载视频数据长度
               var bytesFetched = 0;
               //已加载视频段标记
               var requestedSegments;
               //文件大小
               var FileLength;

               //声明MediaSource
               var mediaSource = null;
               //判断浏览器是否支持MediaSource以及是否支持mimeCodec解码
               if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
                   //创建MediaSource对象
                   mediaSource = new MediaSource();
                   //将MediaSource绑定到Video控件URL
                   video.src = URL.createObjectURL(mediaSource);
                   //设置MediaSource资源打开监听事件
                   mediaSource.addEventListener('sourceopen', sourceOpen);
               } else {
                   console.error('Unsupported MIME type or codec: ', mimeCodec);
               }

               //获取文件总长度方法
               function getFileLength (url, cb) {
                   fetch(url, {
                   method: 'HEAD',
                   })
                   .then(response => {console.log('Content-Length:', response.headers.get('Content-Length')); 
                   cb(response.headers.get('Content-Length'));})
                   .catch(error => console.error('Error:', error));
               };

               function fetchRange (url, cb,start,end) {
                   console.log("fetchRange:",url);
                   var xhr = new XMLHttpRequest;
                   xhr.open('get', url);
                   xhr.setRequestHeader('Range', 'bytes=' + start + '-' + end);
                   xhr.responseType = 'arraybuffer';
                   xhr.onload = function () {
                       cb(xhr.response);
                   };
                   console.log("请求了一次数据!");
                   xhr.send();
               };
               //添加数据块到资源缓冲区
               function appendSegment (chunk) {
                   sourceBuffer.appendBuffer(chunk);
                   bytesFetched+=size;
               };

               //声明资源缓冲区对象
               var sourceBuffer = null;
               //创建资源打开监听的方法
               function sourceOpen (_) {
                   //创建sourceBuffer对象
                   sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
                   //获取文件长度回调执行
                   getFileLength(assetURL, function (fileLength) {
                       FileLength=fileLength;
                       console.log("视频文件长度:",(fileLength / 1024 / 1024).toFixed(2), 'MB');
                       //计算分段数
                       totalSegments = Math.ceil(fileLength / size);
                       console.log("视频文件分段数:",totalSegments, '块');
                       //创建分段标记
                       requestedSegments = [totalSegments];
                       //视频段设置为未加载标记
                       for (var i = 0; i < totalSegments; ++i) requestedSegments[i] = false;
                       //加载第一段视频数据
                       if(size>FileLength) {
                           fetchRange(assetURL,appendSegment,0,FileLength);
                       }else {
                           fetchRange(assetURL,appendSegment,0,size);
                       }
                       
                       //设置第一段标记加载
                       requestedSegments[0] = true;
                       //添加视频事件更新事件
                       video.addEventListener('timeupdate', checkBuffer);
                       //
                       video.addEventListener('canplay', function () {
                           segmentDuration = video.duration / (FileLength / size);
                           console.log("每段视频时间:",segmentDuration, '秒,不准确');
                           //video.play();
                       });
                       video.onpause =  function(){
                           console.log("视频暂停");
                       }
                       video.error =  function(){
                           console.log("加载异常");
                       }

                   });
               };

               function checkBuffer (_) {
                   console.log('当前进度条时间:', video.currentTime);
                   //获取当前位置块
                   var currentSegment = getCurrentSegment();
                   console.log('当前区块:', currentSegment);
                   //判断是否全部加载完成
                   if (currentSegment === totalSegments && haveAllSegments()) {
                       console.log('last segment', mediaSource.readyState);
                       // mediaSource.endOfStream();
                       // video.removeEventListener('timeupdate', checkBuffer);
                   } else if (shouldFetchNextSegment(currentSegment)) {
                       requestedSegments[currentSegment] = true;
                       console.log('time to fetch next chunk', video.currentTime);
                       var chunkSize;
                       if(bytesFetched+size>FileLength) {
                           chunkSize = FileLength-1;
                       }else {
                           chunkSize = bytesFetched+size;
                       }
                       fetchRange(assetURL,appendSegment,bytesFetched+1,chunkSize);
                   }
               };

               function getCurrentSegment () {
                   return ((video.currentTime / segmentDuration) | 0) + 1;
               };

               //返回是否全部加载
               function haveAllSegments () {
                   //检查全部数组
                   return requestedSegments.every(function (val) { return !!val; });
               };

               function shouldFetchNextSegment (currentSegment) {
                   console.log('是否满足加载下一块数据条件:',video.currentTime > 0 &&
                   !requestedSegments[currentSegment]);
                   // return video.currentTime > segmentDuration * currentSegment * 0.8 &&
                   // !requestedSegments[currentSegment];
                   return video.currentTime > 0 &&
                   !requestedSegments[currentSegment];
               };
           },
           
           getVideoCount:function(resId) {
        	   let isurl='videoInfoCount';
           		axios.get(isurl, {
           		    params: {
           		    	VideoID: resId
           		    }
           		}).then(res=>{
           			this.videoCount=parseInt(res.data.data);
           	}).catch(err=>{
	           	 this.$Notice.error({
	                 title: '资源信息获取失败',
	                 desc: '发生什么事情了呢!',
	                 //显示时间两秒
	                 duration: 2
	             });  
           	});
           },
           //获取视频资源各种信息
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
           
           getVideoSrc:function(value) {
            var url = this.getQueryString("name");
            this.getVideoFileInfo(url,value-1);
            this.currentlyPlaying=value;
           },
           downloadBtnDown:function() {
        	   //下载功能简略版本
               var url = this.getQueryString("name");
               window.open('downloadResources?ResID='+url+'&FileName='+encodeURIComponent(this.FileName),'_blank');
               
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
            this.getVideoCount(url);
            //获取第一个视频
            this.getVideoFileInfo(url,0);
            //获取视频资源信息
            this.getResourcesInfo(url).then((v) => {
            	this.getAttentionStatus();
            	//加载同种类型随机资源
            	this.getRandomResourcesList(v.RESOURCES_TYPE_ID);
            });
            //获取随便看看信息列表
            this.getRandomResourcesList();
            this.getRandomUserResourcesList(url);
            //获取该视频评论数量
            this.getCommentNumber();
            //获取该视频评论初始
            this.getCommentList(url,0);
            //更新点击次数
            this.updateCheckNumber(url);
            
        	
        }
    });
