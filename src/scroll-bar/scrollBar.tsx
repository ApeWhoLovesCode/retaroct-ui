import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import {
  forwardRef,
  useState,
  useEffect,
  useMemo,
  ReactElement,
  useImperativeHandle,
  useRef,
} from 'react';
import getEleInfo from '../utils/getEleInfo';
import { randomStr } from '../utils/random';
import React from 'react';
import { handleStylePx } from '../utils/handleDom';
import classNames from 'classnames';
import { ScrollBarInstance, ScrollBarPropsType } from './type';

const classPrefix = 'retaroct-scroll-bar';

type AnimationData = {
  actions: object[];
};

export default forwardRef<ScrollBarInstance, ScrollBarPropsType>(
  ({ title, speed = 50, space = 50, color = '#000', className }, ref) => {
    const [barElemId] = useState(`b_${randomStr(classPrefix)}`);
    const [animElemId] = useState(`a_${randomStr(classPrefix)}`);
    const [itemElemId] = useState(`i_${randomStr(classPrefix)}`);
    // 需要渲染的滚动元素个数
    const [eleNum, setEleNum] = useState<number>(1);
    const timer = useRef<NodeJS.Timer>();

    const [animationData, setAnimationData] = useState<AnimationData>({
      actions: [{}],
    });

    /** 渲染dom并开启动画 */
    const renderDom = () => {
      Promise.all([
        getEleInfo(`#${barElemId}`),
        getEleInfo(`#${animElemId}`),
        getEleInfo(`#${itemElemId}`),
      ]).then(([scrollEle, animEle, itemEle]) => {
        const scrollW = scrollEle?.width,
          animElemW = animEle?.width,
          itemW = itemEle?.width;
        if (!itemW || !scrollW || !animElemW) {
          return;
        }
        // 需要渲染的滚动元素个数（需要大于 滚动文字 + 外部滚动区域宽度)
        const n = Math.min(Math.ceil((scrollW + itemW) / itemW), 20);
        setEleNum(n);
        const duration = Math.ceil((scrollW / speed) * 1000);
        const _animation = Taro.createAnimation({
          duration: duration,
          timingFunction: 'linear',
        });
        const resetAnimation = Taro.createAnimation({
          duration: 0,
          timingFunction: 'linear',
        });
        /** 重置并开启动画 */
        const animationRun = () => {
          resetAnimation.translateX(0).step();
          setAnimationData(resetAnimation.export());
          // 当 setTimeout间隔时间为10时，这里可能会有 setAnimationData 还没触发完就执行到setTimeout的情况
          setTimeout(() => {
            _animation.translateX(-itemW).step();
            setAnimationData(_animation.export());
          }, 15);
        };
        animationRun();
        clearInterval(timer.current);
        timer.current = setInterval(animationRun, duration + 15);
      });
    };

    /** 取消滚动 */
    const cancelScroll = () => {
      clearInterval(timer.current);
    };

    useImperativeHandle(ref, () => ({
      renderDom,
      cancelScroll,
    }));

    useEffect(() => {
      setTimeout(() => {
        renderDom();
      }, 10);
      return () => {
        clearInterval(timer.current);
      };
    }, [speed]);

    // 滚动的元素
    const RenderItem = () => {
      return (
        <View
          id={itemElemId}
          className={`${classPrefix}-item`}
          style={{ paddingRight: handleStylePx(space), color: color }}
        >
          {title}
        </View>
      );
    };

    // 渲染滚动元素的列表
    const renderList = useMemo(
      () => () => {
        const arr: ReactElement[] = [];
        for (let i = 0; i < eleNum; i++) {
          arr.push(<RenderItem key={i} />);
        }
        return arr;
      },
      [eleNum, space, color],
    );

    return (
      <View id={barElemId} className={`${classPrefix} ${classNames(className)}`}>
        <View id={animElemId} className={`${classPrefix}-itemWrap`} animation={animationData}>
          {renderList()}
        </View>
      </View>
    );
  },
);
