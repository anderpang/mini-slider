/*!<anderpang@foxmail.com>*/

"use strict";
(function(context,factory){
    typeof module==="object"?
           module.exports=factory():
           context.MiniSlider=factory();
})(this,function(){
    var raf=window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(t){
        return setTimeout(t,16.6667);
    },
    caf=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||function(t){
        clearTimeout(t)
    };

    /**
     * 
     * @param {Object} opts {
     *      el:DOM,
     *      index:0,
     *      autoplay:false,
     *      delay:5000,
     *      loop:true,
     *      transitionClass:"amin"
     *  }
     */

    function MiniSlider(opts){
        var items,num;
        this.options=opts;
        this.options.autoplay=opts.autoplay && opts.loop;
        this.frames=(opts.delay||5000)*60/1000|0;
        this._framesCount=0;
        this.transitionClass=opts.transitionClass||"anim";
        this.inner=opts.el.firstElementChild;
        this._listeners=[];
        items=this.inner.children;
        num=items.length;
        this.len=num;
        if(num>1){            
            this.index=0;
            this.init(items,num);
        }
    }

    MiniSlider.prototype={
        init:function(items,num){
            if(this.options.loop)
            {
                var cloneEl=items[num-1].cloneNode(true),
                    cloneEl2=items[0].cloneNode(true);
                cloneEl.style.left="-100%";
                cloneEl2.style.left=num+"00%";            
                    
                this.inner.appendChild(cloneEl);
                this.inner.appendChild(cloneEl2);
            }

            while(num--){
                items[num].style.left=(num*100)+"%";
            }
  
            if(this.options.index){
                this.index=this.options.index;
                this.translate(-100*this.index);
            }
            this.move=this.move.bind(this);
            this.initEvent(this.options.el);
            if(this.options.autoplay){
                this.play();
            }
        },
        initEvent:function(el){
            var isTouch=typeof el.ontouchstart!=="undefined";
            this._isTouch=isTouch;
            if(isTouch){
                this.touchstart=this.mousedown;
                this.touchmove=this.mousemove;
                this.touchend=this.touchcencel=this.mouseup;

                el.addEventListener("touchstart",this,false);
                el.addEventListener("touchmove",this,false);
                el.addEventListener("touchend",this,false);
                el.addEventListener("touchcancel",this,false);
            }
            else{
                this.mouseleave=this.mouseup;
                el.addEventListener("mouseenter",this,false);
                el.addEventListener("mousedown",this,false);
                el.addEventListener("mousemove",this,false);
                el.addEventListener("mouseup",this,false);
                el.addEventListener("mouseleave",this,false);
            } 
            return this;       
        },
        resetIndex:function(){
        var index=this.index,
            len=this.len,
            isReset=false;

            if(index===-1){
                this.index+=len;
                isReset=true;
            }
            else if(index===len){
                this.index=0;
                isReset=true;
            }
            if(isReset){
                this.inner.classList.remove(this.transitionClass);
                this.translate(-this.index*100);
                this.inner.offsetHeight;
            }
            return this;
        },
        translate:function(percent){      
        this.inner.style.transform=this.inner.style.webkitTransform="translateX("+percent+"%) translateZ(0)";
        return this;
        },
        move:function(){
            this._timer=raf(this.move);
            if(this._isMove)
            {
                var percent=((this._mouseX-this._ox)/this._ow-this.index)*100;
                this.translate(percent);
            }
            else if(this.options.autoplay){
                if(this._framesCount++>this.frames){
                    this._framesCount=0;
                    this.resetIndex().next();
                }
            }
            return this;
        },
        play:function(){
        this._isMove=false;        
        return this.stop().move();       
        },
        stop:function(){
            this._framesCount=0;
            caf(this._timer);
            return this;
        },
        prev:function(){
        this.index--;
        this.inner.classList.add(this.transitionClass);
        this.translate(-this.index*100).emit();
        return this;
        },
        next:function(){
            this.index++;
            this.inner.classList.add(this.transitionClass);    
            this.translate(-this.index*100).emit();
            return this;
        },
        mouseenter:function(){
            this.stop();
        },
        mousedown:function(e){
            this._ox=this._mouseX=this._isTouch?e.targetTouches[0].clientX:e.clientX;
            this.inner.classList.remove(this.transitionClass);
            this._ow=this.inner.clientWidth;              
            this._timeStamp=e.timeStamp;
            this._isMove=true;
            this.stop().resetIndex().move();        
        },
        mousemove:function(e){        
        if(this._isMove){
            this._mouseX=this._isTouch?e.targetTouches[0].clientX:e.clientX;
        }
        },
        mouseup:function(e){
        if(this._isMove){
            var dx=(this._isTouch?e.changedTouches[0].clientX:e.clientX)-this._ox,
                absX=Math.abs(dx),
                isChange=e.timeStamp-this._timeStamp<200 && absX>5 ||absX>50,
                index=this.index;

                index=isChange?(dx>0?index-1:index+1):index;

                if(!this.options.loop){
                    if(index<0){
                        index=0;
                    }
                    else if(index>this.len-1){
                            index=this.len-1;
                    }
                }

            this.stop();
            this._isMove=false;
            this.inner.classList.add(this.transitionClass);
            this.inner.offsetHeight;
            this.index=index;
            this.translate(-index*100);
            isChange&&this.emit();
        }
        if(this.options.autoplay && (this._isTouch || e.type==="mouseleave")){
            this.play();
        }
        },
        onChange:function(f){
            var len=this.len;
            this._listeners.push(f);
            if(len>1){
                f.call(this,(this.index+len)%len);
            }
            return this;
        },
        emit:function(){
        var _listeners=this._listeners,
            i=0,
            ii=_listeners.length,           
            index=this.index,
            len=this.len,
            realIndex=(index+len)%len;

            for(;i<ii;i++){
                _listeners[i].call(this,realIndex);
            }
            return this;
        },
        handleEvent:function(e){
            var type=e.type;
            this[type]&&this[type](e);        
        }
    };

    return MiniSlider;
});
