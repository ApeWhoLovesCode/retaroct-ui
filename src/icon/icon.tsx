import { View } from '@tarojs/components';
import React from 'react';
import { withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import getIconObj from './iconfont/getIconObj';
import { replaceHexToRgb } from '../utils/replace';
import Taro from '@tarojs/taro';
import { IconProps } from './type';

const classPrefix = `retaroct-icon`;

const defaultProps = {};
type RequireType = keyof typeof defaultProps;

const Icon = (comProps: IconProps) => {
  const props = useMergeProps<IconProps, RequireType>(comProps, defaultProps);
  const { name, color = '#333333', size = 16, ...ret } = props;

  return withNativeProps(
    ret,
    // h5
    Taro.getEnv() === Taro.ENV_TYPE.WEB ? (
      <View
        className={classPrefix}
        dangerouslySetInnerHTML={{ __html: decodeURIComponent(getIconObj()[name]) }}
      />
    ) : (
      // 小程序
      <View
        className={classPrefix}
        style={`background-image: url("data:image/svg+xml, ${
          getIconObj(size + 'px', replaceHexToRgb(color))[name]
        }"); width: ${size}px; height: ${size}px;`}
      />
    ),
  );
};

export default Icon;
