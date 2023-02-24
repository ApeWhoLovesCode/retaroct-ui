import { View, Text } from '@tarojs/components';
import React from 'react';
import './index.less';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import { stylePxTransform } from '../utils/handleDom';

const classPrefix = `retaroct-loading`;

export type LoadingProps = {
  type?: LoadingType;
  color?: string;
  size?: number | string;
} & NativeProps;
export type LoadingType = 'circular' | 'three-point' | 'rotate-xz';

const defaultProps = {
  type: 'circular' as LoadingType,
};
type RequireType = keyof typeof defaultProps;

const Loading = (comProps: LoadingProps) => {
  const props = useMergeProps<LoadingProps, RequireType>(comProps, defaultProps);
  const { size, color, type, ...ret } = props;

  return withNativeProps(
    ret,
    <View
      className={classPrefix}
      style={{
        color,
        fontSize: stylePxTransform(size),
      }}
    >
      {type === 'circular' && <View className={`${classPrefix}-circular`}></View>}
      {type === 'three-point' && (
        <View className={`${classPrefix}-three-point`}>
          <Text className={`${classPrefix}-three-point-item`}></Text>
          <Text className={`${classPrefix}-three-point-item`}></Text>
          <Text className={`${classPrefix}-three-point-item`}></Text>
        </View>
      )}
      {type === 'rotate-xz' && <View className={`${classPrefix}-rotate-xz`}></View>}
    </View>,
  );
};

export default Loading;
