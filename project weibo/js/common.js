		
		var mainContent=getElementsByClassName('mainContent','*',document)[0];

		var repost=getElementsByClassName('repost','*',document);
		var cover=getElementsByClassName('cover','*',document)[0];
		var repostWindowWrapper=getElementsByClassName('repostWindowWrapper','*',document)[0];
		var repostWindow=getElementsByClassName('repostWindow','*',document)[0];
		var repostContent=getElementsByClassName('repostContent','*',document)[0];
		var repostReason=getElementsByClassName('repostReason','textarea',repostWindow)[0];
		var repostBtn=getElementsByClassName('repostBtn','a',repostWindow)[0];

		var search=getElementsByClassName('search','input',document)[0];

		//构造函数Message----------------------------------------------------------------------------------------------
		function Message(data){
			var that=this;
			this.messageItem=document.createElement('li');
			this.messageItem.className='messageItem';
			this.messageId=data['messageId'];
			//innerHTML
			this.html='<div class="message p_re"><div class="userHead p_ab" userId="'+data['userId']+'"><a href=""><img src="'+data['userHeadImgSrc']+'" alt="userHead" /></a></div><div class="messageBody"><p class="messageContent f14"><a href="#" class="username f16">'+data['userName']+'</a>:<span class="msgPure">'+matchAt(data['message'])+'</span></p>';

			this.originMsgId=data['messageId'];//如果是原创的，原始ID是自己的ID

			if(data['originMsgId']){
				//var data.oData=getOriginalMessage(data['originMsgId']); ???

				this.originMsgId=data['originMsgId'];//如果不是原创的，修改原创的ID

				this.html+='<div class="repostWrapper radius_5px f12"><a class="originalName">@'+oData['userName']+' </a>: '+matchAt(oData['message'])+'<div class="messageImgWrapper"><ul class="imgCtrls dis_no"><li><a class="packUp" href="javascript:void(0)">收起</a></li><li><a class="showOrigin" href="javascript:void(0)">查看原图</a></li><li><a href="javascript:void(0)">向左转</a></li><li><a href="javascript:void(0)">向右转</a></li></ul><img src="'+oData['messageImg']+'" alt="" class="messageImg" /></div><ul class="messageInfor f12"><li class="oPublicTime">time:<a href="messageIndex.html">2012-04-28 10:35</a></li><li class="oRepost"><a href="messageIndex.html">转发('+oData['repostCount']+')</a></li><li class="oComment"><a href="messageIndex.html">评论('+oData['commentCount']+')</a></li></ul></div>';
			}else{
				this.html+='<div class="messageImgWrapper"><ul class="imgCtrls dis_no"><li><a class="packUp" href="javascript:void(0)">收起</a></li><li><a class="showOrigin" href="javascript:void(0)">查看原图</a></li><li><a href="javascript:void(0)">向左转</a></li><li><a href="javascript:void(0)">向右转</a></li></ul><img src="'+data['messageImg']+'" alt="" class="messageImg dis_no" /></div>';
			}
			this.html+='<ul class="messageInfor"><li class="publicTime">time:<a href="javascript:void(0)">'+data['time']+'</a></li><li class="repost"><a href="javascript:void(0)">转发('+data['repostCount']+')</a></li><li class="comment"><a href="javascript:void(0)">评论('+data['commentCount']+')</a></li></ul></div></div>';

			this.messageItem.innerHTML=this.html;
			//get ctrls

			this.messageBody=getElementsByClassName('messageBody','div',this.messageItem)[0];
			this.messageContent=getElementsByClassName('messageContent','p',this.messageBody)[0];
			this.userHead=getElementsByClassName('userHead','div',this.messageItem)[0];
			this.messageImgWrapper=getElementsByClassName('messageImgWrapper','div',this.messageImg)[0];
			this.messageImg=getElementsByClassName('messageImg','img',this.messageItem)[0];
			this.imgCtrls=getElementsByClassName('imgCtrls','ul',this.messageItem)[0];
			
			//binding eventListeners
			EventUtil.addHandler(getElementsByClassName('comment','li',this.messageItem)[0],'click',function (){
				that.showCommentWindow();
			});

			EventUtil.addHandler(getElementsByClassName('repost','li',this.messageItem)[0],'click',function (){
				that.showRepostWindow();
			});

			EventUtil.addHandler(this.userHead,'mouseover',function (){
				that.headHover(data);
			});

			if(isIE){
				this.messageImg.onreadystatechange=function (){
					that.picCtrls();
				}
			}else{
				EventUtil.addHandler(this.messageImg,'load',function (){
					that.picCtrls();
				});
			}

		}
		//public methods---------------------------------------------------------------
		
		Message.prototype.showCommentWindow=function (){
			//this==that???
			if(this.hasCommentWindow){
				this.commentWindow.parentNode.removeChild(this.commentWindow);
				this.hasCommentWindow=false;
				return;
			}

			this.hasCommentWindow=true;

			this.commentWindow=document.createElement('div');
			this.commentWindow.className='commentWindow dis_bl';
			this.commentWindow.innerHTML='<ul class="commentMain"><li><div  class="commentInput"><textarea class="commentInput f12"></textarea></div></li><li class="commentBtnWrapper"><a href="javascript:void(0)" class="commentBtn radius_2px f12">评论</a></li></ul><ul class="commentItems"></ul>';

			this.messageBody.appendChild(this.commentWindow);

			this.commentInput=getElementsByClassName('commentInput','textarea',this.commentWindow)[0];
			
			this.commentItems=getElementsByClassName('commentItems','ul',this.commentWindow)[0];

			this.commentBtn=getElementsByClassName('commentBtn','a',this.commentWindow)[0];


			//--------------------------------------------------------------------------------------------------

				var temItem=new CommentItem(comData,this.commentInput);
				prependChild(this.commentItems,temItem.commentItem);

			//----------------------------------------------------------------------------------------------------
			

			var that=this;

			this.gcXhr=createXHR();

			var gcUrl='getCommentServlet?messageId='+this.messageId;
			sendRequest(this.gcXhr,'GET',gcUrl);

			this.gcXhr.onreadystatechange=function(){
				if(isReady(this)){
					var comDatas=JSON.parse(this.responseText);
					var length=comDatas.length;

					for(var i=0;i<length;i++){
						var temItem=new CommentItem(comDatas[i]);
						prependChild(that.commentItems,temItem.commentItem);
						if(i>=10){
							that.commentWindow.moreComment=document.createElement('a');
							that.commentWindow.moreComment.href='messageIndex.jsp?messageId='+that.messageId;
							that.commentWindow.moreComment.className='moreComment f12 dis_bl';
							that.commentWindow.moreComment.innerHTML='查看更多评论&gt;&gt';
							that.commentWindow.appendChild(that.commentWindow.moreComment);
						}
					}
				}
			}

			this.pcXhr=createXHR();

			this.commentBtn.onclick=function(){
				alert(that.commentInput.value);
				var pcUrl='publicCommentServlet?messageId='+this.messageId+'&message='+that.commentInput.value;
				sendRequest(this.pcXhr,'GET',pcUrl);
			}

			this.pcXhr.onreadystatechange=function (){
				if(isReady(this)){
					alert('评论成功');

					var recentComment=new CommentItem(JSON.parse(this.responseText));
					prependChild(that.commentItems,recentComment.commentItem);

					that.commentInput.value='';
					that.commentInput.blur();

					return;
				}
				alert('error!');
			}
		}

		Message.prototype.showRepostWindow=function (){
			cover.className='cover p_fix dis_bl';
			repostWindowWrapper.className='repostWindowWrapper p_fix dis_bl';

			repostReason.originMsgId=this.originMsgId;

			var messageContent=this.messageContent;
			repostContent.innerHTML=messageContent.innerHTML;
			repostReason.content=repostReason.value+'//@'+repostContent.innerText;			
		}
			
		Message.prototype.headHover=function (data){
			if(this.userHead.children.length>1) return;
			
			this.inforWindow=document.createElement('div');
			this.inforWindow.className='inforWindow p_ab';
			
			this.inforWindow.innerHTML='<a href="" class="detialHead p_ab"><img src="'+data['userHeadImgSrc']+'"/></a><div class="detialInfor p_ab"><a href="">'+data['userName']+'</a><ul><li><a href="">关注:'+data['followCount']+'</a></li><li><a href="">粉丝:'+data['fansCount']+'</a></li><li><a href="">微博:'+data['messageCount']+'</a></li></ul>';	
			this.userHead.appendChild(this.inforWindow);

		}

		Message.prototype.picCtrls=function (){
			var that=this;

			if(this.messageImg.src.split('/').pop()=='none'){
				return;
			}
			this.messageImg['realWidth']=this.messageImg.width;
			this.messageImg['realHeight']=this.messageImg.height;
			that.resizeImg(this.messageImg,120);
			this.messageImg.className='messageImg dis_bl';//下载完图片之后再显示
			

			EventUtil.addHandler(this.messageImg,'click',function(){
				if(this.isShowed){
					that.resizeImg(this,120);						
					this.parentNode.className='messageImgWrapper';
					that.imgCtrls.className='imgCtrls dis_no';
					this.isShowed=false;
					return;
				}

				var wrapper=this.parentNode;
				wrapper.className='messageImgWrapper wrapperOnShow radius_5px';
				that.imgCtrls.className='imgCtrls dis_bl';
				that.showBigImg(this,440);
				this.isShowed=true;

				EventUtil.addHandler(getElementsByClassName('packUp','a',that.imgCtrls)[0],'click',function(){
					that.resizeImg(that.messageImg,120);
					wrapper.className='messageImgWrapper';
					that.imgCtrls.className='imgCtrls dis_no';
					that.messageImg.isShowed=false;
				});

				EventUtil.addHandler(getElementsByClassName('showOrigin','a',that.imgCtrls)[0],'click',function(){
					window.open(that.messageImg.src);
				});
			});
		}
		//重新设置图片的大小
		Message.prototype.resizeImg=function (img,size){
			if(img.realHeight>img.realWidth)
				if(img.realHeight>size){
					img.height=size;
					return;
				}else{
					return;
				}
			else
				if(img.realWidth>size){
					img.width=size;
					img.height=size/(img.realWidth/img.realHeight);//等比例缩放
					return;
				}else{
					return;
				}
		}
		//显示大图片
		Message.prototype.showBigImg=function (img,size){
			if(img.realWidth>size){
				img.width=size;
				img.height=size/(img.realWidth/img.realHeight);
				return;
			}
			img.height=img.realHeight;
		}

		//------------------------------------------------------------------------------------------
		function CommentItem(data,commentInput){
			this.commentItem=document.createElement('li');
			this.commentItem.className='commentItem f12';
			this.commentItem.innerHTML='<div class="message p_re"><div class="userHead p_ab" userId="'+data['userId']+'"><a href=""><img src="'+data['userHeadImgSrc']+'" alt="userHead" /></a></div><div class="messageBody"><p class="messageContent"><a href="#" class="username">'+data['userName']+'</a>:<span class="msgPure">'+matchAt(data['message'])+'</span></p><ul class="replyCtrls"><li class="replyWrapper"><a href="javascript:void(0)" class="reply">回复</a><li></ul></div>';

			this.userName=data['userName'];
			this.commentInput=commentInput;
			this.reply=getElementsByClassName('reply','a',this.commentItem)[0];

			var that=this;

			this.reply.onclick=function (){
				that.commentInput.focus();
				if(isIE){
					that.commentInput.caretPos=document.selection.createRange().duplicate();
				}
				that.commentInput.value='';
				var beStr='回复 @'+that.userName+' ：';
				insertText(that.commentInput,beStr);
			};
		}

//-------------------------------------------------------------------------------------------------------------------

		function insertText(input,str) {
			if(document.selection){
				var sel=input.caretPos;
				sel.text=sel.text.charAt(sel.text.length-1)+str;
			}else if(typeof input.selectionStart=='number'&&typeof input.selectionEnd=='number'){
				var startPos=input.selectionStart;
				var endPos=input.selectionEnd;
				var cursorPos=startPos;
				var tmpStr=input.value;

				input.value=tmpStr.substring(0,startPos)+str+tmpStr.substring(endPos,tmpStr.length);
				cursorPos+=str.length;
				input.selectionStart=input.selectionEnd=cursorPos;
			} else{
				input.value+=str;
			}
		}

		function sendRequest(xhr,method,url){
			xhr.open(method,url,true);
			xhr.send(null);
		}

		//---------------------------------------------------------------------------------------------
		
		//-------------------------------------------------------------------------------------------------
		
		