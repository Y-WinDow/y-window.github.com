		
		var option=['addFollow','cancleFollow','cancleFans'];
		var optionText=['加关注','取消关注','移除粉丝'];
		var resultText=['取消关注','加取消'];
		var optionUrls=['addFollowServlet','cancleFollowServlet','cancleFansServlet'];

		var userList=getElementsByClassName('userList','ul',document)[0];

		function User(userdata,pageType){//pageType--->0,1 class[]
			this.user=document.createElement('li');
			this.user.className='userItem p_re f12';

			this.user.innerHTML=''+
						'<div class="userHead p_ab">'+
							'<a href=""><img src="'+userdata['userHeadImgSrc']+'" alt="userHead" /></a>'+
						'</div>'+
						'<div class="userDetialWrapper">'+
							'<a href="" class="username f16">'+userdata['userName']+'</a>'+
							'<ul class="userDetial">'+
								'<li><a href="javascript:void(0)" class="">关注：<span class="counter">'+userdata['followCount']+'</span></a></li>'+
								'<li><a href="javascript:void(0)" class="">粉丝：<span class="counter">'+userdata['fansCount']+'</span></a></li>'+
								'<li><a href="javascript:void(0)" class="">微博：<span class="counter">'+userdata['messageCount']+'</span></a></li>'+
							'</ul>'+			
							'<p class="intro">'+
								'简介：<span class="introContent">'+userdata['intro']+'</span>'+
							'</p>'+
							'<a href="javascript:void(0)" class="'+option[pageType]+' p_ab">'+optionText[pageType]+'</a>'+
						'</div>';

			this.option=getElementsByClassName(option[pageType],'a',this.user)[0];

			var that=this;

			this.xhr=createXHR();

			this.option.onclick=function (){
				var url=optionUrls[pageType]+'?userId'+userdata['userId'];
				sendRequest(that.xhr,'GET',url);
			}
		
			this.xhr.onreadystatechange=function (){
				if(isReady(this)){
					if(this.responseText){
						thay.option.innerHTML=resultText[pageType];
						return;
					}
					alert('操作失败');
				}
			}