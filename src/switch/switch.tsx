import { View } from '@tarojs/components';
import React from 'react';
import { withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import colorVar from '../style/var';
import { classBem, stylePxTransform } from '../utils/handleDom';
import Loading from '../loading';
import { SwitchProps } from './type';

const classPrefix = `retaroct-switch`;

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
