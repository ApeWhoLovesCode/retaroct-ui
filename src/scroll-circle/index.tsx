import { View, ITouchEvent } from '@tarojs/components';
import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import './index.less';
import getEleInfo from '../utils/getEleInfo';
import { getLineAngle } from '../utils/handleCircle';
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component';
import { nextTick } from '@tarojs/taro';
import { randomStr } from '../utils/random';

const classPrefix = 'retaroct-scroll-circle';

let screenW = 0;
let screenH = 0;

export type ScrollCircleProps = {
  /** 传入卡片的数组 */
  list: any[];
  /** 滚动列表的高度 默认100% */
  height?: string;
  /** 卡片间增加的角度 默认是1 */
  cardAddDeg?: number;
  /** 索引为多少的卡片位于中间区域 从0开始算 默认是索引为3的 */
  initCartNum?: number;
};

const ScrollCircleCtx = React.createContext({
  circleR: 0,
  cardDeg: 0,
});

export const ScrollCircle: React.FC<ScrollCircleProps> = ({
  list,
  cardAddDeg = 1,
  height = '100%',
  initCartNum = 3,
  children,
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
    startY: 0,
    startDeg: 0,
    time: 0,
  });
  /** 卡片间的度数 */
  const cardDeg = useRef(0);
  /** 旋转的度数 */
  const [rotateDeg, setRotateDeg] = useState<number>(0);

  useEffect(() => {
    /** 获取card的信息 */
    const init = async () => {
      Promise.all([
        getEleInfo(`.${idRef.current}`),
        getEleInfo(`.${idRef.current} .${classPrefix}-cardWrap`),
      ]).then(([cWrap, cInfo]) => {
        info.current.circleWrapHeight = cWrap?.height ?? 0;
        screenW = Taro.getSystemInfoSync().screenWidth;
        screenH = Taro.getSystemInfoSync().screenHeight;
        info.current.cardH = cInfo?.height ?? 0;
        const cW = cInfo?.width ?? 0;
        info.current.circleR = Math.round(screenH);
        // 卡片间的角度
        cardDeg.current =
          (2 * 180 * Math.atan((info.current.cardH ?? 0) / 2 / (info.current.circleR - cW / 2))) /
            Math.PI +
          cardAddDeg;
        // 屏幕高度对应的圆的角度
        info.current.scrollViewDeg = getLineAngle(
          info.current.circleWrapHeight,
          info.current.circleR,
        );
        console.log(
          `可滚动区域高度: ${info.current.circleWrapHeight};\n卡片高度: ${info.current.cardH};\n圆的半径: ${info.current.circleR};\n卡片间的角度: ${cardDeg.current}度;\n可滚动区域占的度数: ${info.current.scrollViewDeg}度;`,
        );
        setRotateDeg(cardDeg.current * initCartNum);
      });
    };
    if (list?.length) {
      nextTick(() => {
        init();
      });
    }
  }, [list, cardAddDeg]);

  const onTouchStart = (e: ITouchEvent) => {
    touchInfo.current.startY = e.touches[0].clientY;
    touchInfo.current.startDeg = rotateDeg;
    touchInfo.current.time = Date.now();
  };
  const onTouchMove = (e: ITouchEvent) => {
    const y = e.touches[0].clientY - touchInfo.current.startY;
    const deg = Math.round(
      touchInfo.current.startDeg - info.current.scrollViewDeg * (y / info.current.circleWrapHeight),
    );
    setRotateDeg(deg);
  };
  const onTouchEnd = (e: ITouchEvent) => {
    const { startY, startDeg, time } = touchInfo.current;
    // 移动的距离
    const _y = e.changedTouches[0].clientY - startY;
    // 触摸的时间
    const _time = Date.now() - time;
    let deg = rotateDeg;
    // 触摸的始末距离大于卡片高度的一半，并且触摸时间小于300ms，则触摸距离和时间旋转更多
    if (Math.abs(_y) > info.current.cardH / 2 && _time < 300) {
      // 增加角度变化
      const v = _time / 300;
      const changeDeg = (info.current.scrollViewDeg * (_y / info.current.circleWrapHeight)) / v;
      deg = Math.round(startDeg - changeDeg);
    }
    // 处理转动的角度为：卡片的角度的倍数 (_y > 0 表示向上滑动)
    const _deg = cardDeg.current * Math[_y > 0 ? 'floor' : 'ceil'](deg / cardDeg.current);
    setRotateDeg(_deg);
  };

  return (
    <ScrollCircleCtx.Provider
      value={{
        circleR: info.current.circleR,
        cardDeg: cardDeg.current,
      }}
    >
      <View
        className={`${classPrefix} ${idRef.current}`}
        style={{
          width: `${info.current.circleR * 2}px`,
          height: height,
        }}
      >
        <View
          className={`${classPrefix}-area`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            width: `${info.current.circleR * 2}px`,
            height: `${info.current.circleR * 2}px`,
            transform: `translate(calc(-50% + ${screenW / 2}px), -50%) rotate(${rotateDeg}deg)`,
          }}
        >
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
  const { circleR, cardDeg } = useContext(ScrollCircleCtx);

  const cardStyle = useMemo(() => {
    const deg = 90 + cardDeg * index;
    const top = circleR * (1 - Math.cos((deg * Math.PI) / 180));
    const left = circleR * (1 - Math.sin((deg * Math.PI) / 180));
    const rotate = 90 - deg;
    // console.log(top, left, rotate);
    return {
      top: `${top}px`,
      left: `${left}px`,
      transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
    };
  }, [circleR, cardDeg]);

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
  /** 记录初始化触摸的y */
  startY: number;
  /** 记录滚动触摸的旋转度数 */
  startDeg: number;
  /** 记录触摸开始的时间，用于与触摸结束进行比较 */
  time: number;
};
