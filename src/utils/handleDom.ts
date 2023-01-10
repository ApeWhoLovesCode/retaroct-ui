import { ITouchEvent } from '@tarojs/components';
import type { MouseEvent } from 'react';
import Taro from '@tarojs/taro';

/** 处理style的px */
export const handleStylePx = (v: number | string) => {
  return typeof v === 'number' ? v + 'px' : v;
};

/** 按手机比例处理style */
export const stylePxTransform = (v: number | string) => {
  if (typeof v === 'string') {
    v = parseInt(v);
  }
  const _v = Taro.pxTransform(v, Taro.getSystemInfoSync().windowWidth);
  return handleStylePx(_v);
};

/** 判断是移动端还是pc端 */
export const isMobile = () => {
  return navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
  );
};

/** 鼠标事件 */
export type MouseEventType =
  | MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  | globalThis.MouseEvent;
/** 鼠标或手指事件 */
export type MouseTouchEvent = MouseEventType | ITouchEvent;
/** 处理鼠标或手指的事件 */
export const handleMouseOfTouch = (e: MouseTouchEvent) => {
  const target = !isMobile()
    ? (e as MouseEventType)
    : (e as ITouchEvent).touches[0] || (e as ITouchEvent).changedTouches[0];
  return {
    pageX: target.pageX,
    pageY: target.pageY,
    clientX: target.clientX,
    clientY: target.clientY,
    screenX: target.screenX,
    screenY: target.screenY,
  };
};
