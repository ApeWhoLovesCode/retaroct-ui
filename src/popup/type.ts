import { CSSProperties, ReactNode } from 'react';
import { TransitionType } from '../use-transition';
import { NativeProps } from '../utils/native-props';

export type PopupCloseIconPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type PopupPosition = 'center' | 'top' | 'bottom' | 'right' | 'left';

/** 弹出层Props */
export type PopupProps = {
  /** 是否显示圆角 */
  round?: boolean;
  /** 是否显示关闭图标 */
  closeable?: boolean;
  /** 弹出层的层级 */
  zIndex?: number;
  /**
   *是否显示遮罩层
   * @default true
   */
  overlay?: boolean;
  /** 自定义遮罩层样式 */
  overlayStyle?: CSSProperties & Partial<Record<string, string>>;
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
