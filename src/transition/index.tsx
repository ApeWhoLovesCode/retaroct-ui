import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useState, useEffect, ReactNode } from 'react';
import './index.less';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';

const classPrefix = `com-transition`;

export type TransitionProps = {
  show?: boolean;
  duration?: string | number | { enter: string | number; leave: string | number };
  name?: string;
  onBeforeEnter?: () => void;
  onBeforeLeave?: () => void;
  onAfterEnter?: () => void;
  onAfterLeave?: () => void;
  onEnter?: () => void;
  onLeave?: () => void;
  enterClass?: string;
  enterActiveClass?: string;
  enterToClass?: string;
  leaveClass?: string;
  leaveActiveClass?: string;
  leaveToClass?: string;
  children?: ReactNode;
} & NativeProps;

const defaultProps = {};
type RequireType = keyof typeof defaultProps;

const Transition = (comProps: TransitionProps) => {
  const props = useMergeProps<TransitionProps, RequireType>(comProps, defaultProps);
  const { children, ...ret } = props;
  return withNativeProps(
    ret,
    <View
      className={classPrefix}
      style={{
        transitionDuration: 0 + 'ms',
        display: '',
      }}
      catchMove
    >
      {children}
    </View>,
  );
};

export default Transition;
