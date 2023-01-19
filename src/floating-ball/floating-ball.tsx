import { View, ITouchEvent } from '@tarojs/components';
import { useState, useEffect, FC, useRef } from 'react';
import { NativeProps, withNativeProps } from '../utils/native-props';
import getEleInfo from '../utils/getEleInfo';
import { nextTick } from '@tarojs/taro';
import React from 'react';
import { randomStr } from '../utils/random';
import { getScreenInfo, screenH, screenW } from '../utils/handleDom';

const classPrefix = `retaroct-floating-ball`;

/** 悬浮球 */
export type FloatingBallProps = {
  /**
   * 可以进行拖动的方向，xy 表示自由移动
   * @default xy
   */
  axis?: 'x' | 'y' | 'xy';
  /** 自动磁吸到边界 */
  magnetic?: 'x' | 'y';
  /** 贴边时触发 isLeft: true 代表是左或上方向上贴边 */
  onMagnetic?: (isLeft: boolean) => void;
  /** 位置偏移时触发 */
  onOffsetChange?: (offset: { x: number; y: number }) => void;
  children?: React.ReactNode;
} & NativeProps<
  | '--initial-position-left'
  | '--initial-position-right'
  | '--initial-position-top'
  | '--initial-position-bottom'
  | '--z-index'
>;

const FloatingBall: FC<FloatingBallProps> = ({ axis = 'xy', magnetic, ...props }) => {
  const idRef = useRef(randomStr(classPrefix));
  /** 悬浮球的宽，高，上下左右距离 */
  const ball = useRef({ w: 0, h: 0, r: 0, l: 0, t: 0, b: 0 });
  const touchRef = useRef({
    startX: 0,
    startY: 0,
  });
  const [info, setInfo] = useState({
    x: 0,
    y: 0,
  });
  const buttonRef = useRef<HTMLDivElement>(null);

  const onTouchStart = (e: ITouchEvent) => {
    e.stopPropagation();
    touchRef.current.startX = e.touches[0].clientX - info.x;
    touchRef.current.startY = e.touches[0].clientY - info.y;
  };
  const onTouchMove = (e: ITouchEvent) => {
    e.stopPropagation();
    const x = axis === 'y' ? 0 : e.touches[0].clientX - touchRef.current.startX;
    const y = axis === 'x' ? 0 : e.touches[0].clientY - touchRef.current.startY;
    setInfo({ x, y });
    props.onOffsetChange?.({ x, y });
  };
  const onTouchEnd = (e: ITouchEvent) => {
    e.stopPropagation();
    let x = axis === 'y' ? 0 : e.changedTouches[0].clientX - touchRef.current.startX;
    let y = axis === 'x' ? 0 : e.changedTouches[0].clientY - touchRef.current.startY;
    const { w, h, l, r, t, b } = ball.current;
    if (magnetic === 'x') {
      const l_r = l < r ? l : r;
      const _v = l < r ? -1 : 1;
      const middleX = screenW / 2 - l_r - w / 2; // 中间分隔线的值
      const distance = -1 * _v * (screenW - w - l_r * 2); // 另一边的位置
      x = Math.abs(x) > middleX ? (x * _v < 0 ? distance : 0) : 0;
      props.onMagnetic?.(x === 0 ? l < r : l > r);
    } else if (magnetic === 'y') {
      const l_r = t < b ? t : b;
      const _v = t < b ? -1 : 1;
      const middleX = screenH / 2 - l_r - h / 2; // 中间分隔线的值
      const distance = -1 * _v * (screenH - h - l_r * 2); // 另一边的位置
      y = Math.abs(y) > middleX ? (y * _v < 0 ? distance : 0) : 0;
      props.onMagnetic?.(y === 0 ? t < b : t > b);
    }
    setInfo({ x, y });
  };

  useEffect(() => {
    const init = async () => {
      getScreenInfo();
      const ballInfo = await getEleInfo(`.${idRef.current} .${classPrefix}-button`);
      if (!ballInfo) return;
      ball.current.w = ballInfo.width;
      ball.current.h = ballInfo.height;
      ball.current.l = ballInfo.left;
      ball.current.r = screenW - ballInfo.right;
      ball.current.t = ballInfo.top;
      ball.current.b = screenH - ballInfo.bottom;
    };
    nextTick(() => {
      init();
    });
  }, []);

  return withNativeProps(
    props,
    <View className={`${classPrefix} ${idRef.current}`}>
      <View
        ref={buttonRef}
        className={`${classPrefix}-button`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        style={{ transform: `translate(${info.x}px, ${info.y}px)` }}
      >
        {props.children}
      </View>
    </View>,
  );
};

export default FloatingBall;
