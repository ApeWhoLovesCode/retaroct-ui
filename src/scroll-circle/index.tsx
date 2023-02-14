import { View } from '@tarojs/components';
import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import './index.less';
import getEleInfo from '../utils/getEleInfo';
import { getLineAngle } from '../utils/handleCircle';
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component';
import { nextTick } from '@tarojs/taro';
import { randomStr } from '../utils/random';
import { getScreenInfo, screenH, screenW } from '../utils/handleDom';
import useTouchEvent from '../use-touch-event';
import useDebounce from '../use-debounce';

const classPrefix = 'retaroct-scroll-circle';

export type ScrollCircleProps = {
  /** 传入卡片的数组 */
  list: any[];
  /**
   * 滚动列表的高度
   * @default 100%
   */
  height?: string;
  /**
   * 卡片间增加的角度
   * @default 1
   */
  cardAddDeg?: number;
  /**
   * 索引为多少的卡片位于中间区域 从0开始算
   * @default 3
   */
  initCartNum?: number;
  /**
   * 卡片是否平均分配圆形轨迹
   * @default true
   */
  isAverage?: boolean;
  /** 分页完成，触发回调改变页码 */
  onPageChange?: (page: { pageNum: number; pageSize: number }) => void;
};

const ScrollCircleCtx = React.createContext({
  circleR: 0,
  cardDeg: 0,
  isVertical: false,
});

export const ScrollCircle: React.FC<ScrollCircleProps> = ({
  list,
  cardAddDeg = 1,
  height = '100%',
  initCartNum = 3,
  isAverage = true,
  children,
  onPageChange,
}) => {
  const idRef = useRef(randomStr(classPrefix));
  /** 滚动盒子需要的信息 */
  const info = useRef<CircleInfoType>({
    circleWrapHeight: 0,
    cardH: 0,
    circleR: 0,
    scrollViewDeg: 0,
  });
  /** 触摸信息 */
  const touchInfo = useRef<CircleTouchType>({
    startDeg: 0,
  });
  /** 卡片间的度数 */
  const cardDeg = useRef(0);
  /** 旋转的度数 */
  const [rotateDeg, setRotateDeg] = useState<number>(0);
  /** 当前的方向是否是竖着的 */
  const isVertical = useRef(true);
  const [pageState, setPageState] = useState({
    /** 当前的页码 */
    pageNum: 1,
    /** 每页条数 */
    pageSize: 10,
  });

  const init = async (isInit = false) => {
    Promise.all([
      getEleInfo(`.${idRef.current}`),
      getEleInfo(`.${idRef.current} .${classPrefix}-cardWrap`),
    ]).then(([cWrap, cInfo]) => {
      getScreenInfo();
      info.current.circleWrapHeight = cWrap?.height ?? 0;
      info.current.cardH = cInfo?.height ?? 0;
      const cW = cInfo?.width ?? 0;
      isVertical.current = screenH > screenW;
      info.current.circleR = Math.round(isVertical ? screenH : screenW);
      // 卡片间的角度
      const _cardDeg =
        (2 * 180 * Math.atan((info.current.cardH ?? 0) / 2 / (info.current.circleR - cW / 2))) /
          Math.PI +
        cardAddDeg;
      let { pageNum, pageSize } = pageState;
      // 是否采用均分卡片的方式
      if (isAverage && list) {
        const cardNum = 360 / _cardDeg;
        let _cardNum = list.length;
        // 总卡片超过一个圆
        if (_cardNum > cardNum) {
          _cardNum = Math.floor(cardNum);
          pageSize = _cardNum;
          setPageState((p) => ({ ...p, pageSize }));
        }
        cardDeg.current = 360 / _cardNum;
      } else {
        cardDeg.current = _cardDeg;
      }
      // 屏幕高度对应的圆的角度
      info.current.scrollViewDeg = getLineAngle(
        info.current.circleWrapHeight,
        info.current.circleR,
      );
      // console.log(
      //   `可滚动区域高度: ${info.current.circleWrapHeight};\n卡片高度: ${info.current.cardH};\n圆的半径: ${info.current.circleR};\n卡片间的角度: ${cardDeg.current}度;\n可滚动区域占的度数: ${info.current.scrollViewDeg}度;`,
      // );
      onPageChange?.({ pageNum, pageSize });
      setRotateDeg(cardDeg.current * initCartNum);
    });
  };

  const resizeFn = useDebounce(() => {
    init();
  }, 300);
  useEffect(() => {
    if (window) window.addEventListener('resize', resizeFn);
    return () => {
      if (window) window.removeEventListener('resize', resizeFn);
    };
  }, []);

  useEffect(() => {
    /** 获取card的信息 */
    if (list?.length) {
      nextTick(() => {
        init(true);
      });
    }
  }, [list, cardAddDeg]);

  const { info: tInfo, onTouchFn } = useTouchEvent({
    onTouchStart() {
      touchInfo.current.startDeg = rotateDeg;
    },
    onTouchMove() {
      const xy = isVertical.current ? tInfo.deltaY : -tInfo.deltaX;
      const deg = Math.round(
        touchInfo.current.startDeg -
          info.current.scrollViewDeg * (xy / info.current.circleWrapHeight),
      );
      setRotateDeg(deg);
    },
    onTouchEnd() {
      const { startDeg } = touchInfo.current;
      // 移动的距离
      const xy = isVertical.current ? tInfo.deltaY : -tInfo.deltaX;
      // 触摸的时间
      const _time = Date.now() - tInfo.time;
      let deg = rotateDeg;
      // 触摸的始末距离大于卡片高度的一半，并且触摸时间小于300ms，则触摸距离和时间旋转更多
      if (Math.abs(xy) > info.current.cardH / 2 && _time < 300) {
        // 增加角度变化
        const v = _time / 300;
        const changeDeg = (info.current.scrollViewDeg * (xy / info.current.circleWrapHeight)) / v;
        deg = Math.round(startDeg - changeDeg);
      }
      // 处理转动的角度为：卡片的角度的倍数 (xy > 0 表示向上滑动)
      let mathMethods: 'ceil' | 'floor' = 'ceil';
      if (Math.abs(xy) < info.current.cardH / 3) {
        mathMethods = xy > 0 ? 'ceil' : 'floor';
      } else {
        mathMethods = xy > 0 ? 'floor' : 'ceil';
      }
      const _deg = cardDeg.current * Math[mathMethods](deg / cardDeg.current);
      setRotateDeg(_deg);
    },
  });

  const circleStyle = useMemo(() => {
    let x = '-100%',
      y = '0';
    if (isVertical.current) {
      x = '-50%';
      y = '-50%';
    }
    return {
      width: `${info.current.circleR * 2}px`,
      height: `${info.current.circleR * 2}px`,
      transform: `translate(calc(${x} + ${window.innerWidth / 2}px), ${y}) rotate(${rotateDeg}deg)`,
    };
  }, [rotateDeg]);

  return (
    <ScrollCircleCtx.Provider
      value={{
        circleR: info.current.circleR,
        cardDeg: cardDeg.current,
        isVertical: isVertical.current,
      }}
    >
      <View
        className={`${classPrefix} ${idRef.current}`}
        style={{
          width: `${info.current.circleR * 2}px`,
          height: height,
        }}
      >
        <View className={`${classPrefix}-area`} style={circleStyle} {...onTouchFn}>
          {children}
        </View>
      </View>
    </ScrollCircleCtx.Provider>
  );
};

