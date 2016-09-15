/**
 * 
 */

(function(win,doc,$){
	
  function CustomScrollBar(options) {
	  this._init(options);
  };

  $.extend(CustomScrollBar.prototype,{

	  _init: function(options) {
		  var self = this;
		  self.options = {
			  scrollDirection: 'y',  //滚动方向
			  conSelector: "",       //滚动内容选择器   *必填
			  barSelector: "",       //滚动条选择器     
			  sliderSelector: "",    //滑块选择器       *必填
			  wheelStep: "10"
		  }
			$.extend(true,self.options,options || {});

			// console.log(self.options);

			this._initDOM();

			return self;
		},

		_initDOM : function() {
			var opts = this.options;
			this.$cont = $(opts.conSelector); //获取滚动内容
			this.$bar = opts.barSelector ? $(opts.barSelector) : self.$slider.parent();//获取滚动条
			this.$slider = $(opts.sliderSelector);//获取滑块
			this.$doc = $(doc); //获取文档对象

			this._initDrag()._bindContentScroll()._bindMouseWheel();

		},

		_initDrag : function(){
			var slider = this.$slider,
			    self = this,
			    sliderEle = slider[0];
			if(sliderEle) {
				var doc = this.$doc,
				          dragStartPagePosition,
				          dragStartScrollPosition,
				          dragContRate;

			  function mousemoveHandler(e) {
				  e.preventDefault();
				  if(dragStartPagePosition == null) {
					  return ;
					}
					// console.log('test')
				  self.scrollTo(dragStartScrollPosition + (e.pageY - dragStartPagePosition) * dragContRate)
        };

			  slider.on('mousedown',function(e){
          e.preventDefault();
				  // console.log(self.$cont);

				  dragStartPagePosition = e.pageY;
				  dragStartScrollPosition = self.$cont[0].scrollTop;
				  dragContRate = self.getMaxScrollPosition()/self.getMaxSliderPosition();

				  doc.on('mousemove.myScroll',mousemoveHandler)
					   .on('mouseup.myScroll',function(){
								// console.log('mouseup');
							  doc.off('.myScroll');
						  });
				});
			}
			return self;
		},

		_bindContentScroll : function() {
			var self = this;
			self.$cont.on('scroll',function(e) {
				e.preventDefault();
				var sliderEl = self.$slider && self.$slider[0];
				if(sliderEl) {
					sliderEl.style.top = self.getSliderPosition() + 'px';
				}
			});
      return self;
    },
    _bindMouseWheel : function() {
      var self = this;
      self.$cont.on('mousewheel DOMMouseScroll',function(e) {
        e.preventDefault();
				// console.log('mousewheel')
        var oEv = e.originalEvent,
						wheelRange = oEv.wheelDelta ? -oEv.wheelDelta/120 : (oEv.detail || 0)/3;
        self.scrollTo(self.$cont[0].scrollTop + wheelRange * self.options.wheelStep)
      });
    return self;
    },
    //计算滑块位置
    getSliderPosition : function() {
      var self =this,
      maxSliderPosition = self.getMaxSliderPosition();
      return Math.min(maxSliderPosition,maxSliderPosition * self.$cont[0].scrollTop / self.getMaxScrollPosition());
    },
    //滑块可移动距离
    getMaxSliderPosition : function(){
      var self = this;
      return self.$bar.height() - self.$slider.height();
    },
    //内容可滚动高度
    getMaxScrollPosition : function() {
      var self = this;
      return Math.max(self.$cont.height(),self.$cont[0].scrollHeight) - self.$cont.height();
    },
    scrollTo : function(positionVal){
      var self = this;
      self.$cont.scrollTop(positionVal);
    }
  });
   win.CustomScrollBar = CustomScrollBar;
  })(window,document,jQuery);