import { View } from '@tarojs/components';
import React from 'react';
import './index.less';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import getIconObj from './iconfont/getIconObj';
import { replaceHexToRgb } from '../utils/replace';
import { IconName } from './iconfont/iconType';
import Taro from '@tarojs/taro';

const classPrefix = `retaroct-icon`;

export type IconProps = {
  /** 图标名称 */
  name: IconName;
  /** 图标颜色 小程序下使用，h5用 color 即可 */
  color?: string;
  /** 图标大小 小程序下使用，h5用 fontSize 即可 */
  size?: number;
} & NativeProps;

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
