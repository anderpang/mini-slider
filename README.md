# mini-slider
精简轮播插件

主流移动端、pc端

```javascript
new MiniSlider({
      el:document.querySelector("#slider1"),
      loop:true,
      autoplay:true,
      index:1,
      delay:3000,
      transitionClass:"anim"
  }).onChange(function(realIndex){
      console.log(realIndex);
  });  
```
