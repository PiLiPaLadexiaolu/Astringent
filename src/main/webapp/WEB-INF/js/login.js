	//清除控制台
	console.clear();
	//国际化
	const messages = {
		en: {
			internationalizationCode: {
			A000001: 'Resource Sharing',
			A000002: 'Email',
			A000003:'Password',
			A000004: 'Login',
			A000005: 'Register',
			A000006 :'72 Hout Auto Login',
			A000007:'Login Error',
			A000008:'USERNAME OR PASSWORD ERROR!',
			A000009:"GET BACK!",
			A000010:"Verification code sending failed!"
			}
		},
		zh: {
			internationalizationCode: {
			A000001: '课程资源共享',
			A000002: '邮箱',
			A000003:'密码',
			A000004: '登录',
			A000005:'什么你还没有账号!',
			A000006 :'72小时自动登录',
			A000007:'登录失败',
			A000008:'用户名或密码错误！',
			A000009:"密码丢失!",
			A000010:"验证码发送失败!"
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
			username:'',
			password:'',
			emailVerification:'',
			passwordVerification:'',
			btnSwitch:false,
			registerSwitch: false,
			emailSwitch:true,
			goBackSwitch:false,
			emailLoading:false,
			time:60,
			timer:null,
			styles: {
				height: 'calc(100% - 55px)',
				overflow: 'auto',
				paddingBottom: '53px',
				'background-color': '#ffffff',
				position: 'static'
			}
		},
		methods: {
			china: function () {
				//动态修改更改语言为中文
				i18n.locale = 'zh';
			},
			english: function () {
				//动态修改更改语言为英文
				i18n.locale = 'en';
			},
			register: function() {
				this.registerSwitch=true;
			},
			
			runTime:function() {
				this.time--;
				if(this.time<1) {
					clearInterval(this.timer);
					this.emailLoading=false;
					this.time=60;
				}
			},
			
			sendEmail:function() {
				this.emailLoading=true;
				this.timer = setInterval(this.runTime, 1000);
				
				let isurl='emailCode';
				let map={
					Email: this.username
				};
				axios.post(isurl,Qs.stringify(map),{
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					}
				}).then(res=>{
					
					if(res.data.code==1) {
						this.$Notice.open({
							title: i18n.tc('internationalizationCode.A000010'),
							desc: '验证码功能好像出现了一些问题!',
							duration: 2,
						});
					}
					else {
						this.$Notice.open({
							title: '验证码发送成功',
							desc: '休息一下!',
							duration: 2,
						});
					}
					
				}).catch(err=>{
					
				});
			},
			
			loginDown: function() {
				//该对象可以获取vue对象内全部data数据
				if(!this.emailCheck())
					return;
				if(this.username==null||this.username=='')
					return;
				if(this.password==null||this.password=='')
					return;
				
				let isurl='login';
				let map={
						Email: this.username,
						Password: this.password,
						CookieSwitch: this.btnSwitch
				};
				axios.post(isurl,Qs.stringify(map),{
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					}
				}).then(res=>{
					
					if(res.data.code==1) {
						this.$Notice.open({
							title: '登录失败',
							desc: '用户名或密码错误',
							duration: 2,
						});
					}
					else {
						this.$Notice.open({
							title: '登录成功',
							desc: '稍后会自动跳转',
							duration: 2,
						});
						setTimeout("window.location.href='index.html'",2000);
					}
					
				}).catch(err=>{
					
				});
			},
			
			emailCheck: function() {
				var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
				var flag=reg.test(this.username);
				if(this.username==""||this.username==null) {
					this.$Message.error('请填写邮箱');
					return false;
				}
				if(flag==false) {
					this.$Message.error('邮箱格式不正确');
					return false;
				}
				return true;
			},
			emailSwitchCheck:function() {
				var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
				var flag=reg.test(this.username);
				if(this.username==""||this.username==null) {
					this.emailSwitch=true;
					return;
				}
				if(flag==false) {
					this.emailSwitch=true;
					return;
				}
				this.emailSwitch=false;
			},
			emailVerificationCheck: function() {
				var reg = /^\d{4}$/;
				var flag=reg.test(this.emailVerification);
				if(flag==false) {
					this.$Message.error('邮箱验证码格式错误');
					return false;
				}
				return true;
			},
			registerDown:function() {
				if(!this.emailCheck())
					return;
				if(this.username==null||this.username=='')
					return;
				if(this.password==null||this.password=='')
					return;
				if(this.passwordVerification!=this.password) {
					this.$Notice.open({
						title: '两次输入的密码不一致!',
						desc: '哪个填错了呢!',
						duration: 2,
					});
					return;
				}
				let isurl='register';
				let map={
						UserName: this.username,
						Password:this.password,
						EmailCode:this.emailVerification
				};
				axios.post(isurl,Qs.stringify(map),{
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					}
				}).then(res=>{
					
					if(res.data.code==1) {
						this.$Notice.open({
							title: '注册失败',
							desc: '可能已经注册过或者验证码输入错误!',
							duration: 2,
						});
					}
					else {
						this.$Notice.open({
							title: '注册成功!',
							desc: '快去登录吧!',
							duration: 2,
						});
					}
					
				}).catch(err=>{
					
				});
			},
			resetDown:function() {
				if(!this.emailCheck())
					return;
				if(this.username==null||this.username=='')
					return;
				if(this.password==null||this.password=='')
					return;
				if(this.passwordVerification!=this.password) {
					this.$Notice.open({
						title: '两次输入的密码不一致!',
						desc: '哪个填错了呢!',
						duration: 2,
					});
					return;
				}
				let isurl='password';
				let map={
					UserName: this.username,
					Password:this.password,
					EmailCode:this.emailVerification
				};
				axios.put(isurl,Qs.stringify(map),{
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					}
				}).then(res=>{
					
					if(res.data.code==1) {
						this.$Notice.open({
							title: '修改密码失败!',
							desc: '邮箱或验证码错误!',
							duration: 2,
						});
					}
					else {
						this.$Notice.open({
							title: '修改密码成功!',
							desc: '快去登录吧!',
							duration: 2,
						});
					}
					
				}).catch(err=>{
					
				});
			},
			
			getBackDown:function() {
				this.goBackSwitch=true;
			}
		},
		
		mounted() {
			//该函数会在页面加载时调用
		}
		
	});
