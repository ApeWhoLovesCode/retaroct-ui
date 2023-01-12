import { View, Image, ITouchEvent } from '@tarojs/components';
import React, { useState, useEffect, ReactNode, CSSProperties, useCallback, useMemo } from 'react';
import './index.less';
import { NativeProps, withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import useTransition, { TransitionDuration, TransitionType } from '../use-transition';
import { letterUpperTolower } from '../utils/format';
import Transition from '../transition';

const classPrefix = `retaroct-popup`;

export type PopupCloseIconPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type PopupPosition = 'center' | 'top' | 'bottom' | 'right' | 'left';

export type PopupProps = {
  /** 是否显示圆角 */
  round?: boolean;
  /** 是否显示关闭图标 */
  closeable?: boolean;
  /** 自定义遮罩层样式 */
  overlayStyle?: string | CSSProperties;
  /** 执行 */
  transition?: string;
  /** 弹出层的层级 */
  zIndex?: number;
  /** 是否显示遮罩层 */
  overlay?: boolean;
  /** 关闭图标或图片链接 */
  closeIcon?: string;
  /** 关闭图标的位置 */
  closeIconPosition?: PopupCloseIconPosition;
  /**
   *是否在点击遮罩层后关闭
   * @default true
   */
  closeOnClickOverlay?: boolean;
  /**
   * 弹出位置
   * @default center
   */
  position?: PopupPosition;
  /** 是否为 iPhoneX 留出底部安全距离 */
  safeAreaInsetBottom?: boolean;
  /** 是否留出顶部安全距离（状态栏高度） */
  safeAreaInsetTop?: boolean;
  /** 是否锁定滚动 */
  lockScroll?: boolean;
  children?: ReactNode;
  /** 点击蒙层触发的方法 */
  onClickOverlay?: () => void;
  /** 蒙层关闭触发的方法 */
  onClose?: () => void;
} & TransitionType &
  NativeProps;

const defaultProps = {
  duration: 300,
  position: 'center',
  closeOnClickOverlay: true,
  safeAreaInsetBottom: true,
};
type RequireType = keyof typeof defaultProps;
type DefaultPropsType = Omit<typeof defaultProps, 'position'> & {
  position?: PopupPosition;
};

const PopupInner = (comProps: PopupProps & { setIsShow?: (v: boolean) => void }) => {
  const props = useMergeProps<PopupProps, RequireType>(comProps, defaultProps as DefaultPropsType);
  const {
    show,
    position,
    transition,
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
      comProps.setIsShow?.(false);
    }, 0);
  };

  const { inited, currentDuration, classes, display, onTransitionEnd } = useTransition({
    show,
    duration: transition === 'none' ? 0 : duration,
    name: transition || position,
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
    return closeIconPosition || obj[position] || '';
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

export type MaskProps = {
  show?: boolean;
  lockScroll?: boolean;
  zIndex?: number;
  duration?: string | number | TransitionDuration;
  onClose?: () => void;
} & NativeProps;
const Mask = (props: MaskProps) => {
  const { show, zIndex, lockScroll, duration, onClose, ...ret } = props;

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
        className={`${classPrefix}-mask`}
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
      />,
    )
  ) : (
    <></>
  );
};

const Popup = (props: PopupProps) => {
  const { show, zIndex, overlay = true, lockScroll = true, duration = 300, overlayStyle } = props;
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (show) {
      setIsShow(true);
    }
  }, [show]);

  return (
    <>
      {isShow && <PopupInner setIsShow={setIsShow} {...props} />}
      {overlay && (
        <Mask
          show={show}
          zIndex={zIndex}
          duration={duration}
          style={overlayStyle}
          lockScroll={lockScroll}
          onClose={() => props.onClose?.()}
        />
      )}
    </>
  );
};

export default Popup;
