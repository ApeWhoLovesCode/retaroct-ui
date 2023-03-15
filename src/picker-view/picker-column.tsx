import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useState, useEffect, useMemo } from 'react';
import './index.less';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import useSetState from '../use-set-state';

const classPrefix = `retaroct-pickerColumn`;

export type PickerColumnProps = {
  defaultIndex?: number;
  itemHeight: number;
  visibleItemCount: string | number;
} & NativeProps;

const defaultProps = {};
type RequireType = keyof typeof defaultProps;

const PickerColumn = (comProps: PickerColumnProps) => {
  const props = useMergeProps<PickerColumnProps, RequireType>(comProps, defaultProps);
  const { defaultIndex, itemHeight, visibleItemCount, ...ret } = props;

  const [options, setOptions] = useState<Array<any>>([]);
  const [state, updateState] = useSetState({
    index: defaultIndex,
    offset: 0,
    duration: 0,
    // options: deepClone(initialOptions),
  });

  /** 一开始的偏移量，假设itemHeight为44，若要定位到第一个元素，则baseOffset为 44 * 2 */
  const baseOffset = (itemHeight * (+visibleItemCount - 1)) / 2;

  const renderItem = options.map((option, index) => (
    <View key={index} className={`${classPrefix}-item`} style={{ height: itemHeight + 'px' }}>
      {index}
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
      >
        {renderItem}
      </View>
    </View>,
  );
};

export default PickerColumn;
