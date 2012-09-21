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
			sendRequest(this.gcXhr,'GET',url);

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