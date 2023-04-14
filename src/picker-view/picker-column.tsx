import { View, Text } from '@tarojs/components';
import Taro, { nextTick } from '@tarojs/taro';
import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import useSetState from '../use-set-state';
import useTouchEvent from '../use-touch-event';
import { PickerColumnInstance, PickerColumnOption, PickerColumnProps } from './type';
import { range } from '../utils/format';
import { isObj } from '../utils/validate';

const DEFAULT_DURATION = 200;

const classPrefix = `retaroct-picker-column`;

const defaultProps = {
  itemHeight: 48,
  visibleItemCount: 5,
};
type RequireType = keyof typeof defaultProps;

const PickerColumn = forwardRef<PickerColumnInstance, PickerColumnProps>((comProps, ref) => {
  const props = useMergeProps<PickerColumnProps, RequireType>(comProps, defaultProps);
  const {
    textKey,
    initialOptions,
    itemHeight,
    value,
    valueKey,
    visibleItemCount,
    onChange,
    ...ret
  } = props;

  const [options, setOptions] = useState<PickerColumnOption[]>([]);
  const [state, updateState] = useSetState({
    curIndex: 0,
    startOffset: 0,
    offset: 0,
    duration: 0,
  });

  useEffect(() => {
    setOptions(initialOptions ?? []);
    const index = initialOptions?.findIndex((o) => o[textKey ?? valueKey] === value);
    if (index && index !== -1 && index !== state.curIndex) {
      setIndex(index);
    }
  }, [initialOptions, value]);

  /** 一开始的偏移量 */
  const baseOffset = (+itemHeight * (visibleItemCount - 1)) / 2;

  const setIndex = (index: number, userAction?: boolean) => {
    const offset = -index * +itemHeight;
    if (index !== state.curIndex) {
      updateState({ curIndex: index });
      if (userAction) {
        nextTick(() => {
          onChange?.();
        });
      }
    }
    updateState({ offset });
  };

  /** 缓速 */
  const ease = (distance: number) => {
    const height = +itemHeight;
    const max = options.length * height;
    if (distance > height || distance < -max) {
      const v = distance < 0 ? -1 : 1;
      distance = Math.abs(distance);
      if (v < 0) distance -= max - height;
      if (distance < height * 2) {
        distance = height + (distance - height) / 2;
      } else {
        distance = height * 1.5 + (distance - height * 2) / 4;
      }
      distance *= v;
      if (v < 0) distance -= max - height;
    }
    return distance;
  };

  const getOffsetIndex = (offset: number) =>
    range(Math.round(-offset / +itemHeight), 0, options.length - 1);

  /** 执行惯性滑动 */
  const momentum = (distance: number, _duration: number) => {
    /** 计算出惯性滑动的距离 s = v / A [A为常量，0.003为一个比较合适的值] */
    const speed = Math.abs(distance / _duration);
    /** 当前距离 + 惯性滑动距离 = 最终距离 */
    const destination = state.offset + (speed / 0.003) * (distance < 0 ? -1 : 1);
    /** 通过最终距离的偏移量来计算应该锁定的index值 */
    const index = getOffsetIndex(destination);
    updateState({ duration: 800 });
    setIndex(index, true);
  };

  const { info, onTouchFn } = useTouchEvent({
    onTouchStart() {
      updateState({
        duration: 0,
        startOffset: state.offset,
      });
    },
    onTouchMove() {
      updateState({ offset: ease(state.startOffset + info.deltaY) });
    },
    onTouchEnd() {
      // 处理惯性滚动
      if (info.time < 300 && Math.abs(info.deltaY) > 15) {
        momentum(info.deltaY, info.time);
        return;
      }

      const index = getOffsetIndex(state.offset);
      setIndex(index, true);
      updateState({ duration: DEFAULT_DURATION });
    },
    isStopEvent: true,
  });

  const getOptionText = (option: [] | string | PickerColumnOption): string | [] => {
    if (isObj(option) && textKey in (option as PickerColumnOption)) {
      const objOption = option as PickerColumnOption;
      return objOption[textKey];
    }
    return option as [];
  };

  useImperativeHandle(ref, () => ({
    getCurrentIndex: () => state.curIndex,
    getValue: () => options[state.curIndex],
    setIndex,
  }));

  const renderItem = options.map((option, index) => (
    <View
      key={index}
      disable-scroll
      className={`${classPrefix}-item`}
      style={{ height: itemHeight + 'px', lineHeight: itemHeight + 'px' }}
    >
      {getOptionText(option)}
    </View>
  ));

  return withNativeProps(
    ret,
    <View className={classPrefix}>
      <View
        className={`${classPrefix}-wrapper`}
        style={{
          transform: `translateY(${state.offset + baseOffset}px)`,
          transitionDuration: `${state.duration}ms`,
          transitionProperty: state.duration ? 'all' : 'none',
        }}
        {...onTouchFn}
      >
        {renderItem}
      </View>
    </View>,
  );
});

export default PickerColumn;
