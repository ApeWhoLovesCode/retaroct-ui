import { View, Image } from '@tarojs/components';
import React, { useState, useEffect, useMemo } from 'react';
import { withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import useTransition from '../use-transition';
import { letterUpperTolower } from '../utils/format';
import Mask from '../mask';
import { PopupCloseIconPosition, PopupPosition, PopupProps } from './type';

const classPrefix = `retaroct-popup`;

/** 弹出层里面的内容 */
const PopupInner = (props: PopupProps & { setIsShow?: (v: boolean) => void }) => {
  const {
    show,
    position,
    duration,
    zIndex,
    round,
    closeable,
    closeIcon,
    closeIconPosition,
    safeAreaInsetBottom,
    safeAreaInsetTop,
    onBeforeEnter,
    onBeforeLeave,
    onAfterEnter,
    onAfterLeave,
    onEnter,
    onLeave,
    onClose,
    children,
    ...ret
  } = props;

  const _onAfterLeave = () => {
    onAfterLeave?.();
    setTimeout(() => {
      props.setIsShow?.(false);
    }, 0);
  };

  const { inited, currentDuration, classes, display, onTransitionEnd } = useTransition({
    show,
    duration: duration,
    name: position,
    onBeforeEnter,
    onBeforeLeave,
    onAfterEnter,
    onAfterLeave: _onAfterLeave,
    onEnter,
    onLeave,
  });

  const handleClass = (obj: { [key in string]: boolean | undefined }) =>
    Object.keys(obj).reduce((pre, key) => (pre += obj[key] ? ` ${classPrefix}-${key}` : ''), '');

  const closeIconPositionMemo = useMemo(() => {
    const obj: {
      [K in PopupPosition]: PopupCloseIconPosition;
    } = {
      center: 'top-right',
      top: 'bottom-right',
      bottom: 'top-right',
      left: 'top-right',
      right: 'top-left',
    };
    return closeIconPosition || obj[position!] || '';
  }, [position, closeIconPosition]);

  return inited ? (
    withNativeProps(
      ret,
      <View
        className={
          classes +
          ` ${classPrefix} ` +
          `${classPrefix}-${position} ` +
          `${handleClass({
            round,
            safeBottom: safeAreaInsetBottom,
            safeTop: safeAreaInsetTop,
          })}`
        }
        style={{
          zIndex,
          transitionDuration: currentDuration + 'ms',
          display: display ? '' : 'none',
        }}
        onTransitionEnd={onTransitionEnd}
      >
        {children}
        {closeable && (
          <Image
            className={
              `${classPrefix}-close-icon ` +
              `${classPrefix}-close-icon-${letterUpperTolower(closeIconPositionMemo)}`
            }
            src={closeIcon ?? require('./assets/close.png')}
            onClick={() => onClose?.()}
          ></Image>
        )}
      </View>,
    )
  ) : (
    <></>
  );
};

const defaultProps = {
  duration: 300,
  position: 'center' as PopupPosition,
  overlay: true,
  closeOnClickOverlay: true,
  safeAreaInsetBottom: true,
  lockScroll: true,
};
type RequireType = keyof typeof defaultProps;

const Popup = (comProps: PopupProps) => {
  const props = useMergeProps<PopupProps, RequireType>(comProps, defaultProps);
  const { show, zIndex, overlay, lockScroll, duration, overlayStyle } = props;
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (show) {
      setIsShow(true);
    }
  }, [show]);

  const onMaskClick = () => {
    props.onClickOverlay?.();
    if (props.closeOnClickOverlay) {
      props.onClose?.();
    }
  };

  return (
    <>
      {overlay && (
        <Mask
          show={show}
          zIndex={zIndex ? zIndex - 1 : void 0}
          duration={duration}
          style={overlayStyle}
          lockScroll={lockScroll}
          onClose={() => onMaskClick()}
        />
      )}
      {isShow && <PopupInner setIsShow={setIsShow} {...props} />}
    </>
  );
};

export default Popup;
