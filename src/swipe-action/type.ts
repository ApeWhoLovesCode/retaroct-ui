import { ITouchEvent } from '@tarojs/components';
import { ReactNode } from 'react';
import { NativeProps } from '../utils/native-props';

export type SwipeActionRef = {
  /** 让滑动条归位 */
  close: () => void;
  /** 滑动出操作按钮，side 参数默认为 right */
  show: (side?: 'left' | 'right') => void;
};

export type SwipeActionProps = {
  /** 左侧的操作按钮列表 */
  leftActions?: SwipeActionType[];
  /** 右侧的操作按钮列表 */
  rightActions?: SwipeActionType[];
  /** 是否在点击操作按钮时自动归位 */
  closeOnAction?: boolean;
  /**
   * 是否在操作其他滑块时自动归位
   * @default true
   */
  closeOnTouchOutside?: boolean;
  /** 点击操作按钮时触发 */
  onAction?: (action: SwipeActionType, e: ITouchEvent) => void;
  /** 按钮完全出现时触发 */
  onActionsReveal?: (side: 'left' | 'right') => void;
  children: ReactNode;
} & NativeProps<'--background'>;

export type SwipeActionType = {
  key: string;
  text: ReactNode;
  color?: string;
  onClick?: (e: ITouchEvent) => void;
};
