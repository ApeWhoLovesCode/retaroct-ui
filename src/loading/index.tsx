import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useState, useEffect } from 'react';
import './index.less';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import { stylePxTransform } from '../utils/handleDom';

const classPrefix = `retaroct-loading`;

export type LoadingProps = {
  type?: LoadingType;
  size?: number | string;
} & NativeProps;
export type LoadingType = 'circular' | 'spinner';

const defaultProps = {
  type: 'circular',
};
type RequireType = keyof typeof defaultProps;
type DefaultPropsType = Omit<LoadingProps, 'type'> & { type: LoadingType };

const Loading = (comProps: LoadingProps) => {
  const props = useMergeProps<LoadingProps, RequireType>(
    comProps,
    defaultProps as DefaultPropsType,
  );
  const { size, type, ...ret } = props;

  return withNativeProps(
    ret,
    <View
      className={classPrefix}
      style={{
        fontSize: stylePxTransform(size),
      }}
    >
      {type === 'circular' && <View className={`${classPrefix}-circular`}></View>}
    </View>,
  );
};

export default Loading;
