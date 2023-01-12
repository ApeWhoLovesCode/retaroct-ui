import { isObj } from '../utils/validate';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const getClassNames = (name: string) => ({
  enter: `retaroct-${name}-enter retaroct-${name}-enter-active enter-class enter-active-class`,
  'enter-to': `retaroct-${name}-enter-to retaroct-${name}-enter-active enter-to-class enter-active-class`,
  leave: `retaroct-${name}-leave retaroct-${name}-leave-active leave-class leave-active-class`,
  'leave-to': `retaroct-${name}-leave-to retaroct-${name}-leave-active leave-to-class leave-active-class`,
});

type DurationObj = { enter: string | number; leave: string | number };

export type TransitionType = {
  /** 是否展示 */
  show?: boolean;
  /** 动画持续时间 */
  duration?: string | number | DurationObj;
  /** 动画的名称 */
  name?: string;
  /** 开启动画前触发 */
  onBeforeEnter?: () => void;
  /** 关闭动画前触发 */
  onBeforeLeave?: () => void;
  /** 开启动画后触发 */
  onAfterEnter?: () => void;
  /** 关闭动画后触发 */
  onAfterLeave?: () => void;
  /** 开启动画触发 */
  onEnter?: () => void;
  /** 关闭动画触发 */
  onLeave?: () => void;
  /** 动画的类名 */
  enterClass?: string;
  enterActiveClass?: string;
  enterToClass?: string;
  leaveClass?: string;
  leaveActiveClass?: string;
  leaveToClass?: string;
};

export default function useTransition({
  show = false,
  duration = 300,
  name = 'fade',
  enterClass,
  enterActiveClass,
  enterToClass,
  leaveClass,
  leaveActiveClass,
  leaveToClass,
  ...props
}: TransitionType) {
  const transitionEnded = useRef(false);
  const status = useRef('');
  const [display, setDisplay] = useState(false);
  const [inited, setInited] = useState(false);
  const [currentDuration, setCurrentDuration] = useState<string | number | DurationObj>(0);
  const [classes, setClasses] = useState('');

  const classNames = useMemo(() => {
    const names = getClassNames(name);
    if (!name) {
      names['enter'] += ` ${enterClass ?? ''}`;
      names['enter-to'] += `${enterToClass ?? ''} ${enterActiveClass ?? ''} `;
      names['leave'] += `  ${leaveClass ?? ''}`;
      names['leave-to'] += ` ${leaveToClass ?? ''} ${leaveActiveClass ?? ''}`;
    }
    return names;
  }, [
    enterActiveClass,
    enterClass,
    enterToClass,
    leaveActiveClass,
    leaveClass,
    leaveToClass,
    name,
  ]);

  /** 动画结束 */
  const onTransitionEnd = () => {
    if (transitionEnded.current) return;
    transitionEnded.current = true;
    if (status.current === 'enter') {
      props.onAfterEnter?.();
    } else {
      props.onAfterLeave?.();
    }
    if (!show && display) {
      setDisplay(false);
    }
  };

  const transitionFn = useCallback(
    (isShow: boolean) => {
      const key = isShow ? 'enter' : 'leave';
      const curDuration = isObj(duration) ? (duration as DurationObj)[key] : (duration as number);
      status.current = key;
      props[isShow ? 'onBeforeEnter' : 'onBeforeLeave']?.();
      requestAnimationFrame(() => {
        if (status.current !== key) {
          return;
        }
        props[isShow ? 'onEnter' : 'onLeave']?.();
        if (isShow) {
          setInited(true);
          setDisplay(true);
        }
        setClasses(classNames[key]);
        setCurrentDuration(curDuration);
        requestAnimationFrame(() => {
          if (status.current !== key) {
            return;
          }
          transitionEnded.current = false;
          setTimeout(() => onTransitionEnd(), +curDuration);
          setClasses(classNames[`${key}-to`]);
        });
      });
    },
    [classNames, display, duration, onTransitionEnd],
  );

  /** 显示动画 */
  const onShowFn = () => {
    transitionFn(true);
  };

  /** 隐藏动画 */
  const onHideFn = () => {
    if (!display) {
      return;
    }
    transitionFn(false);
  };

  useEffect(() => {
    if (show && (!classes || !classes.includes(classNames['enter-to']))) {
      onShowFn();
    }
    if (!show) {
      onHideFn();
    }
  }, [show]);

  return {
    display,
    inited,
    currentDuration,
    classes,
    onTransitionEnd,
  };
}
