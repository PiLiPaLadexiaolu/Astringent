
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
            randomVideoResourcesList:{},
            randomOtherResourcesList:{},
            randomArticleResourcesList:{},
            randomBookResourcesList:{},
            randomCodeResourcesList:{},
            randomSoftwareResourcesList:{},
            resTop5:{},
            carouse:{},
            history:false,
            historyList:[],
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
            tabClick:function(value) {
                if(value=="video")
                {
                	this.getResTop5List(1);
                }
                if(value=="other")
                {
                	this.getResTop5List(3);
                }
                if(value=="article")
                {
                	this.getResTop5List(2);
                }
                if(value=="book")
                {
                	this.getResTop5List(4);
                }
                if(value=="software")
                {
                	this.getResTop5List(5);
                }
                if(value=="code")
                {
                	this.getResTop5List(6);
                }
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
            getRandomVideoResourcesList:function() {
          	   let isurl='getResourcesRandomList';
             		axios.get(isurl, {
             		    params: {
             		    	ResType:1,
             		    }
             		}).then(res=>{
             			this.randomVideoResourcesList=res.data.data;
             	}).catch(err=>{
             			
             	});
             },
             getRandomSoftwareResourcesList:function() {
            	   let isurl='getResourcesRandomList';
               		axios.get(isurl, {
               		    params: {
               		    	ResType:5,
               		    }
               		}).then(res=>{
               			this.randomSoftwareResourcesList=res.data.data;
               	}).catch(err=>{
               			
               	});
               },
             getRandomCodeResourcesList:function() {
              	   let isurl='getResourcesRandomList';
                 		axios.get(isurl, {
                 		    params: {
                 		    	ResType:6,
                 		    }
                 		}).then(res=>{
                 			this.randomCodeResourcesList=res.data.data;
                 	}).catch(err=>{
                 			
                 	});
                 },
              getRandomBookResourcesList:function() {
                	   let isurl='getResourcesRandomList';
                   		axios.get(isurl, {
                   		    params: {
                   		    	ResType:4,
                   		    }
                   		}).then(res=>{
                   			this.randomBookResourcesList=res.data.data;
                   	}).catch(err=>{
                   			
                   	});
                   },
             getRandomOtherResourcesList:function() {
          	   let isurl='getResourcesRandomList';
             		axios.get(isurl, {
             		    params: {
             		    	ResType:3,
             		    }
             		}).then(res=>{
             			this.randomOtherResourcesList=res.data.data;
             	}).catch(err=>{
             			
             	});
             },
             getRandomArticleResourcesList:function() {
          	   let isurl='getResourcesRandomList';
             		axios.get(isurl, {
             		    params: {
             		    	ResType:2,
             		    }
             		}).then(res=>{
             			this.randomArticleResourcesList=res.data.data;
             	}).catch(err=>{
             			
             	});
             },
             getResTop5List:function(value) {
            	   let isurl='getResourcesTop5';
               		axios.get(isurl, {
               		    params: {
               		    	ResType:value,
               		    }
               		}).then(res=>{
               			this.resTop5=res.data.data;
               	}).catch(err=>{
               			
               	});
               },
               getCarouselList:function() {
            	   let isurl='getCarouselList';
               		axios.get(isurl, {
               		    params: {
               		    	
               		    }
               		}).then(res=>{
               			this.carouse=res.data.data;
               	}).catch(err=>{
               			
               	});
               },
             videoRandomBtn:function() {
            	 this.getRandomVideoResourcesList();
             },
             otherRandomBtn:function() {
            	 this.getRandomOtherResourcesList();
             },
             articleRandomBtn:function() {
            	 this.getRandomArticleResourcesList();
             },
             softwareRandomBtn:function() {
            	 this.getRandomSoftwareResourcesList();
             },
             codeRandomBtn:function() {
            	 this.getRandomCodeResourcesList();
             },
             bookRandomBtn:function() {
            	 this.getRandomBookResourcesList();
             },
             jump:function(e) {
            	 window.location.href = e;
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
        	//该函数会在页面加载时调用
        	this.getUserInfo();
        	this.getCarouselList();
        	this.getRandomOtherResourcesList();
        	this.getRandomVideoResourcesList();
        	this.getRandomArticleResourcesList();
        	this.getRandomSoftwareResourcesList();
        	this.getRandomBookResourcesList();
        	this.getRandomCodeResourcesList();
        	this.getResTop5List(1);
        }
    });
