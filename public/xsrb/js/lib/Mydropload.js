/**
 * dropload
 * 西门
 * 0.3.0(150410)
 */

;(function($){
    'use strict';
    $.fn.dropload = function(options){
        return new MyDropLoad(this, options);
    };
    var MyDropLoad = function(element, options){
        var me = this;
        me.$element = $(element).children();
        me.insertDOM = false;
        me.loading = false;
        me.isLock = false;
        me.init(options);
    };

    // 初始化
    MyDropLoad.prototype.init = function(options){
        var me = this;
        me.opts = $.extend({}, {
            domUp : {                                                            // 上方DOM
                domClass   : 'dropload-up',
                domLoad    : '<div class="dropload-load">○加载中...</div>'
            },
            domDown : {                                                          // 下方DOM
                domClass   : 'dropload-down',
                domLoad    : '<div class="dropload-load">○加载中...</div>'
            },
            distance : 100,                                                       // 拉动距离
            loadUpFn : '',                                                       // 上方function
            loadDownFn : ''                                                      // 下方function
        }, options);

        // 绑定触摸
        me.$element.on('touchstart',function(e){
            if(!me.loading){
                fnTouches(e);
                fnTouchstart(e, me);
            }
        });
        me.$element.on('touchmove',function(e){
            if(!me.loading){
                //console.log(!me.loading)
                fnTouches(e, me);
                fnTouchmove(e, me);
            }
        });
        me.$element.on('touchend',function(){
            if(!me.loading  && !me.isLock){
                fnTouchend(me);
            }
        });
    };

    // touches
    function fnTouches(e){
        if(!e.touches){
            e.touches = e.originalEvent.touches;
        }
    }

    // touchstart
    function fnTouchstart(e, me){
        me._startY = e.touches[0].pageY;
        me._loadHeight = me.$element.height();
        me._$childrenD=me.$element.children().filter(me.opts.activeLabel);
        me._childrenHeight = me._$childrenD.get(0).scrollHeight;
        me._scrollTop = me._$childrenD.scrollTop();
    }

    // touchmove
    function fnTouchmove(e, me){
        me._curY = e.touches[0].pageY;
        me._moveY = me._curY - me._startY;
        me._scrollTopDown = me._$childrenD.scrollTop();
        if(me._moveY > 0){
            me.direction = 'down';
        }else if(me._moveY < 0){
            me.direction = 'up';
        }
        var _absMoveY = Math.abs(me._moveY);
        //// 加载上方
        if(me.opts.loadUpFn != '' && me._scrollTop <= 0&&me.direction == 'down'){
            e.preventDefault();
            if(!me.insertDOM){
                var prependDom='<div class="'+me.opts.domUp.domClass+'"><div class="loadUp-struct-absolute"><div class="loadUp-line-left"></div><div class="loadingUp-rotate-border"><div class="preloading"></div></div></div></div>'
                me.$element.parent().prepend(prependDom);
                me.insertDOM = true;
            }
            me.$domUp = $('.'+me.opts.domUp.domClass);
            fnTransition(me.$domUp,0);

            // 下拉
            if(_absMoveY <= me.opts.distance){
                me._offsetY = _absMoveY;
                // 指定距离 < 下拉距离 < 指定距离*2
            }else if(_absMoveY > me.opts.distance && _absMoveY <= me.opts.distance*2){
                me._offsetY = me.opts.distance+(_absMoveY-me.opts.distance)*0.5;
                // 下拉距离 > 指定距离*2
            }else{
                me._offsetY = me.opts.distance+me.opts.distance*0.5+(_absMoveY-me.opts.distance*2)*0.2;
            }

            me.$domUp.css({'height': me._offsetY});

            //console.log(me.$domUp.css('top'))
            //var upMove=-100+_absMoveY
            //if(upMove <= me.opts.distance){
            //    me.$domUp.css({'transition':'top 0s','-webkit-transition':'top 0s','top':upMove+"px"})
            //    // 指定距离 < 下拉距离 < 指定距离*2
            //}else if(upMove > me.opts.distance && upMove <= me.opts.distance*2){
            //    me.$domUp.css({'transition':'top 0s','-webkit-transition':'top 0s','top':me.opts.distance+(upMove-me.opts.distance)/6+"px"})
            //    // 下拉距离 > 指定距离*2
            //}else{
            //    //me.$domUp.css({'transition':'top 0s','-webkit-transition':'top 0s','top':upMove+"px"})
            //}
            //if(upMove<me.opts.distance){
            //    me.$domUp.css({'transition':'top 0s','-webkit-transition':'top 0s','top':upMove+"px"})
            //}

            me.$domLoad = $('.preloading');
            me.$domLoad.css({'opacity':me._offsetY/90,'-webkit-transform':'rotate('+me._offsetY*4+'deg)','transform':'rotate('+me._offsetY*4+'deg)'})
            //me.$element.scrollTop(_absMoveY);
        }

        // 加载下方
        if(me.opts.loadDownFn != '' && me._childrenHeight == (me._loadHeight+me._scrollTopDown) && me.direction == 'up'){
            e.preventDefault();
            if(!me.insertDOM){
                me._$childrenD.append('<div class="'+me.opts.domDown.domClass+'"></div>');
                me.insertDOM = true;
            }
            me.$domDown = $('.'+me.opts.domDown.domClass);
            me.$domDown.html('').append(me.opts.domDown.domLoad);
            me.$domDown.css({'height': '50px'});
            // me.$element.scrollTop(me._childrenHeight);
            fnTransition(me.$domDown,300);
            fnCallback(me);
        }

    }

    // touchend
    function fnTouchend(me){
        //alert($('.dropload-inner').height())
        //alert(me.$element.get(0).scrollHeight)
        //alert(me.$element.children().get(0).scrollHeight)
        var _absMoveY = me._offsetY;
        if(me.insertDOM){
            me.loading = true;
            if(me.direction == 'down'){
                if(_absMoveY > me.opts.distance){
                    me.$domLoad.removeClass().addClass('loading')
                    me.$domUp.children().children('.loadUp-line-left').css({'transition':'opacity 0.5s,-webkit-transform 0.5s','-webkit-transition':'opacity 0.5s,-webkit-transform 0.5s',opacity:'0','-webkit-transform':'rotate(180deg)'})
                    me.$domUp.css({'transition':'height,webkit-transform 0.5s','-webkit-transition':'height 0.5s','height':me.opts.distance});
                    //me.$domUp.css({'transition':'-webkit-transform 0.5s','-webkit-transition':'-webkit-transform 0.5s'});
                    //me.$domLoad.css({'-webkit-transition':'transform','transition':'transform',transform:'rotate(0deg)'})
                    fnTransition(me.$domLoad,0);
                    me.$domUp.on('webkitTransitionEnd',function(){
                        fnCallback(me)
                        me.$domUp.unbind('webkitTransitionEnd')
                    })
                }
                else{
                    me.loading = false;
                    me.insertDOM = false;
                    me.$domUp.css({'transition':'height 0.1s','-webkit-transition':'height 0.1s',height:'0px'}).on('transitionEnd',function(){
                        $(this).remove()
                        me.$domUp.unbind('webkitTransitionEnd')
                    });
                }
            }

            //if(_absMoveY > me.opts.distance){
            //    me.$domUp.css({'height':me.$domUp.children().height()});
            //    fnCallback(me);
            //}else{
            //    me.$domResult.css({'height':'0'}).on('webkitTransitionEnd',function(){
            //        me.insertDOM = false;
            //        $(this).remove();
            //    });
            //}
            me._moveY = 0;
        }
    }

    // 回调
    function fnCallback(me){
        me.loading = true;
        if(me.opts.loadUpFn != '' && me.direction == 'down'){
            me.opts.loadUpFn(me);
        }else if(me.opts.loadDownFn != '' && me.direction == 'up'){
            me.opts.loadDownFn(me);
        }
    }

    //// 锁定
    //MyDropLoad.prototype.lock = function(){
    //    var me = this;
    //    me.isLock = true;
    //};
    //
    //// 解锁
    //MyDropLoad.prototype.unlock = function(){
    //    var me = this;
    //    me.isLock = false;
    //};

    // 重置
    MyDropLoad.prototype.resetload = function(){
        //数值越大，加载等待时间越长
        var me = this;
        var setTimeoutTime=0
        setTimeout(function(){
            if(!!me.$domDown){
                $('.dropload-load').html('')
                me.$domDown.css({'height':'0'}).bind('webkitTransitionEnd',function(){
                    //me.$element.bind('touchmove',function(e){
                    //    e.returnValue=true;
                    //    return true;
                    //});
                    $(this).remove();
                    me.loading = false;
                    me.insertDOM = false;
                    me.$domDown.unbind('webkitTransitionEnd')
                });
            }
            if(!!me.$domUp){
                me.$domUp.css({'height':'0'}).bind('webkitTransitionEnd',function(){
                    tryLagRemove(me,this)
                });
            }
        },setTimeoutTime)
    };

    // css过渡
    function fnTransition(dom,num){
        dom.css({
            '-webkit-transition':'all '+num+'ms',
            'transition':'all '+num+'ms'
        });
    }
})(window.Zepto || window.jQuery);

tryLagRemove=function(me,domup){
    var t=setTimeout(function(){
        //alert(me.$domUp.css('height'))
        //me.$element.bind('touchmove',function(e){
        //    e.returnValue=true;
        //    return true;
        //});
        $(domup).remove()
        me.loading = false;
        me.insertDOM = false;
        initialStartMove(me)
        //alert(1)
        me.$domUp.unbind('webkitTransitionEnd')
    },400);
}

initialStartMove=function(me){
    me._startY = undefined;
    me._loadHeight = undefined;
    me._childrenHeight = undefined;
    me._scrollTop = undefined;
}