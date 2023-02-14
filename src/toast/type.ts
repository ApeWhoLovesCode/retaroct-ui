import { NativeProps } from '../utils/native-props';
import { ReactNode } from 'react';
import { LoadingType } from '../loading';

type _ToastProps = {
  /**
   * 弹出层的层级
   * @default 1000
   */
  zIndex?: number;
  /**
   * 展示时长(ms)，值为 0 时，toast 不会消失
   * @default 2000
   */
  duration?: number;
  /**
   * 是否有蒙层
   * @default false
   */
  mask?: boolean;
  /**
   * 是否禁止背景点击
   * @default false
   */
  forbidClick?: boolean;
  /**
   * 是否点击遮罩层关闭弹窗
   * @default false
   */
  maskClickClose?: boolean;
  /**
   * 提示类型
   * @default text
   */
  type?: ToastType;
  /**
   * 展示位置
   * @default middle
   */
  position?: ToastPosition;
  /** 内容 */
  message?: ReactNode;
  /** 自定义图标 */
  icon?: string;
  /**
   * 加载图标类型
   * @default circular
   */
  loadingType?: LoadingType;
  /** 关闭后的回调函数 */
  onClose?: () => void;
};

export type ToastProps = _ToastProps & NativeProps;

export type ToastState = Required<Omit<_ToastProps, 'onClose' | 'zIndex'>>;

export type ToastType = 'loading' | 'success' | 'fail' | 'text' | 'icon';
export type ToastPosition = 'top' | 'middle' | 'bottom';
