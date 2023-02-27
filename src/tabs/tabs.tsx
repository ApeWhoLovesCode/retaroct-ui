import React, { forwardRef, useImperativeHandle } from 'react';
import useRender from '../use-render';
import getEleInfo, { getAllEleInfo } from '../utils/getEleInfo';
import { withNativeProps } from '../utils/native-props';
import { traverseReactNode } from '../utils/traverse-react-node';
import { View, ScrollView } from '@tarojs/components';
import { nextTick } from '@tarojs/taro';
import classNames from 'classnames';
import { FC, useState, useEffect, useRef, ReactElement, ComponentProps } from 'react';
import { randomStr } from '../utils/random';
import { getScreenInfo, screenW } from '../utils/handleDom';
import { TabProps, TabsInstance, TabsProps } from './type';

const classPrefix = `retaroct-tabs`;

type TabsRefType = {
  /** tabs 的总宽度 除以2 */
  width: number;
  /** 每个 tab 的宽度和左边距离的数组 */
  tabList: TabItemType[];
};
type TabItemType = {
  width: number;
  left: number;
};

export const Tab: FC<TabProps> = () => {
  return null;
};

export const Tabs = forwardRef<TabsInstance, TabsProps>(
  (
    {
      list,
      activeIndex = 0,
      activeTextClass,
      activeLine,
      isAnimate = true,
      onChange,
      children,
      ...ret
    },
    ref,
  ) => {
    const idRef = useRef(randomStr(classPrefix));
    const [curI, setCurI] = useState<number>(activeIndex);
    const tabsRef = useRef<TabsRefType>({
      width: 0,
      tabList: [],
    });
    const [isLineShow, setIsLineShow] = useState(false);
    const { renderFn } = useRender();

    const panes: ReactElement<ComponentProps<typeof Tab>>[] = [];

    traverseReactNode(children, (child) => {
      if (!React.isValidElement(child)) return;
      const key = child.key;
      if (typeof key !== 'string') return;
      panes.push(child as unknown as ReactElement<ComponentProps<typeof Tab>>);
    });

    const toLeft = useRef({
      left: 0,
      preLeft: 0,
    });
    /** 向右滚动屏幕的宽度 */
    const scrollTo = (newLeft = 9999) => {
      const preLeft = toLeft.current.preLeft;
      toLeft.current.left = newLeft === preLeft ? newLeft + 1 : newLeft;
      toLeft.current.preLeft = toLeft.current.left;
      renderFn();
    };
    useImperativeHandle(ref, () => ({
      scrollTo,
    }));

    useEffect(() => {
      const init = () => {
        Promise.all([
          getEleInfo(`.${idRef.current}`),
          getAllEleInfo(`.${idRef.current} .${classPrefix}-tabWrap`),
          getEleInfo(`.${idRef.current} .${classPrefix}-scrollView`),
        ]).then(([tabs, tabWrapEles, tabsInfo]) => {
          getScreenInfo();
          if (!tabs || !tabWrapEles || !tabsInfo) return;
          const arr: TabItemType[] = tabWrapEles.map((e) => {
            const _l = e.left + e.width / 2 - tabsInfo.left;
            return { width: e.width, left: _l };
          });
          tabsRef.current.width = (ret?.isMiddleScreen ? screenW : tabs?.width ?? 0) / 2;
          tabsRef.current.tabList = arr;
          setIsLineShow(true);
        });
      };
      nextTick(() => {
        init();
      });
    }, [list]);

    useEffect(() => {
      setCurI(activeIndex);
    }, [activeIndex]);

    return withNativeProps(
      ret,
      <View className={`${classPrefix} ${idRef.current}`}>
        <View className={`${classPrefix}-header ${classPrefix}-header-left`}>
          <View className={`${classPrefix}-mask ${classPrefix}-mask-left`}></View>
        </View>
        <View className={`${classPrefix}-header ${classPrefix}-header-right`}>
          <View className={`${classPrefix}-mask ${classPrefix}-mask-right`}></View>
        </View>
        <ScrollView
          className={`${classPrefix}-scrollView`}
          scrollX
          scrollWithAnimation
          onTouchEnd={() => (toLeft.current.left = 0)}
          scrollLeft={
            toLeft.current.left + tabsRef.current.tabList[curI]?.left - tabsRef.current.width
          }
        >
          <View className={`${classPrefix}-content`}>
            <View
              className={`${classPrefix}-left-placeholder ${classNames(ret.placeholderBoxClass)}`}
            ></View>
            {panes.map((pane, i) =>
              withNativeProps(
                pane.props,
                <View
                  className={`${classPrefix}-tabWrap ${classNames(ret.tabClassName)}`}
                  key={pane.key ?? i}
                  onClick={() => {
                    toLeft.current.left = 0;
                    setCurI(i);
                    onChange?.(i);
                  }}
                >
                  <View
                    className={`${classPrefix}-tab ${
                      i === curI ? `${classPrefix}-tab-active ${classNames(activeTextClass)}` : ''
                    }`}
                  >
                    {pane.props.title}
                  </View>
                </View>,
              ),
            )}
            <View
              className={`${classPrefix}-right-placeholder ${classNames(ret.placeholderBoxClass)}`}
            ></View>
            {/* 底部选中的横线样式 */}
            {
              <View
                className={`
                  ${classPrefix}-line 
                  ${isAnimate ? classPrefix + '-line-animate' : ''}
                  ${isLineShow ? `${classPrefix}-line-show` : `${classPrefix}-line-hide`}
                `}
                style={{
                  transform: `translateX(calc(${tabsRef.current.tabList[curI]?.left}px - 50%))`,
                }}
              >
                {activeLine ?? <View className={`${classPrefix}-line-line`}></View>}
              </View>
            }
          </View>
        </ScrollView>
      </View>,
    );
  },
);
