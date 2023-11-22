/*! <anderpang@foxmail.com> */
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
    options: IMiniSliderOptions;
    inner: HTMLElement;
    len: number;
    index: number;
    constructor(options: IMiniSliderOptions);
    prev(): this;
    next(): this;
}

