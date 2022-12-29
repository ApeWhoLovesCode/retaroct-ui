import React from 'react';
import ArrowIcon from './assets/arrow.png';
import TabActiveIcon from './assets/tab-active.png';
import useRender from '../use-render';
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component';
import getEleInfo, { getAllEleInfo } from '../utils/getEleInfo';
import { NativeProps, withNativeProps } from '../utils/native-props';
import { traverseReactNode } from '../utils/traverse-react-node';
import { View, Image, ScrollView } from '@tarojs/components';
import { nextTick } from '@tarojs/taro';
import classNames from 'classnames';
import { FC, useState, useEffect, useRef, ReactNode, ReactElement, ComponentProps } from 'react';
import './index.less';

const classPrefix = `com-tabs`;

export type TabProps = {
  title: ReactNode;
  key: string;
  children?: ReactNode;
} & NativeProps;
const Tab: FC<TabProps> = () => {
  return null;
};

export type TabsProps = {
  /** 当前激活 tab 的索引 */
  activeIndex?: number;
  /** 传入数组，主要用于获取宽度等信息 */
  list?: any[];
  /** 激活的文字类名 */
  activeTextClass?: string;
  /** 激活的文字下划线，默认为一个图标 */
  activeLine?: ReactNode;
  /** 是否显示右箭头 默认是false */
  isRightArrow?: boolean;
  /** 是否有默认动画 默认为true */
  isAnimate?: boolean;
  /** 当tab发生改变触发 */
  onChange?: (i: number) => void;
} & NativeProps;

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

const Tabs: FC<TabsProps> = ({
  list,
  activeIndex = 0,
  activeTextClass,
  activeLine,
  isRightArrow,
  isAnimate = true,
  onChange,
  children,
  ...ret
}) => {
  const [curI, setCurI] = useState<number>(activeIndex);
  const tabsRef = useRef<TabsRefType>({
    width: 0,
    tabList: [],
  });
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
  const toScrollRight = () => {
    const preLeft = toLeft.current.preLeft;
    const newLeft = 9999;
    toLeft.current.left = newLeft === preLeft ? newLeft + 1 : newLeft;
    toLeft.current.preLeft = toLeft.current.left;
    renderFn();
  };

  useEffect(() => {
    if (!list?.length) return;
    const init = () => {
      Promise.all([
        getAllEleInfo(`.${classPrefix}-tabWrap`),
        getEleInfo(`.${classPrefix}`),
        getEleInfo(`.${classPrefix}-scrollView`),
      ]).then(([tabWrapEles, tabs, tabsInfo]) => {
        console.log('tabWrapEles: ', tabWrapEles);
        console.log('tabs: ', tabs);
        console.log('tabsInfo: ', tabsInfo);
        if (!tabWrapEles || !tabsInfo) return;
        const arr: TabItemType[] = tabWrapEles.map((e) => {
          const _l = e.left + e.width / 2 - tabsInfo.left;
          return { width: e.width, left: _l };
        });
        tabsRef.current.width = (tabs?.width ?? 0) / 2;
        tabsRef.current.tabList = arr;
        renderFn();
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
    <View className={classPrefix}>
      <View className={`${classPrefix}-scrollViewWrap`}>
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
            <View className={`${classPrefix}-left-placeholder`}></View>
            {panes.map((pane, i) =>
              withNativeProps(
                pane.props,
                <View
                  className={`${classPrefix}-tabWrap}`}
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
            <View className={`${classPrefix}-right-placeholder`}></View>
            {/* 底部选中的横线样式 */}
            {!!list?.length && (
              <View
                className={`${classPrefix}-line ${isAnimate ? classPrefix + '-line-animate' : ''}`}
                style={{
                  transform: `translateX(calc(${tabsRef.current.tabList[curI]?.left}px - 50%))`,
                }}
              >
                {activeLine ?? (
                  <Image className={`${classPrefix}-line-icon`} src={TabActiveIcon}></Image>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      {isRightArrow && (
        <View className={`${classPrefix}-ArrowIconWrap`} onClick={toScrollRight}>
          <Image className={`${classPrefix}-ArrowIcon`} src={ArrowIcon}></Image>
        </View>
      )}
    </View>,
  );
};

export default attachPropertiesToComponent(Tabs, { Tab });
