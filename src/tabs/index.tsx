import React, { forwardRef, useImperativeHandle } from 'react';
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
import { randomStr } from '../utils/random';

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
  /** 是否有默认动画 默认为true */
  isAnimate?: boolean;
  /** 激活的tab是否是基于屏幕居中 默认为false(基于tabs盒子居中) */
  isMiddleScreen?: boolean
  /** 每个tab的类名，主要用于设置padding */
  tabClassName?: string
  /** 左右预占位的盒子的类名，主要用于设置宽度 */
  placeholderBoxClass?: string
  /** children */
  children: ReactNode
  /** 当tab发生改变触发 */
  onChange?: (i: number) => void;
} & NativeProps;

export type TabsInstance = {
  /** 滚动到指定的位置 默认为 9999 滚动到最右边 */
  scrollTo: (v?: number) => void
}

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

const Tabs = forwardRef<TabsInstance, TabsProps>(({
  list,
  activeIndex = 0,
  activeTextClass,
  activeLine,
  isAnimate = true,
  onChange,
  children,
  ...ret
}, ref) => {
  const idRef = useRef(randomStr(classPrefix))
  const [curI, setCurI] = useState<number>(activeIndex);
  const tabsRef = useRef<TabsRefType>({
    width: 0,
    tabList: [],
  });
  const [isLineShow, setIsLineShow] = useState(false)
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
    scrollTo
  }))

  useEffect(() => {
    if (!list?.length) return;
    const init = () => {
      Promise.all([
        getEleInfo(`.${idRef.current}`),
        getAllEleInfo(`.${idRef.current} .${classPrefix}-tabWrap`),
        getEleInfo(`.${idRef.current} .${classPrefix}-scrollView`),
      ]).then(([tabs, tabWrapEles, tabsInfo]) => {
        if (!tabs || !tabWrapEles || !tabsInfo) return;
        const arr: TabItemType[] = tabWrapEles.map((e) => {
          const _l = e.left + e.width / 2 - tabsInfo.left;
          return { width: e.width, left: _l };
        });
        tabsRef.current.width = (ret?.isMiddleScreen ? Taro.getSystemInfoSync().screenWidth : (tabs?.width ?? 0)) / 2
        tabsRef.current.tabList = arr;
        setIsLineShow(true)
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
          <View className={`${classPrefix}-left-placeholder ${classNames(ret.placeholderBoxClass)}`}></View>
          {
            panes.map((pane, i) => (
              withNativeProps(
                pane.props,
                <View 
                  className={`${classPrefix}-tabWrap ${classNames(ret.tabClassName)}`} 
                  key={pane.key ?? i} 
                  onClick={() => {
                    toLeft.current.left = 0
                    setCurI(i)
                    onChange?.(i)
                  }}
                >
                  <View 
                    className={`${classPrefix}-tab ${i === curI ? `${classPrefix}-tab-active ${classNames(activeTextClass)}` : ''}`} 
                  >
                    {pane.props.title}
                  </View>
                </View>
              )
            ))
          }
          <View className={`${classPrefix}-right-placeholder ${classNames(ret.placeholderBoxClass)}`}></View> 
          {/* 底部选中的横线样式 */}
          {!!list?.length && (
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
              {activeLine ?? (
                <Image className={`${classPrefix}-line-icon`} src={require('./assets/tab-active.png')}></Image>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>,
  );
});

export default attachPropertiesToComponent(Tabs, { Tab });
