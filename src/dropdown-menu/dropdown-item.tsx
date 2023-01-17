import { View, Image, ITouchEvent } from '@tarojs/components';
import React, { useState, useEffect } from 'react';
import { withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import { DropdownItemProps } from './type';

const classPrefix = `retaroct-dropdown-item`;

const defaultProps = {};
type RequireType = keyof typeof defaultProps;

type DropdownItemOtherProps = {
  /** 当前是否是激活的 */
  active?: boolean;
  activeColor?: string;
  direction?: 'down' | 'up';
  onClick?: (e: ITouchEvent) => void;
};

const DropdownItem = (comProps: DropdownItemProps) => {
  const props = useMergeProps<DropdownItemProps & DropdownItemOtherProps, RequireType>(
    comProps,
    defaultProps,
  );
  const { value, title, titleClass, options, active, arrow, activeColor, direction, ...ret } =
    props;
  const [_value, setValue] = useState<number | string | undefined>('');

  useEffect(() => {
    setValue(value);
  }, [value]);

  return withNativeProps(
    ret,
    <View className={classPrefix} onClick={(e) => props.onClick?.(e)}>
      <View
        className={`${classPrefix}-item ${titleClass}`}
        style={{ color: active ? activeColor : '' }}
      >
        <View className={`${classPrefix}-title`}>
          {options?.filter((option) => option?.value === value)[0]?.text ||
            title ||
            options?.[0]?.text}
        </View>
        <View
          className={
            `${classPrefix}-icon ` +
            (!active
              ? `${classPrefix}-icon-${direction}`
              : `${classPrefix}-icon-${direction === 'down' ? 'up' : 'down'}`)
          }
        >
          {arrow ?? (
            <Image
              src={require('./assets/arrow-bottom.png')}
              className={`${classPrefix}-icon-arrow `}
            ></Image>
          )}
        </View>
      </View>
    </View>,
  );
};

export default DropdownItem;
