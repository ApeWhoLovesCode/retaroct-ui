import { View } from '@tarojs/components';
import React, { ReactNode } from 'react';
import './index.less';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import useTransition, { TransitionType } from '../use-transition';

const classPrefix = `com-transition`;

export type TransitionProps = {
  children?: ReactNode;
} & TransitionType &
  NativeProps;

const defaultProps = {};
type RequireType = keyof typeof defaultProps;

const Transition = (comProps: TransitionProps) => {
  const props = useMergeProps<TransitionProps, RequireType>(comProps, defaultProps);
  const {
    onBeforeEnter,
    onBeforeLeave,
    onAfterEnter,
    onAfterLeave,
    onEnter,
    onLeave,
    duration,
    name,
    show,
    enterClass,
    enterActiveClass,
    enterToClass,
    leaveClass,
    leaveActiveClass,
    leaveToClass,
    children,
    ...ret
  } = props;
  const { currentDuration, classes, display } = useTransition({
    show,
    duration: duration,
    name: name,
    enterClass,
    enterActiveClass,
    enterToClass,
    leaveClass,
    leaveActiveClass,
    leaveToClass,
    onBeforeEnter,
    onBeforeLeave,
    onAfterEnter,
    onAfterLeave,
    onEnter,
    onLeave,
  });

  return withNativeProps(
    ret,
    <View
      className={`${classPrefix} ${classes}`}
      style={{
        transitionDuration: currentDuration + 'ms',
        display: display ? '' : 'none',
      }}
      catchMove
    >
      {children}
    </View>,
  );
};

export default Transition;
