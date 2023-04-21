import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useState, useEffect } from 'react';
import './index.less';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';

const classPrefix = `retaroct-datePicker`;

export type DatePickerProps = {} & NativeProps;

const defaultProps = {};
type RequireType = keyof typeof defaultProps;

const DatePicker = (comProps: DatePickerProps) => {
  const props = useMergeProps<DatePickerProps, RequireType>(comProps, defaultProps);
  const { ...ret } = props;

  return withNativeProps(ret, <View className={classPrefix}></View>);
};

export default DatePicker;
