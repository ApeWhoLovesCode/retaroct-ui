import { View } from '@tarojs/components';
import React from 'react';
import './index.less';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import iconObj from './iconfont/iconObj';

const classPrefix = `retaroct-icon`;

export type IconProps = {
  name: string;
  color?: string;
  size?: number;
} & NativeProps;

const defaultProps = {};
type RequireType = keyof typeof defaultProps;

const Icon = (comProps: IconProps) => {
  const props = useMergeProps<IconProps, RequireType>(comProps, defaultProps);
  const { name, color, size = 16, ...ret } = props;

  return withNativeProps(
    ret,
    <View
      className={classPrefix}
      style={`background-image: url("data:image/svg+xml, ${iconObj[name]}"); width: ${size}px; height: ${size}px;`}
    />,
  );
};

export default Icon;
