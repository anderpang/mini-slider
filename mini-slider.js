"use strict";
/*! <anderpang@foxmail.com> */
Object.defineProperty(exports, "__esModule", { value: true });
var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (t) {
    return setTimeout(t, 16.6667);
}, caf = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || function (t) {
    clearTimeout(t);
};
var MiniSlider = /** @class */ (function () {
    function MiniSlider(options) {
        this.transitionClass = "";
        this.index = 0;
        this._listeners = [];
        this._framesCount = 0;
        this._isTouch = false;
        this._timer = null;
        this._isVeritcal = false;
        this._isMove = false;
        this._value = 0;
        this._ox = 0;
        this._oy = 0;
        this._owh = 0;
        this._timeStamp = 0;
        this._dir = 1;
        this.evts = {
            enter: function () {
                this.stop();
            },
            down: function (e) {
                this._ox = this._isTouch ? e.targetTouches[0].clientX : e.clientX;
                this._oy = this._isTouch ? e.targetTouches[0].clientY : e.clientY;
                this._value = this._isVeritcal ? this._oy : this._ox;
                this.inner.classList.remove(this.transitionClass);
                this._owh = this._isVeritcal ? this.inner.clientHeight : this.inner.clientWidth;
                this._timeStamp = e.timeStamp;
                this._isMove = true;
                this.stop().resetIndex().move();
            },
            move: function (e) {
                if (this._isMove) {
                    this._value = this._isVeritcal ?
                        (this._isTouch ? e.targetTouches[0].clientY : e.clientY) :
                        (this._isTouch ? e.targetTouches[0].clientX : e.clientX);
                }
            },
            up: function (e) {
                if (this._isMove) {
                    var dx = (this._isTouch ? e.changedTouches[0].clientX : e.clientX) - this._ox, dy = (this._isTouch ? e.changedTouches[0].clientY : e.clientY) - this._oy, x2 = dx * dx, y2 = dy * dy, checkValue = this._isVeritcal ? y2 : x2, isChange = (e.timeStamp - this._timeStamp < 200 && checkValue > 25) || checkValue > 2500, isClick = !isChange && x2 < 25 && y2 < 25, index = this.index, dir = this._isVeritcal ? (dy > 0 ? -1 : 1) : (dx > 0 ? -1 : 1);
                    index = isChange ? index + dir : index;
                    if (!this.options.loop) {
                        if (index < 0) {
                            index = 0;
                        }
                        else if (index > this.len - 1) {
                            index = this.len - 1;
                        }
                    }
                    this.stop();
                    this._isMove = false;
                    this.inner.classList.add(this.transitionClass);
                    this.inner.offsetHeight;
                    this.index = index;
                    this.translate(-index * 100);
                    if (!this.options.alwaysBackwards) {
                        this._dir = dir;
                    }
                    isChange ? this._trigger("change") : isClick ? this._trigger("click") : null;
                }
                if (this.options.autoplay && (this._isTouch || e.type === "mouseleave" || e.type === "pointerleave")) {
                    this.play();
                }
            },
        };
        var items, num;
        var opts = Object.assign({
            delay: 5000,
            direction: "horizontal",
            alwaysBackwards: false,
            click: Function.prototype,
            change: Function.prototype,
        }, options);
        this.frames = opts.delay * 60 / 1000 | 0;
        this.transitionClass = opts.transitionClass || "is-anim";
        this.inner = opts.el.firstElementChild;
        this.options = opts;
        this._isVeritcal = opts.direction === "vertical";
        items = this.inner.children;
        num = items.length;
        this.len = num;
        if (num > 1) {
            this.init(items, num);
        }
    }
    MiniSlider.prototype.init = function (items, num) {
        var pos = this._isVeritcal ? "top" : "left";
        if (this.options.loop) {
            var cloneEl = items[num - 1].cloneNode(true), cloneEl2 = items[0].cloneNode(true);
            cloneEl.style[pos] = "-100%";
            cloneEl2.style[pos] = num + "00%";
            this.inner.appendChild(cloneEl);
            this.inner.appendChild(cloneEl2);
        }
        while (num--) {
            // @ts-ignore
            items[num].style[pos] = (num * 100) + "%";
        }
        if (this.options.index) {
            this.index = this.options.index;
            this.translate(-100 * this.index);
        }
        this.move = this.move.bind(this);
        this.initEvent(this.options.el);
        if (this.options.autoplay) {
            this.play();
        }
    };
    MiniSlider.prototype._bindEvents = function (el, types) {
        var i = types.length;
        while (i--) {
            el.addEventListener(types[i], this, false);
        }
    };
    MiniSlider.prototype.initEvent = function (el) {
        var isTouch = typeof el.ontouchstart !== "undefined";
        var isPointer = typeof el.onpointerdown !== "undefined";
        var evts = this.evts;
        var types;
        this._isTouch = isTouch;
        if (isTouch) {
            evts.touchstart = evts.down;
            evts.touchmove = evts.move;
            evts.touchend = evts.touchcancel = evts.up;
            types = ["touchstart", "touchmove", "touchend", "touchcancel"];
        }
        else if (isPointer) {
            evts.pointerenter = evts.enter;
            evts.pointerdown = evts.down;
            evts.pointermove = evts.move;
            evts.pointerup = evts.pointerleave = evts.up;
            types = ["pointerenter", "pointerdown", "pointermove", "pointerup", "pointerleave"];
        }
        else {
            evts.mouseenter = evts.enter;
            evts.mousedown = evts.down;
            evts.mousemove = evts.move;
            evts.mouseup = evts.mouseleave = evts.up;
            types = ["mouseenter", "mousedown", "mousemove", "mouseup", "mouseleave"];
        }
        this._bindEvents(el, types);
        return this;
    };
    MiniSlider.prototype.resetIndex = function () {
        var index = this.index, len = this.len, isReset = false;
        if (index === -1) {
            this.index += len;
            isReset = true;
        }
        else if (index === len) {
            this.index = 0;
            isReset = true;
        }
        if (isReset) {
            this.inner.classList.remove(this.transitionClass);
            this.translate(-this.index * 100);
            this.inner.offsetHeight;
        }
        return this;
    };
    MiniSlider.prototype.translate = function (percent) {
        this.inner.style.transform = this.inner.style.webkitTransform = this._isVeritcal ?
            "translateY(" + percent + "%) translateZ(0)" :
            "translateX(" + percent + "%) translateZ(0)";
        return this;
    };
    MiniSlider.prototype.move = function () {
        this._timer = raf(this.move);
        if (this._isMove) {
            var percent = ((this._value - (this._isVeritcal ? this._oy : this._ox)) * 0.8 / this._owh - this.index) * 100;
            this.translate(percent);
        }
        else if (this.options.autoplay) {
            if (this._framesCount++ > this.frames) {
                this._framesCount = 0;
                this.resetIndex();
                this._dir < 0 ?
                    this._prev() :
                    this._next();
            }
        }
        return this;
    };
    MiniSlider.prototype.play = function () {
        this._isMove = false;
        return this.stop().move();
    };
    MiniSlider.prototype.stop = function () {
        this._framesCount = 0;
        caf(this._timer);
        return this;
    };
    MiniSlider.prototype.prev = function () {
        if (!this.options.alwaysBackwards) {
            this._dir = -1;
        }
        this.stop().resetIndex()._prev();
        if (this.options.autoplay) {
            this.play();
        }
        return this;
    };
    MiniSlider.prototype.next = function () {
        if (!this.options.alwaysBackwards) {
            this._dir = 1;
        }
        this.stop().resetIndex()._next();
        if (this.options.autoplay) {
            this.play();
        }
        return this;
    };
    MiniSlider.prototype._prev = function () {
        var oldIndex = this.index;
        if (--this.index < 0) {
            if (!this.options.loop) {
                this.index = this.options.autoplay && this.len > 1 ? 1 : 0;
                this._dir *= -1;
            }
        }
        this.inner.classList.add(this.transitionClass);
        this.translate(-this.index * 100);
        oldIndex !== this.index && this._trigger("change");
    };
    MiniSlider.prototype._next = function () {
        var oldIndex = this.index;
        if (++this.index === this.len) {
            if (!this.options.loop) {
                this.index = this.options.autoplay && this.len > 1 ? this.len - 2 : this.len - 1;
                this._dir *= -1;
            }
        }
        this.inner.classList.add(this.transitionClass);
        this.translate(-this.index * 100);
        oldIndex !== this.index && this._trigger("change");
        return this;
    };
    MiniSlider.prototype.handleEvent = function (e) {
        var type = e.type;
        var evts = this.evts;
        var f = evts[type];
        f && f.call(this, e);
    };
    MiniSlider.prototype._trigger = function (type) {
        var index = this.index, len = this.len, realIndex = (index + len) % len;
        this.options[type](realIndex, index);
        return this;
    };
    return MiniSlider;
}());
exports.default = MiniSlider;
