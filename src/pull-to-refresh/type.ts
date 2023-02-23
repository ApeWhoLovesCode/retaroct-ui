import { ReactNode } from 'react';
import { LoadingType } from '../loading';
import { NativeProps } from '../utils/native-props';

export type PullStatus = 'normal' | 'pulling' | 'loosing' | 'loading' | 'complete';

export type PullToRefreshProps = {
  /**
   * 下来刷新区域的高度
   * @default 60
   */
  headHeight?: number;
  /**
   * 可下拉区域增加的值
   * @default ===headHeight
   */
  pullDistance?: number;
  /**
   * 动画时间 单位:ms
   * @default 300
   */
  animationDuration?: number;
  /** 下拉文字 */
  pullingText?: ReactNode;
  /** 释放文字 */
  loosingText?: ReactNode;
  /** 加载的 loading 的类型 */
  loadingType?: LoadingType;
  /** 加载的内容 */
  loadingText?: ReactNode;
  /** 加载完成的文字 */
  completeText?: ReactNode;
  /**
   * 加载完成文字的显示时间 单位:ms
   * @default 500
   */
  completeDuration?: number;
  /** 下拉渲染的内容，用来替代下拉的各种状态 */
  renderText?: (params: { status: PullStatus; distance: number }) => ReactNode;
  /** 下拉刷新时触发的异步方法 */
  onRefresh?: () => Promise<any>;
  /** 下拉刷新完成后触发 */
  onRefreshEnd?: () => void;
  children?: React.ReactNode;
} & NativeProps;
