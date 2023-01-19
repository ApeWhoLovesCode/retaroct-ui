import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useState, useEffect, useRef } from 'react';
import './index.less';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import { randomStr } from '../utils/random';

const classPrefix = `retaroct-slider`;

export type SliderProps = {} & NativeProps;

const defaultProps = {};
type RequireType = keyof typeof defaultProps;

const Slider = (comProps: SliderProps) => {
  const props = useMergeProps<SliderProps, RequireType>(comProps, defaultProps);
  const { ...ret } = props;

  const idRef = useRef(randomStr(classPrefix));

  return withNativeProps(ret, <View className={`${classPrefix} ${idRef.current}`}></View>);
};

export default Slider;
