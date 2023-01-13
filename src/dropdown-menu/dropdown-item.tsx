import { View, Text, ITouchEvent } from '@tarojs/components';
import React, { useState, useEffect } from 'react';
import { withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import { DropdownItemProps } from './type';

const classPrefix = `com-dropdownItem`;

const defaultProps = {};
type RequireType = keyof typeof defaultProps;

const DropdownItem = (comProps: DropdownItemProps) => {
  const props = useMergeProps<DropdownItemProps, RequireType>(comProps, defaultProps);
  const { value, options, children, ...ret } = props;
  const [_value, setValue] = useState<number | string | undefined>('');

  useEffect(() => {
    setValue(value);
  }, [value]);

  return withNativeProps(
    ret,
    <View className={classPrefix} onClick={() => props.onChange?.()}>
      {options?.map((item, index) => (
        <View key={`${item.value}-i-${index}`} className={`${classPrefix}-item`}>
          <View className={`${classPrefix}-title`}>{item.text}</View>
          {item.value === _value && <Text className={`${classPrefix}-icon`}>√</Text>}
        </View>
      ))}
      {children}
    </View>,
  );
};

export default DropdownItem;
