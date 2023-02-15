import { ITouchEvent } from '@tarojs/components';
import type { MouseEvent } from 'react';
import Taro from '@tarojs/taro';

/** 屏幕宽高 */
export let screenW = 0;
export let screenH = 0;

/** 获取屏幕宽高 */
export const getScreenInfo = () => {
  // h5
  if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
    screenW = window.innerWidth;
    screenH = window.innerHeight;
  } else {
    screenW = Taro.getSystemInfoSync().screenWidth;
    screenH = Taro.getSystemInfoSync().screenHeight;
  }
  return { screenW, screenH };
};

/** 处理style的px */
export const handleStylePx = (v: number | string) => {
  return typeof v === 'number' ? v + 'px' : v;
};

/** 按手机比例处理style */
export const stylePxTransform = (v?: number | string) => {
  if (!v) return '';
  if (typeof v === 'string') {
    v = parseInt(v);
  }
  const _v = Taro.pxTransform(v, Taro.getSystemInfoSync().windowWidth);
  return handleStylePx(_v);
};

/** 处理类名与需要判断的类名 */
export const classBem = (classnames: string, obj?: { [key in string]?: boolean }) => {
  let str = classnames;
  if (obj) {
    Object.keys(obj).forEach((key) => {
      str += ' ' + (obj[key] ? classnames + '-' + key : '');
    });
  }
  return str;
};

/** 判断是移动端还是pc端 */
export const isMobile = () => {
  // h5
  if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
    return navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
    );
  }
  return true;
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
/** 返回的类型 */
export type MouseTouchE = {
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
  screenX: number;
  screenY: number;
};
