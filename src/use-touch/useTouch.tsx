import { useRef } from 'react';
import { ITouchEvent } from '@tarojs/components';
import { MouseTouchE } from '../utils/handleDom';
const MIN_DISTANCE = 10;

export type TouchDirection = '' | 'vertical' | 'horizontal';
export type TouchState = {
  /** x的起始的位置 */
  startX: number;
  /** y的起始的位置 */
  startY: number;
  /** x的偏移量 */
  deltaX: number;
  /** y的偏移量 */
  deltaY: number;
  /** x的位移 正数 */
  offsetX: number;
  /** y的位移 正数 */
  offsetY: number;
  /** 当前移动的方向 */
  direction: TouchDirection;
  /** 触摸开始到结束的时间 */
  time: number;
  /** 起始的由始至终的x值 */
  preX: number;
  /** 起始的由始至终的y值 */
  preY: number;
  /** 由始至终的x值 */
  x: number;
  /** 由始至终的y值 */
  y: number;
};

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
  const state = useRef<TouchState>({
    preX: 0,
    preY: 0,
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    offsetX: 0,
    offsetY: 0,
    direction: '',
    time: 0,
  });
  /** 触摸开始时间 */
  const startTime = useRef(0);

  const setState = (options: Partial<TouchState>) => {
    Object.keys(options).forEach((key) => {
      state.current[key] = options[key];
    });
  };

  const reset = () => {
    setState({
      deltaX: 0,
      deltaY: 0,
      offsetX: 0,
      offsetY: 0,
      direction: '',
    });
  };

  const changeEvent = (event: ITouchEvent | MouseTouchE) => {
    // changedTouches 是 touchEnd 的值
    return (
      (event as ITouchEvent)?.touches?.[0] ??
      (event as ITouchEvent)?.changedTouches?.[0] ??
      (event as MouseTouchE)
    );
  };

  const start = (event: ITouchEvent | MouseTouchE) => {
    reset();
    const touch = changeEvent(event);
    setState({
      startX: touch.clientX,
      startY: touch.clientY,
      preX: state.current.x,
      preY: state.current.y,
    });
    startTime.current = Date.now();
  };

  const move = (event: ITouchEvent | MouseTouchE) => {
    const touch = changeEvent(event);
    // Fix: Safari back will set clientX to negative number
    const { preX, preY, startX, startY, direction } = state.current;
    const deltaX = touch.clientX < 0 ? 0 : touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const offsetX = Math.abs(deltaX);
    const offsetY = Math.abs(deltaY);
    const time = Date.now() - startTime.current;

    setState({
      x: preX + deltaX,
      y: preY + deltaY,
      deltaX,
      deltaY,
      offsetX,
      offsetY,
      time,
      direction: !direction ? getDirection(offsetX, offsetY) : '',
    });
  };

  return {
    info: state.current,
    move,
    start,
    reset,
  };
};

export default useTouch;
