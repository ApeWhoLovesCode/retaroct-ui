import { ReactElement, ReactNode } from 'react';

export type SliderPopProps = {
  /**
   * 弹出层的方向
   * @default left
   */
  direction?: 'left' | 'right';
  /** 弹出层中的内容 */
  popContent: string | ReactElement;
  /** 内容区域 */
  children: ReactNode;
  /** 内容区域的类名 */
  className?: string;
  /** 自定义弹出层区域的类名 建议用来携带宽度，默认为273px */
  popClassName?: string;
};

export type SliderPopInstance = {
  popShow: () => void;
  popHide: () => void;
};
