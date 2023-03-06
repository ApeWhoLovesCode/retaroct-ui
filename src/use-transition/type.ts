export type TransitionDuration = { enter: string | number; leave: string | number };

export type TransitionType = {
  /** 是否展示 */
  show?: boolean;
  /** 动画持续时间 */
  duration?: string | number | TransitionDuration;
  /** 动画的名称 */
  name?: string;
  /** 开启动画前的回调 */
  onBeforeEnter?: () => void;
  /** 关闭动画前的回调 */
  onBeforeLeave?: () => void;
  /** 开启动画后的回调 */
  onAfterEnter?: () => void;
  /** 关闭动画后的回调 */
  onAfterLeave?: () => void;
  /** 开启动画的回调 */
  onEnter?: () => void;
  /** 关闭动画的回调 */
  onLeave?: () => void;
  /** 动画的类名 */
  enterClass?: string;
  enterActiveClass?: string;
  enterToClass?: string;
  leaveClass?: string;
  leaveActiveClass?: string;
  leaveToClass?: string;
};