type ScrollRotateItemType = {
  /** 当前item的索引 */
  index: number;
};
/** item */
const ScrollRotateItem: React.FC<ScrollRotateItemType> = ({ index, children }) => {
  const { circleR, cardDeg, isVertical } = useContext(ScrollCircleCtx);

  const cardStyle = useMemo(() => {
    const deg = (isVertical ? 90 : 0) + cardDeg * index;
    const top = circleR * (1 - Math.cos((deg * Math.PI) / 180));
    const left = circleR * (1 - Math.sin((deg * Math.PI) / 180));
    const rotate = 90 - deg;
    // console.log(top, left, rotate);
    return {
      top: `${top}px`,
      left: `${left}px`,
      transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
    };
  }, [circleR, cardDeg, isVertical]);

  return (
    <View className={`${classPrefix}-cardWrap`} style={cardStyle}>
      {children}
    </View>
  );
};

export default attachPropertiesToComponent(ScrollCircle, { Item: ScrollRotateItem });

type CircleInfoType = {
  /** 滚动盒子的高度 (不是可滚动元素的总高度) */
  circleWrapHeight: number;
  /** 卡片高度 */
  cardH: number;
  /** 圆的半径 */
  circleR: number;
  /** 可滚动区域高度对应的圆的角度 */
  scrollViewDeg: number;
};

type CircleTouchType = {
  /** 记录滚动触摸的旋转度数 */
  startDeg: number;
};
