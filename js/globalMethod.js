		var Global={};
		var isIE=!!window.ActiveXObject;

		Array.prototype.remove=function (index){
			if(isNaN(index)||index>this.length){return false;}
			for(var i=0,n=0;i<this.length;i++){
				if(this[i]!=this[index])
					this[n++]=this[i];
			}
			this.length-=1;
		}
		Array.prototype.getIndex=function (element){
			for(var i=0;i<this.length;i++){
				if(element===this[i]){
					return i;
				}
			}
		}

		EventUtil={
			addHandler:function(element,type,handler){
				element['on'+type]=handler;
				/*if(element.addEventListener){
					element.addEventListener(type,handler,false);
				}else if(element.attachEvent){
					element.attachEvent('on'+type,handler);
				}else{
					element['on'+type]=handler;
				}*/
			},
			removeHandler:function(element,type,handler){
				if(element.removeEventListener){
					element.removeEventListener(type,handler,false);
				}else if(element.detachEvent){
					element.detachEvent('on'+type,handler);
				}else{
					element['on'+type]=null;
				}
			}
		}

		function getElementsByClassName(className,tag,parent){
			parent=parent||document;
			
			var allTags=(tag=='*'&&parent.all)?parent.all:parent.getElementsByTagName(tag);
			var matchElements=new Array();
			className=className.replace(/\-/g,'\\-');
			var regex=new RegExp('(^|\\s)'+className+'(\\s|$)');

			var length=allTags.length;
			var element;
			for(var i=0;i<length;i++){
				element=allTags[i];

				if(regex.test(element.className))
					matchElements.push(element);
			}
			return matchElements;
		}
			


		function createXHR(){
			if(window.ActiveXObject){
				var version=['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp'];
				for(var i=0;i<version.length;i++){
					try{
						var xhr=new ActiveXObject(version[i]);
						return xhr;
					}catch(e){}
				}
				return;
			}
			 return new XMLHttpRequest();
		}

		function xhrReady(oXHR){
			if(oXHR.readyState==4){
				if((oXHR.status>=200&&oXHR.status<300)||oXHR.status==304)
					return true;
				else
					return false;
			}
			return false;
		}
		function setOpacity(obj,op){
			if(isIE){
				obj.style.filter='alpha(opacity='+op+')';
				return;
			}
			obj.style.opacity=op/100;
		}

		function stopPropagation(e){
			if(isIE){
				e=window.event;
				e.cancelBubble=true;
				return;
			}
			e.stopPropagation();
		}

		function getStyle (obj,prop){	
			if(arguments.length!=2) return false;
			if(obj.currentStyle) {		
				return obj.currentStyle[prop];
			}
			else if(window.getComputedStyle) {		
				propprop = prop.replace (/([A-Z])/g, "-$1");		
				propprop = prop.toLowerCase ();
				return document.defaultView.getComputedStyle(obj,null)[prop];
			}	
			return null;
		}

		function drage(event,obj){//需要先设置为position:absolute
			event=event||window.event;

			var left=event.pageX||(event.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft));
			var top=event.pageY||(event.clientY+(document.documentElement.scrollTop||document.body.scrollTop));

			var leftMargin=left-obj.offsetLeft;
			var topMargin=top-obj.offsetTop;
						
			this.onmousemove=function(event1){
				event1=event1||window.event;

				var x=event1.pageX||(event1.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft));
				var y=event1.pageY||(event1.clientY+(document.documentElement.scrollTop||document.body.scrollTop));

				obj.style.left=x-leftMargin+'px';
				obj.style.top=y-topMargin+'px';
			}

			this.onmouseup=function(){
				this.onmousemove=null;
				leftMargin=null;
				topMargin=null;
			}			
		}

		function resizeImg(img,size){
			if(img.width>600||img.height>1000){
				if(img.width>img.height){
					if(img.width>size){
						img.style.width=size+'px';
					}
				}else{
					if(img.height>size)
						img.height=size;
				}
			}
		}

		/*function camelize(s) {
			return s.replace(/-(\w)/g, function (strMatch, p1) {
				return p1.toUpperCase();
			});
		}

		function getStyle(element,property) {
			if (arguments.length!=2) return false;
			var value=element.style[camelize(property)];
			if (!value){
				if(document.defaultView&&document.defaultView.getComputedStyle) {
					var css=document.defaultView.getComputedStyle(element,null);
					value=css ? css.getPropertyValue(property) : null;
				} else if(element.currentStyle) {
					value=element.currentStyle[camelize(property)];
				}
			}
			return value=='auto'?'':value;
		}*/

		function prependChild(parent,newChild){
			if(parent.firstChild){
				parent.insertBefore(newChild,parent.firstChild);
			}else{
				parent.appendChild(newChild);
			}
			return parent;
		}

		function tabCtrls(etype,noticeCtrls,noticeContent,selected){
			for(var i=0;i<noticeCtrls.length;i++){
				noticeCtrls[i].num=i;
			}

			for(var i=0,length=noticeCtrls.length;i<length;i++){
				noticeCtrls[i]['on'+etype]=function (){
					for(var j=0;j<noticeCtrls.length;j++){
						noticeCtrls[j].className='';
						noticeContent[j].className='';
					}
					this.className=selected;
					noticeContent[this.num].className=selected;
				}
			}
		}

		
		var se;
		function setScrollBoard(type,listWrapper,list,L,time){
			se=setInterval(function (){
				listWrapper['scroll'+type]++;

				if(listWrapper['scroll'+type]%L==0){
					listWrapper['scroll'+type]=0;
					clearInterval(se);
							
					list.appendChild(list.removeChild(list.children[0]));

					setTimeout(function (){
						setScrollBoard(type,listWrapper,list,L,time);
					},time);
				}
			},10);
		}
				
