import { useRef } from 'react';
import { ITouchEvent } from '@tarojs/components';
import { MouseTouchE } from '../utils/handleDom';
const MIN_DISTANCE = 10;

type Direction = '' | 'vertical' | 'horizontal';

function getDirection(x: number, y: number) {
  if (x > y && x > MIN_DISTANCE) {
    return 'horizontal';
  }
  if (y > x && y > MIN_DISTANCE) {
    return 'vertical';
  }
  return '';
}
const useTouch = () => {
  /** 起始的位置 */
  const startX = useRef(0);
  const startY = useRef(0);
  /** 偏移的值 */
  const deltaX = useRef(0);
  const deltaY = useRef(0);
  /** 位移的值 正数 */
  const offsetX = useRef(0);
  const offsetY = useRef(0);
  /** 当前移动的方向 */
  const direction = useRef<Direction>('');
  /** 触摸时间 */
  const startTime = useRef(0);
  const time = useRef(0);

  const reset = () => {
    deltaX.current = 0;
    deltaY.current = 0;
    offsetX.current = 0;
    offsetY.current = 0;
    direction.current = '';
  };

  const changeEvent = (event: ITouchEvent | MouseTouchE) => {
    return (
      (event as ITouchEvent)?.touches?.[0] ??
      (event as ITouchEvent)?.changedTouches?.[0] ??
      (event as MouseTouchE)
    );
  };

  const start = (event: ITouchEvent | MouseTouchE) => {
    reset();
    const touch = changeEvent(event);
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    startTime.current = Date.now();
  };

  const move = (event: ITouchEvent | MouseTouchE) => {
    // changedTouches 是 touchEnd 的值
    const touch = changeEvent(event);
    // Fix: Safari back will set clientX to negative number
    deltaX.current = touch.clientX < 0 ? 0 : touch.clientX - startX.current;
    deltaY.current = touch.clientY - startY.current;
    offsetX.current = Math.abs(deltaX.current);
    offsetY.current = Math.abs(deltaY.current);
    time.current = Date.now() - startTime.current;

    if (!direction.current) {
      direction.current = getDirection(offsetX.current, offsetY.current);
    }
  };

  const isVertical = () => direction.current === 'vertical';
  const isHorizontal = () => direction.current === 'horizontal';

  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    time,
    isVertical,
    isHorizontal,
  };
};

export default useTouch;
