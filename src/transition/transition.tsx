import { View } from '@tarojs/components';
import React from 'react';
import './index.less';
import { excludeClass, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import useTransition from '../use-transition';
import { TransitionProps } from './type';

const classPrefix = `retaroct-transition`;

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
      {...excludeClass(ret)}
    >
      {children}
    </View>,
  );
};

export default Transition;
