import { View } from '@tarojs/components';
import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { withNativeProps } from '../utils/native-props';
import getEleInfo from '../utils/getEleInfo';
import { nextTick } from '@tarojs/taro';
import { randomStr } from '../utils/random';
import { MouseTouchEvent } from '../utils/handleDom';
import { SwipeActionProps, SwipeActionRef, SwipeActionType } from './type';
import useTouchEvent from '../use-touch-event';

const classPrefix = 'retaroct-slide-action';
/** 用来控制关闭其他的滑块 */
const controller: {
  [key in string]: {
    closeOnTouchOutside: boolean;
    close: () => void;
  };
} = {};

type TouchType = {
  /** 触摸锁定状态 */
  status: 'not' | 'active' | 'lock';
  direction: 'left' | 'normal' | 'right';
};
type AreaRefType = {
  left: number;
  right: number;
  normal?: number;
};

const rightActionsArr: SwipeActionType[] = [{ key: 'delete', text: '删除', color: '#ee4b46' }];

const SlideAction = forwardRef<SwipeActionRef, SwipeActionProps>(
  (
    {
      children,
      leftActions,
      rightActions = rightActionsArr,
      onAction,
      onActionsReveal,
      closeOnAction,
      closeOnTouchOutside = true,
      ...ret
    },
    ref,
  ) => {
    const idRef = useRef(randomStr(classPrefix));
    const [moveX, setMoveX] = useState<number>(0);
    const touchRef = useRef<TouchType>({
      status: 'not',
      direction: 'normal',
    });
    /** 滑块左右区域的宽度 */
    const areaRef = useRef<AreaRefType>({
      left: 0,
      right: 0,
    });
    /** 动画时间 */
    const duration = useRef(0.4);

    const close = () => {
      if (touchRef.current.direction !== 'normal') {
        setMoveX(0);
        touchRef.current.direction = 'normal';
      }
    };

    const { info, onTouchFn } = useTouchEvent({
      onTouchStart: () => {
        touchRef.current.status = 'not';
        duration.current = 0.1;
      },
      onTouchMove: () => {
        if (touchRef.current.status === 'lock') return;
        if (touchRef.current.status !== 'active') {
          // 当前垂直方向滚动大于10px
          if (info.offsetY > 10) {
            touchRef.current.status = 'lock';
            return;
          }
          // 触摸时间小于100ms
          if (info.time < 100) return;
          touchRef.current.status = 'active';
        }
        const x = info.deltaX;
        const rangeV = -1 * areaRef.current[x < 0 ? 'right' : 'left'];
        // 滑块发生了位移的值
        const directionV = areaRef.current[`${touchRef.current.direction}`] ?? 0;
        const _x = Math[x < 0 ? 'max' : 'min'](x - directionV, rangeV);
        setMoveX(_x);
        Object.keys(controller).forEach((key) => {
          if (key !== idRef.current && controller[key].closeOnTouchOutside) {
            controller[key]?.close();
          }
        });
      },
      onTouchEnd: (e: MouseTouchEvent) => {
        e.stopPropagation();
        if (touchRef.current.status === 'lock') return;
        const x = info.deltaX;
        const direction = x > 0 ? 'left' : 'right';
        const rangeV = areaRef.current[direction];
        const directionV = areaRef.current[`${touchRef.current.direction}`] ?? 0;
        let _moveX = -directionV;
        // 触摸大于(一半区域 + 按钮显示后的宽度)
        if (Math.abs(x) >= Math.abs(rangeV) / 2 + Math.abs(directionV)) {
          touchRef.current.direction = direction;
          _moveX = -rangeV;
        } else {
          // 还没有触发按钮显示，则正常触发，当按钮显示后需要触摸大于一半区域
          if (!directionV || Math.abs(x) > Math.abs(directionV) / 2) {
            touchRef.current.direction = 'normal';
            _moveX = 0;
          }
        }
        duration.current = 0.4;
        setMoveX(_moveX);
        if (_moveX !== 0) {
          onActionsReveal?.(direction);
        }
      },
    });

    useImperativeHandle(ref, () => ({
      show: (side: 'left' | 'right' = 'right') => {
        setMoveX(-areaRef.current[side]);
        onActionsReveal?.(side);
      },
      close,
    }));

    useEffect(() => {
      if (closeOnTouchOutside) {
        controller[idRef.current] = {
          closeOnTouchOutside,
          close: () => close(),
        };
      }
    }, [closeOnTouchOutside]);

    useEffect(() => {
      const init = () => {
        Promise.all([
          getEleInfo(`.${idRef.current} .${classPrefix}-left`),
          getEleInfo(`.${idRef.current} .${classPrefix}-right`),
        ]).then(([leftInfo, rightInfo]) => {
          areaRef.current.left = -(leftInfo?.width ?? 0);
          areaRef.current.right = rightInfo?.width ?? 0;
        });
      };
      nextTick(() => {
        init();
      });
    }, [leftActions, rightActions]);

    const renderButton = (btn: SwipeActionType) => {
      return (
        <View
          key={btn.key}
          className={`${classPrefix}-btn`}
          onClick={(e) => {
            if (closeOnAction) {
              close();
            }
            btn.onClick?.(e);
            onAction?.(btn, e);
          }}
          style={{ backgroundColor: btn.color }}
        >
          {btn.text}
        </View>
      );
    };

    return withNativeProps(
      ret,
      <View className={`${classPrefix} ${idRef.current}`}>
        <View
          className={`${classPrefix}-content`}
          // 添加该属性后，滑动盒子是不会触发滚动效果的 // 不太符合这里，会导致很少区域才能触发滚动
          // catchMove={true}
          style={{
            transitionDuration: duration.current + 's',
            transform: `translateX(${moveX}px)`,
          }}
          {...onTouchFn}
        >
          <View className={`${classPrefix}-left ${classPrefix}-area`}>
            {leftActions?.map(renderButton)}
          </View>
          <View className={`${classPrefix}-content`}>{children}</View>
          <View className={`${classPrefix}-right ${classPrefix}-area`}>
            {rightActions?.map(renderButton)}
          </View>
        </View>
      </View>,
    );
  },
);

export default SlideAction;
