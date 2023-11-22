# MiniSlider

Simple and mini carousel plugin（Size 6kb）

精简轮播插件（文件大小6kb）

其实，很多时候，我们只想要一个简单、代码又少的轮播
## Install

```js
npm install @anderpang/mini-slider
```

## Usage

import
```js
  import "@anderpang/mini-slider/style.css";
  import MiniSlider from "@anderpang/mini-slider";
```
or
```html
<link rel="stylesheet" href="node_modules/@anderpang/mini-slider/style.css">
<script src="@anderpang/mini-slider/dist/mini-slider.js"></script>
```


html

```html
<div class="mini-slider">
    <ul class="slider-list">
        <li class="slider-item">1</li>
        <li class="slider-item">2</li>
        <li class="slider-item">3</li>
    </ul>
</div>
```

Customize CSS for testing

```html
  <style>
     .mini-slider{
        width:50%;
        height:20vh;
        margin:1em auto;
        border:1px solid #CCC;
    }
  </style>
```

*** Example 1 ***

```js
new MiniSlider({
    el:document.querySelector(".mini-slider")
});
```
*** Example 2 ***

```js
var slider=new MiniSlider({
    el:document.querySelector(".mini-slider")!,
    loop:true,
    autoplay:true,
    // direction:"vertical",
    index:1,
    delay:3000,
    transitionClass:"is-anim",
    // alwaysBackwards:true,
    click(realIndex){
      console.log("click",realIndex)
    },
    change(realIndex,index){
        console.log("change",realIndex,index);
    }
})  

// slider.prev();
// slider.next();
```
## Class

```ts
type IListener = (realIndex: number, index?: number) => void;

export interface IMiniSliderOptions {
    el: HTMLElement | Element;
    index?: number;
    autoplay?: boolean;
    delay?: number;
    loop?: boolean;
    transitionClass?: string;
    direction?: "horizontal" | "vertical";
    alwaysBackwards?: boolean;
    click?: IListener;
    change?: IListener;
}

export default class MiniSlider {
    len: number;
    index: number;
    constructor(options: IMiniSliderOptions);
    prev(): this;
    next(): this;
}

```