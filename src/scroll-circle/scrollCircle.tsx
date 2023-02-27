import { View } from '@tarojs/components';
import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import getEleInfo from '../utils/getEleInfo';
import { getLineAngle } from '../utils/handleCircle';
import Taro, { nextTick } from '@tarojs/taro';
import { randomStr } from '../utils/random';
import { classBem, getScreenInfo, isMobile, screenH, screenW } from '../utils/handleDom';
import useTouchEvent from '../use-touch-event';
import useDebounce from '../use-debounce';
import { CircleInfoType, CircleTouchType, ScrollCircleProps, ScrollRotateItemType } from './type';

const classPrefix = 'retaroct-scroll-circle';

const ScrollCircleCtx = React.createContext({
  circleR: 0,
  cardDeg: 0,
  isVertical: false,
  isClockwise: false,
  isClick: false,
});

export const ScrollCircle: React.FC<ScrollCircleProps> = ({
  list,
  cardAddDeg = 1,
  width = '100%',
  height = '100%',
  initCartNum = 0,
  isAverage = true,
  isClockwise = true,
  leftArrow,
  rightArrow,
  children,
  onPageChange,
  ...props
}) => {
  const idRef = useRef(randomStr(classPrefix));
  /** 滚动盒子需要的信息 */
  const info = useRef<CircleInfoType>({
    circleWrapWH: 0,
    cardWH: 0,
    circleR: 0,
    scrollViewDeg: 0,
  });
  /** 触摸信息 */
  const touchInfo = useRef<CircleTouchType>({
    startDeg: 0,
    isClick: false,
  });
  /** 卡片间的度数 */
  const cardDeg = useRef(0);
  /** 旋转的度数 */
  const [rotateDeg, setRotateDeg] = useState<number>(-1);
  /** 当前的方向是否是竖着的 */
  const isVertical = useRef(getScreenInfo().screenH > getScreenInfo().screenW);
  const [pageState, setPageState] = useState({
    /** 当前的页码 */
    pageNum: 1,
    /** 每页条数 */
    pageSize: 10,
  });
  const [duration, setDuration] = useState(0.6);

  const init = async () => {
    getScreenInfo();
    isVertical.current = screenH > screenW;
    let cWrap = { width: 0, height: 0 };
    let cInfo = { width: 0, height: 0 };
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      const circleWrap = document.querySelector(`.${idRef.current}`);
      const cardInfo = document.querySelector(`.${idRef.current} .${classPrefix}-cardWrap`);
      cWrap.width = circleWrap?.clientWidth ?? 0;
      cWrap.height = circleWrap?.clientHeight ?? 0;
      cInfo.width = cardInfo?.clientWidth ?? 0;
      cInfo.height = cardInfo?.clientHeight ?? 0;
    } else {
      const res = await Promise.all([
        getEleInfo(`.${idRef.current}`),
        getEleInfo(`.${idRef.current} .${classPrefix}-cardWrap`),
      ]);
      cWrap = res[0] as { width: number; height: number };
      cInfo = res[1] as { width: number; height: number };
    }
    info.current.circleWrapWH = cWrap?.[isVertical.current ? 'height' : 'width'] ?? 0;
    info.current.cardWH = cInfo?.[isVertical.current ? 'height' : 'width'] ?? 0;
    const cWH = cInfo?.[isVertical.current ? 'width' : 'height'] ?? 0;
    info.current.circleR = Math.round(isVertical.current ? screenH : screenW);
    // 屏幕宽高度对应的圆的角度
    info.current.scrollViewDeg = getLineAngle(info.current.circleWrapWH, info.current.circleR);
    // 每张卡片所占用的角度
    const _cardDeg =
      (2 * 180 * Math.atan((info.current.cardWH ?? 0) / 2 / (info.current.circleR - cWH / 2))) /
        Math.PI +
      cardAddDeg;
    let { pageNum, pageSize } = pageState;
    // 是否采用均分卡片的方式
    if (isAverage && list) {
      const cardNum = Math.floor(360 / _cardDeg);
      // 判断总卡片数是否超过一个圆
      const _cardNum = Math.min(cardNum, list.length);
      pageSize = _cardNum;
      setPageState((p) => ({ ...p, pageSize }));
      cardDeg.current = 360 / _cardNum;
    } else {
      cardDeg.current = _cardDeg;
    }
    const text = isVertical.current ? '高' : '宽';
    console.log(
      `可滚动区域${text}度: ${info.current.circleWrapWH}px\n` +
        `可滚动区域占的度数: ${info.current.scrollViewDeg}°\n` +
        `卡片${text}度: ${info.current.cardWH}px\n` +
        `圆的半径: ${info.current.circleR}px\n` +
        `卡片间的角度: ${cardDeg.current}°`,
    );
    onPageChange?.({ pageNum, pageSize });
    setRotateDeg(cardDeg.current * initCartNum);
  };

  const resizeFn = useDebounce(() => {
    init();
  }, 300);
  useEffect(() => {
    const isPc = !isMobile();
    if (isPc) window.addEventListener('resize', resizeFn);
    return () => {
      if (isPc) window.removeEventListener('resize', resizeFn);
    };
  }, []);

  useEffect(() => {
    /** 获取card的信息 */
    if (list?.length) {
      nextTick(() => {
        init();
      });
    }
  }, [list, cardAddDeg]);

  const { info: tInfo, onTouchFn } = useTouchEvent({
    onTouchStart() {
      touchInfo.current.startDeg = rotateDeg;
      setDuration(0.1);
      props.onTouchStart?.();
    },
    onTouchMove() {
      const xy = isVertical.current ? tInfo.deltaY : -tInfo.deltaX;
      const deg = Math.round(
        touchInfo.current.startDeg - info.current.scrollViewDeg * (xy / info.current.circleWrapWH),
      );
      setRotateDeg(deg);
      props.onTouchMove?.();
    },
    onTouchEnd() {
      const { startDeg } = touchInfo.current;
      // 移动的距离
      const xy = isVertical.current ? tInfo.deltaY : -tInfo.deltaX;
      let _duration = 0.6;
      let deg = rotateDeg;
      // 触摸的始末距离大于卡片高度的一半，并且触摸时间小于300ms，则触摸距离和时间旋转更多
      if (Math.abs(xy) > info.current.cardWH / 2 && tInfo.time < 300) {
        // 增加角度变化
        const v = tInfo.time / 300;
        const changeDeg = (info.current.scrollViewDeg * (xy / info.current.circleWrapWH)) / v;
        _duration = 1;
        deg = Math.round(startDeg - changeDeg);
      }
      // 处理转动的角度为：卡片的角度的倍数 (xy > 0 表示向上滑动)
      let mathMethods: 'ceil' | 'floor' = 'ceil';
      if (Math.abs(xy) < info.current.cardWH / 3) {
        mathMethods = xy > 0 ? 'ceil' : 'floor';
      } else {
        mathMethods = xy > 0 ? 'floor' : 'ceil';
      }
      // 触摸时间小于100 则视为是点击
      touchInfo.current.isClick = tInfo.time < 150;
      setDuration(_duration);
      const _deg = cardDeg.current * Math[mathMethods](deg / cardDeg.current);
      setRotateDeg(_deg);
      props.onTouchEnd?.();
    },
  });

  const disableRight = pageState.pageNum * pageState.pageSize >= (list?.length ?? 0);
  const disableLeft = pageState.pageNum <= 1;

  const onPageChangeFn = (isAdd?: boolean) => {
    if (isAdd) {
      if (disableRight) return;
    } else {
      if (disableLeft) return;
    }
    pageState.pageNum += isAdd ? 1 : -1;
    setRotateDeg(0);
    onPageChange?.({ ...pageState });
  };

  const circleStyle = useMemo(() => {
    let w = 0,
      h = screenH / 2;
    if (isVertical.current) {
      w = screenW / 2;
      h = 0;
    }
    return {
      width: `${info.current.circleR * 2}px`,
      height: `${info.current.circleR * 2}px`,
      transitionDuration: duration + 's',
      transform: `translate(calc(-50% + ${w}px), calc(-50% + ${h}px)) rotate(${rotateDeg}deg)`,
    };
  }, [rotateDeg, duration]);

  return (
    <ScrollCircleCtx.Provider
      value={{
        circleR: info.current.circleR,
        cardDeg: cardDeg.current,
        isVertical: isVertical.current,
        isClockwise,
        isClick: touchInfo.current.isClick,
      }}
    >
      <View
        className={`${classPrefix} ${idRef.current}`}
        style={{
          width: isVertical.current ? `${info.current.circleR * 2}px` : width,
          height: isVertical.current ? height : `${info.current.circleR * 2}px`,
        }}
      >
        <View className={`${classPrefix}-area`} style={circleStyle} {...onTouchFn}>
          {children}
        </View>
        <View
          className={`${classBem(`${classPrefix}-arrow`, { left: true, disable: disableLeft })}`}
          onClick={() => onPageChangeFn()}
        >
          {leftArrow ?? (
            <View className={`${classBem(`${classPrefix}-arrow-area`, { left: true })}`}>
              {'<'}
            </View>
          )}
        </View>
        <View
          className={`${classBem(`${classPrefix}-arrow`, { right: true, disable: disableRight })}`}
          onClick={() => onPageChangeFn(true)}
        >
          {rightArrow ?? (
            <View className={`${classBem(`${classPrefix}-arrow-area`, { right: true })}`}>
              {'>'}
            </View>
          )}
        </View>
      </View>
    </ScrollCircleCtx.Provider>
  );
};

/** item */
export const ScrollRotateItem: React.FC<ScrollRotateItemType> = ({ index, onClick, children }) => {
  const { circleR, cardDeg, isVertical, isClockwise, isClick } = useContext(ScrollCircleCtx);

  const cardStyle = useMemo(() => {
    const initDeg = isVertical ? 90 : 0;
    const deg = initDeg + cardDeg * index;
    let n = isClockwise ? -1 : 1;
    n *= isVertical ? -1 : 1;
    const top = circleR * (1 - Math.cos((deg * Math.PI) / 180));
    const left = circleR * (1 - n * Math.sin((deg * Math.PI) / 180));
    const rotate = initDeg - n * deg;
    return {
      top: `${top}px`,
      left: `${left}px`,
      transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
    };
  }, [circleR, cardDeg, isVertical, isClockwise]);

  return (
    <View
      className={`${classPrefix}-cardWrap`}
      style={cardStyle}
      onClick={() => {
        isClick && onClick?.(index);
      }}
    >
      {children}
    </View>
  );
};
