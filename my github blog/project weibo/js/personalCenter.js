	
		var publicPic=getElementsByClassName('publicPic','a',document)[0];
		var ppChoise=getElementsByClassName('ppChoise','div',document)[0];
		var onePic=getElementsByClassName('onePic','input',ppChoise)[0];

		var publicContent=getElementsByClassName('publicContent','textarea',document)[0];
		var publicBtn=getElementsByClassName('publicBtn','a',document)[0];

		var followSuggests=getElementsByClassName('followSuggests','div',document)[0];
		var suggestList=getElementsByClassName('suggestList','ul',followSuggests)[0];

		var forAt=getElementsByClassName('forAt','div',document)[0];

		var tips=getElementsByClassName('tips','*',document)[0];
		//xhrs
		
		

		(function (datas){
			var length=datas.length;
			
			for(var i=0;i<length;i++){
				var message=new Message(datas[i]);
				mainContent.appendChild(message.messageItem);	
			}
			
			tipsCtrl();

			publicMessage();
			
		})(messageDatas);

		getElementsByClassName('cancle','*',document)[0].onclick=function (){
			cover.className='cover p_fix dis_no';
			repostWindowWrapper.className='repostWindowWrapper p_fix dis_no';
		}

		//public new message----------------------------------------------------------------------------------------------

		var publicXHR=createXHR();

		publicXHR.onreadystatechange=function (){
			if(isReady(publicXHR)){
				publicBtn.parentNode.className='publicBtnWrapper bePub';
				publicContent.value='发布成功!';

				var recentMessage=new Messages(JSON.parse(publicXHR.responseText));
				prependChild(mainContent,recentMessage.messageItem);
				publicBtn.onclick=publicMethod;
			}
		}

		function publicMessage(){

			publicContent.onfocus=function(){
				window.onkeydown=function(e){
					if(e.shiftKey&&e.keyCode==50){            //输入@
						if(isIE){
							publicContent.caretPos=document.selection.createRange().duplicate();
						}
						checkAtPosition();
						followSuggests.style.display='block';
						for(var i=0;i<myFans.length;i++){
							var fans=new SuggeatItem(myFans[i]);
							suggestList.appendChild(fans.item);
						}				
					}
					if(event.keyCode==27||event.keyCode==8){
						followSuggests.style.display='none';
						cleanItems();
					}
				}
			}

			publicContent.onblur=function (){
				window.onkeydown=null;
			}

			publicPic.onclick=function (){ 	
				var ppChoise=getElementsByClassName('ppChoise','div',document)[0];
				
				if(ppChoise.isShowed){
					ppChoise.style.display='none';
					ppChoise.isShowed=false;
					return;
				}
				ppChoise.style.display='block';
				ppChoise.isShowed=true;
			}

			ppChoise.onclick=function (){
				ppChoise.style.display='none';
				ppChoise.isShowed=false;
			}

			publicBtn.onclick=function (){
				publicMethod();
			}

		}

		function publicMethod(){
			publicBtn.parentNode.className='publicBtnWrapper inPub';
			publicBtn.onclick=null;
			var pubUrl='publicServlet?userId='+hostData['userId']+'&message='+publicContent.value;

			sendRequest(publicXHR,'POST',pubUrl);
		}

		
		//repost ------------------------------------------------------------------------------------------------------
		var repostXHR=createXHR();

		repostBtn.onclick=function (){
			var url='repostServlet?userId='+hostData['userId']+'&originMsgId='+repostReason.originMsgId+'&repostReason='+repostReason.content;

			sendRequest(repostXHR,'POST',url);
			
		}

		repostXHR.onreadystatechange=function (){
			if(isReady(this)){
				alert('转发成功！');
				cover.className='cover p_fix dis_no';
				repostWindowWrapper.className='repostWindowWrapper p_fix dis_no';

				var recentMessage=new Messages(JSON.parse(publicXHR.responseText));
				prependChild(mainContent,recentMessage.messageItem);
			}
		}

		//asking for new Messages and show in tips----------------------------------------------------------------------

		var newMesXHR=createXHR();

		var newMesUrl='JSONServlet';//dai gai bian

		/*var newMesTimmer=setInterval(function (){
			sendRequest(newMesXHR,'GET',newMesUrl);
		},30000);*/

		newMesXHR.onreadystatechange=function (){
			if(isReady(this)){
				var resStr=this.responseText;//[{},{}]

				if(resStr==''){//没有新消息
					return;
				}

				var resJSONStr=JSON.parse(resJSONStr);
				var length=resJSONStr.length;

				if(length){//如果有数据
					tips.className='tips f12 dis_bl';
					checkNewMessages(tips,length);

					for(var i=0;i<length;i++){
						newDatas.unshift(resJSONStr[i]);
					}
				}
			}
		}

		function tipsCtrl(){			
			tips.onclick=function (){
				for(var i=0;i<length;i++){
					var newMessage=new Message(newDatas[0]);
					prependChild(mainContent,newMessage.messageItem);
					newDatas.shift();
				}
				this.className='tips f12 dis_no';
			}
		}

		function checkNewMessages(tips,length){
			tips.innerHTML='有'+length+'条新微博，点击查看';
			return length;
		}

		//comment -------------------------------------------------------------------------------------------------
		



		//-------------------------------------------------------------------------------------------------------
		
		//--------------------------------------------------------------------------------
		//构造函数
		function SuggeatItem(username){
			var that=this;
			this.item=document.createElement('li');
			this.item.innerHTML=username;
			this.item.onclick=this.comAt;
		}

		SuggeatItem.prototype.comAt=function (){
			var str=this.innerHTML+' ';
			insertText(publicContent,str);
			
			cleanItems();
			publicContent.focus();
		}

		//--------------------------------------------------------------------------------
		function cleanItems(){	
			var items=suggestList.children;
			var length=items.length;

			for(var i=0;i<length;i++){
				suggestList.removeChild(items[0]);
			}
			followSuggests.style.display='none';
		}

		function checkAtPosition(){
			var forAt=document.createElement('div');
			forAt.innerHTML=publicContent.value.substring(0,publicContent.selectionStart);
			forAt.className='forAt p_ab f14';
			var form=getElementsByClassName('input','form',document)[0].appendChild(forAt);

			var max=Number(getStyle(publicContent,'width').split('px').shift());
			var width=Number(getStyle(forAt,'width').split('px').shift());

			var left=width%max+50+'px';
			var top=(Math.floor(width/max)+1)*20+30+'px';

			followSuggests.style.left=left;
			followSuggests.style.top=top;
		}

		