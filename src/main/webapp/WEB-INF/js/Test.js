
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
            	window.open("searchResources?name="+this.resources, "_blank");
            },
            getResourcesType() {
               
            },
        },
        mounted() {
        	//该函数会在页面加载时调用
        	let isurl='userInfo';
        	axios.post(isurl,null,{
        		header:{'Content-Type':'application/x-www-form-urlencoded'}
        	}).then(res=>{
        			if(res.data.success==false) {
        				this.$Notice.open({
        					title: '你没有登录',
        					desc: '快去登录吧!',
        					//显示时间两秒
        					duration: 2
        				});  
        			}
        			else {
        				this.name =res.data.username;
        			}
        	}).catch(err=>{
        		
        	});
        }
    });
