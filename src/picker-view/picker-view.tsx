import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useState, useEffect, forwardRef } from 'react';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import { PickerViewInstance } from './type';

const classPrefix = `retaroct-picker-view`;

export type PickerViewProps = {} & NativeProps;

const defaultProps = {};
type RequireType = keyof typeof defaultProps;

const PickerView = forwardRef<PickerViewInstance, PickerViewProps>((comProps, ref) => {
  const props = useMergeProps<PickerViewProps, RequireType>(comProps, defaultProps);
  const { ...ret } = props;

  return withNativeProps(ret, <View className={classPrefix}></View>);
});

export default PickerView;
