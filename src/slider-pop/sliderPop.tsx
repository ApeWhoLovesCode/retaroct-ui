import { View, ITouchEvent } from '@tarojs/components';
import { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import { useState } from 'react';
import classNames from 'classnames';
import getEleInfo from '../utils/getEleInfo';
import { randomStr } from '../utils/random';
import { nextTick } from '@tarojs/taro';
import React from 'react';
import { SliderPopInstance, SliderPopProps } from './type';

const classPrefix = 'retaroct-slider-pop';

/** 滑动弹出层 */
const SliderPop = forwardRef<SliderPopInstance, SliderPopProps>(
  ({ direction = 'left', popContent, className, children, popClassName }, ref) => {
    const idRef = useRef(`${randomStr(classPrefix)}`);
    /** 滑动弹出层的宽度 */
    const [filterPopWidth, setFilterPopWidth] = useState<number>(0);
    const touchRef = useRef({
      startX: 0,
    });
    const [moveX, setMoveX] = useState<number>(0);
    const [isMask, setIsMask] = useState(false);

    const isLeft = direction === 'left';

    const onTouchStart = (e: ITouchEvent) => {
      touchRef.current.startX = e.touches[0].clientX;
    };
    const onTouchMove = (e: ITouchEvent) => {
      const x = e.touches[0].clientX - touchRef.current.startX;
      const _filterPopWidth = (x < 0 ? 1 : -1) * filterPopWidth;
      const _x = Math[x < 0 ? 'max' : 'min'](x, -_filterPopWidth);
      if (isLeft && x < 0) {
        setMoveX(_filterPopWidth + _x);
      }
      if (!isLeft && x > 0) {
        setMoveX(_filterPopWidth + _x);
      }
    };
    const onTouchEnd = (e: ITouchEvent) => {
      const x = e.changedTouches[0].clientX - touchRef.current.startX;
      if (isLeft ? x < -50 : x > 50) {
        popHide();
      } else {
        popShow();
      }
    };

    const popShow = () => {
      setMoveX((isLeft ? 1 : -1) * filterPopWidth);
      setIsMask(true);
    };
    const popHide = () => {
      setMoveX(0);
      setIsMask(false);
    };

    useImperativeHandle(ref, () => ({
      popShow,
      popHide,
    }));

    useEffect(() => {
      nextTick(async () => {
        const _info = await getEleInfo(`#${idRef.current}`);
        setFilterPopWidth(_info?.width ?? 0);
      });
    }, []);

    const SliderPopContent = () => {
      return <View className={`${classPrefix}-content ${classNames(className)}`}>{children}</View>;
    };

    return (
      <View className={`${classPrefix}`} style={{ transform: `translateX(${moveX ?? 0}px)` }}>
        {!isLeft && SliderPopContent()}
        <View
          id={idRef.current}
          className={`${classPrefix}-pop ${popClassName} ${
            isLeft ? `${classPrefix}-pop-left` : `${classPrefix}-pop-right`
          }`}
          // catchMove：阻止滑动穿透
          catchMove
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {popContent}
          {isMask && (
            <View
              className={`${classPrefix}-mask ${classPrefix}-mask-${direction}`}
              onClick={() => {
                popHide();
              }}
              style={{ width: `calc(100vw - ${filterPopWidth}px)` }}
            ></View>
          )}
        </View>
        {isLeft && SliderPopContent()}
      </View>
    );
  },
);

export default SliderPop;
