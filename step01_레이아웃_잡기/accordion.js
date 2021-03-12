
		function FolderAccordionMenu (selector) {
			this.$accordionMenu = null;
            this._$mainMenuItems = null;
            
            // 선택 서브 메뉴아이템
            this._$selectSubItem = null;

			this._init(selector);
            this._initSubMenuPanel();
            this._initEvent();
        }

        /*
		*  요소 초기화  
		*/
		FolderAccordionMenu.prototype._init = function (selector){
			this.$accordionMenu = $(selector);
			this._$mainMenuItems = this.$accordionMenu.children("li");
        }
        

        
       /*
		*  이벤트 초기화 
        */
       FolderAccordionMenu.prototype._initEvent = function (){
            var objThis = this;
            this._$mainMenuItems.children(".main-title").click(function(e){
                    var $item = $(this).parent();
                    objThis.toogleSubMenuPanel($item);
            })
            
            // sub1-1 등 sub menu click시 이벤트 발생
            this._$mainMenuItems.find(".sub li").click(function(e){
                objThis._selectSubMenuItem($(this));
            })
       }


       /*
		*  서브 메뉴아이템 선택
        */
       FolderAccordionMenu.prototype._selectSubMenuItem = function ($item){

              var $oldItem = this._$selectSubItem;

              if(this._$selectSubItem != null) {
                  this._$selectSubItem.removeClass("select");
              }

              this._$selectSubItem = $item;
              this._$selectSubItem.addClass("select");

              //선택 이벤트 발생 
              this._dispatchSelectEvent($oldItem, this._$selectSubItem);

        }

        // select 이벤트 발생
        FolderAccordionMenu.prototype._dispatchSelectEvent = function ($oldItem, $newItem){

            /*기존선택 메뉴아이템과 신규선택 서브메뉴아이템 정보를 담아 select라는 사용자 정의 이벤트 발생하는 코드 작성*/

            var event = jQuery.Event("select");
            event.$oldItem = $oldItem;
            event.$newItem = $newItem;

            this.$accordionMenu.trigger(event);
        }





       /*
		*  폴더 상태 설정 
		*/
		FolderAccordionMenu.prototype._initSubMenuPanel = function (){
			var objThis = this;
			this._$mainMenuItems.each(function(index){
				var $item = $(this);
				var $subMenu = $item.find(".sub");

				//서브가 없는 경우 
				if($subMenu.length ==0) { 
					$item.attr("data-extension", "empty")
					objThis._setFolderState($item, "empty");
					//objThis.openSubMenu($item);
				}else {
					if ($item.attr("data-extension")=="open"){
                        //objThis._setFolderState($item, "open");
                        objThis.openSubMenu($item, false);
					}else{
						//$item.attr("data-extenstion","close")
						//objThis._setFolderState($item, "close");
                        objThis.closeSubMenu($item,false);
					}
				}
			})		
        }
        
        		
		/*
		*  폴더 상태 설정 
		*/
		FolderAccordionMenu.prototype._setFolderState = function ($item, state){                      
			var $folder = $item.find(".main-title .folder");
			//기존 클래스를 모두 제거 
			$folder.removeClass();
			$folder.addClass("folder " + state);
        }
        
        /**
         * index 메뉴의 서브 메뉴패널 열기 
         */
        FolderAccordionMenu.prototype.openSubMenuAt = function (index, animation){                                  
            var $item = this._$mainMenuItems.eq(index);
            this.openSubMenu($item,animation);
        }

        /**
         * index 메뉴의 서브 메뉴패널 닫기
         */
        FolderAccordionMenu.prototype.closeSubMenuAt = function (index, animation){                                  
            var $item = this._$mainMenuItems.eq(index);
            this.closeSubMenu($item,animation);
        }


        /**
         * 메뉴 선택 기능 
         * @mainIndex: 메인 메뉴아이템 index 
         * @subIndex: 서브메뉴아이템 index 
         * @animation: 애니메이션 실행 유무
         */
        FolderAccordionMenu.prototype.selectMenu = function (mainIndex, subIndex, animation){                                  
            //메인 메뉴아이템 
            var $item = this._$mainMenuItems.eq(mainIndex);            
            // 서브 메뉴아이템 
            var $subMenuItem = $item.find(".sub li").eq(subIndex);
            // 서브 메뉴아이템이 존재하는 경우에만 처리 
            if($subMenuItem) {
                //서브 메뉴패널 열기 
                this.openSubMenu($item, animation);

                //서브 메뉴아이템 선택 
                this._selectSubMenuItem($subMenuItem);
            }
            

        }
        


        
		/**
		* 서브 메뉴패널 열기 
		*/
	    FolderAccordionMenu.prototype.openSubMenu=function($item, animation){
			
			if($item != null){
				  $item.attr("data-extension", "open");
                  var $subMenu = $item.find(".sub");
                  
                if(animation == false) { 
                    $subMenu.css({
                        marginTop:0
                    });	
                }else {
                    $subMenu.stop().animate({ 
                        marginTop : 0                        
                        },300,"easeInCubic"
                    );   
                }    
				  //폴더 상태를 open 상태로 만들기 
                  this._setFolderState($item, "open");
                  
                  //open 이벤트 발생
                  this._dispatchOpenCloseEvent($item, "open");
			}
        }
        

        /**
        * 서브 메뉴패널 닫기
        * animation 기본값은 true
		*/
	    FolderAccordionMenu.prototype.closeSubMenu=function($item, animation){
			if($item != null) {
				$item.attr("data-extension", "close");
                var $subMenu = $item.find(".sub");
                

                /* .outerHeight(true)는 요소의 크기 + 패딩의 크기 + 테두리의 크기 + 마진(margin)의 크기 */
                var subMenuPanelHeight = -$subMenu.outerHeight(true); 

                if(animation == false){
                    $subMenu.css({
                        marginTop: subMenuPanelHeight
                    });
                }else {
                    $subMenu.stop().animate({
                           marginTop:subMenuPanelHeight
                        },300,"easeInCubic"
                    );
                }

				//폴더 상태를 close상태로 만들기
                this._setFolderState($item, "close");
                
                //close 이벤트 발생 
                this._dispatchOpenCloseEvent($item, "close");
			}
		
        }
        

        /*
		*  이벤트 초기화 
        */
       FolderAccordionMenu.prototype.toogleSubMenuPanel = function ($item){
            
            var extension = $item.attr("data-extension");
            
            // 서브가 없는 경우 취소 
            if(extension == "empty"){
                return;
            }

            console.log("서브 메뉴 패널이 있는 경우만 실행"); 
            
            if(extension == "open"){
                  this.closeSubMenu($item);
            }else {
                  this.openSubMenu($item);
            }

       }

       /*
	   *  서브 메뉴패널이 열리고(open) 닫히는(close) 이벤트
       */
       FolderAccordionMenu.prototype._dispatchOpenCloseEvent = function ($item, eventName){
            var event = jQuery.Event(eventName);
            event.$target=$item; 
            
            this.$accordionMenu.trigger(event);

       }
		

		



		