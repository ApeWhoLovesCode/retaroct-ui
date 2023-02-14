import { ITouchEvent } from '@tarojs/components';
import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import './index.less';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import { TransitionDuration } from '../use-transition';
import Transition from '../transition';

const classPrefix = `retaroct-mask`;

export type MaskProps = {
  show?: boolean;
  lockScroll?: boolean;
  zIndex?: number;
  duration?: string | number | TransitionDuration;
  children?: ReactNode;
  onClose?: () => void;
} & NativeProps;

const defaultProps = {
  lockScroll: true,
  duration: 300,
};
type RequireType = keyof typeof defaultProps;

const Mask = (comProps: MaskProps) => {
  const props = useMergeProps<MaskProps, RequireType>(comProps, defaultProps);
  const { show, zIndex, lockScroll, duration, onClose, children, ...ret } = props;
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (show) {
      setIsShow(true);
    }
  }, [show]);

  const _noop = useCallback(
    (event: ITouchEvent) => {
      if (lockScroll) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    [lockScroll],
  );

  return isShow ? (
    withNativeProps(
      ret,
      <Transition
        show={show}
        duration={duration}
        className={`${classPrefix}`}
        style={{ zIndex }}
        onClick={() => {
          onClose?.();
        }}
        onAfterLeave={() => {
          setTimeout(() => {
            setIsShow(false);
          }, 0);
        }}
        onTouchMove={_noop}
      >
        {children}
      </Transition>,
    )
  ) : (
    <></>
  );
};

export default Mask;
