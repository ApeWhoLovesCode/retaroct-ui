import { View, ITouchEvent } from '@tarojs/components';
import React from 'react';
import './index.less';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import colorVar from '../style/var';
import { classBem, stylePxTransform } from '../utils/handleDom';
import Loading from '../loading';

const classPrefix = `retaroct-switch`;

export type SwitchProps = {
  /** 切换开启 */
  checked?: boolean;
  /** 是否开启加载 */
  loading?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 激活的颜色 */
  activeColor?: string;
  /** 失活的颜色 */
  inactiveColor?: string;
  /** 大小 */
  size?: string | number;
  onChange?: (event: ITouchEvent) => void;
} & NativeProps;

const defaultProps = {
  activeColor: colorVar.blue,
  size: 30,
};
type RequireType = keyof typeof defaultProps;

const Switch = (comProps: SwitchProps) => {
  const props = useMergeProps<SwitchProps, RequireType>(comProps, defaultProps);
  const { checked, activeColor, inactiveColor, loading, disabled, size, ...ret } = props;

  const curColor = checked ? activeColor : inactiveColor;

  return withNativeProps(
    ret,
    <View
      className={`${classBem(classPrefix, { disabled })}`}
      style={{
        fontSize: stylePxTransform(size),
        background: curColor,
      }}
      onClick={(e) => {
        if (!disabled && !loading) {
          props.onChange?.(e);
        }
      }}
    >
      <View
        className={`${classPrefix}-round`}
        style={{
          transform: checked ? `translateX(${stylePxTransform(size)})` : '',
        }}
      >
        {loading && (
          <Loading
            style={{
              fontSize: `calc(${stylePxTransform(size)} * 0.5)`,
              color: curColor,
            }}
          />
        )}
      </View>
    </View>,
  );
};

export default Switch;
