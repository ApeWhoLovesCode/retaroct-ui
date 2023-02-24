import { View } from '@tarojs/components';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Loading, { LoadingType } from '../loading';
import getEleInfo from '../utils/getEleInfo';
import useTouchEvent from '../use-touch-event';
import { withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import awaitFn from '../utils/awaitFn';
import { randomStr } from '../utils/random';
import React from 'react';
import { PullStatus, PullToRefreshProps } from './type';

const classPrefix = `retaroct-pull-to-refresh`;

const defaultProps = {
  headHeight: 60,
  animationDuration: 300,
  completeDuration: 500,
  pullingText: '下拉即可刷新...',
  loosingText: '释放即可刷新...',
  loadingType: 'three-point' as LoadingType,
  completeText: '刷新成功',
};
type RequireType = keyof typeof defaultProps;

const PullToRefresh: React.FC<PullToRefreshProps> = (comProps) => {
  const props = useMergeProps<PullToRefreshProps, RequireType>(comProps, defaultProps);
  const { loadingType, headHeight, pullDistance, animationDuration, ...ret } = props;

  const idRef = useRef(randomStr(`${classPrefix}-header`));
  const [status, setStatus] = useState<PullStatus>('normal');
  const [state, setState] = useState({
    distance: 0,
    duration: 0,
  });
  /** header原始的scrollTop */
  const headerTop = useRef({
    origin: 0,
    cur: 0,
  });

  const { info, onTouchFn } = useTouchEvent({
    onTouchStart: () => {
      if (isTouchable()) {
        getHeaderTop().then((top) => {
          headerTop.current.cur = top;
          if (!isNotPull()) {
            setState((s) => ({ ...s, duration: 0 }));
          }
        });
      }
    },
    onTouchMove: () => {
      if (!isTouchable() || isNotPull()) return;
      const distance = ease(info.deltaY);
      setStatusFn(distance);
    },
    onTouchEnd: async () => {
      if (!isTouchable() || isNotPull()) return;
      if (status === 'pulling') {
        setStatusFn(0);
      } else if (status === 'loosing') {
        setStatusFn(0, true);
        await props.onRefresh?.();
        setStatus('complete');
        await awaitFn(props.completeDuration);
        setStatusFn(0);
        props.onRefreshEnd?.();
      }
    },
  });

  /** 是否是可触摸了 */
  const isTouchable = () => status !== 'loading';

  /** 当前不是下拉 */
  const isNotPull = () => {
    const { cur, origin } = headerTop.current;
    // 还没满足上拉加载的top值; 初始触摸为向上
    return cur < origin || (cur === origin && info.deltaY < 0);
  };

  /** 缓速 */
  const ease = useCallback(
    (distance: number) => {
      const _pullDistance = +(pullDistance || headHeight);
      if (distance > _pullDistance) {
        if (distance < _pullDistance * 2) {
          distance = _pullDistance + (distance - _pullDistance) / 2;
        } else {
          distance = _pullDistance * 1.5 + (distance - _pullDistance * 2) / 4;
        }
      }
      return Math.round(distance);
    },
    [pullDistance, headHeight],
  );

  const setStatusFn = useCallback(
    (v: number, isLoading?: boolean) => {
      let _status: PullStatus = 'normal';
      let duration = 0;
      if (isLoading) {
        v = headHeight;
        _status = 'loading';
        duration = animationDuration;
      } else if (v === 0) {
        _status = 'normal';
        duration = animationDuration;
      } else if (v < (pullDistance ?? headHeight)) {
        _status = 'pulling';
      } else {
        _status = 'loosing';
      }
      setStatus(_status);
      setState((s) => ({ ...s, duration, distance: v }));
    },
    [pullDistance, headHeight, animationDuration],
  );

  const getHeaderTop = async () => {
    const info = await getEleInfo(`.${idRef.current}`);
    return info?.top ?? 0;
  };

  const initHeaderTop = () => {
    getHeaderTop().then((top) => {
      headerTop.current.origin = top;
    });
  };

  useEffect(() => {
    setTimeout(() => {
      initHeaderTop();
    }, 100);
  }, []);

  const renderStatus = () => {
    if (props.renderText) {
      return props.renderText?.({ status, distance: state.distance });
    }
    if (status === 'normal') return null;
    else if (status === 'pulling') return props.pullingText;
    else if (status === 'loading') {
      return props.loadingText ?? <Loading size={24} type={loadingType} />;
    } else if (status === 'loosing') return props.loosingText;
    else if (status === 'complete') return props.completeText;
  };

  const headerStyle = useMemo(
    () => ({
      transitionDuration: `${state.duration}ms`,
      transform: state.distance ? `translateY(${state.distance}px)` : '',
    }),
    [state],
  );

  return withNativeProps(
    ret,
    <View className={`${classPrefix}`}>
      <View className={`${classPrefix}-scrollView`} style={headerStyle} {...onTouchFn}>
        <View
          className={`${classPrefix}-header ${idRef.current}`}
          style={{ height: headHeight + 'px' }}
        >
          {renderStatus()}
        </View>
        {props.children}
      </View>
    </View>,
  );
};

export default PullToRefresh;
