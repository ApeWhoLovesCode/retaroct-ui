import { ReactElement } from 'react';

export type ScrollBarPropsType = {
  /** 滚动的内容 */
  title: string | ReactElement;
  /**
   * 滚动速度
   * @default 50
   */
  speed?: number;
  /**
   * 每段文字间的间距
   * @default 50
   */
  space?: number | string;
  /**
   * 文字的颜色
   * @default '#000'
   */
  color?: string;
  className?: string;
};

export type ScrollBarInstance = {
  /** 重新获取dom并开启动画 */
  renderDom: () => void;
  /** 取消滚动 */
  cancelScroll: () => void;
};
