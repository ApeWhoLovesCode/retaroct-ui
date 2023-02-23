import { View, Image } from '@tarojs/components';
import Tabs, { TabsInstance } from '../index';
import React, { useRef } from 'react';
import './index.less';
import DemoBlock from '../../demo-block';

export default () => {
  const tabsList = ['苹果', '香蕉', '菠萝'];
  const tabsList2 = ['苹果', '香蕉', '菠萝', '苹果1', '香蕉1', '菠萝1', '苹果2', '香蕉2', '菠萝2'];
  const tabsRef = useRef<TabsInstance>(null);

  return (
    <View className="demo-tabs">
      <DemoBlock title="常规使用">
        <Tabs list={tabsList}>
          {tabsList.map((item, i) => (
            <Tabs.Tab key={item + i} title={item} />
          ))}
        </Tabs>
      </DemoBlock>
      <DemoBlock title="内容较多">
        <Tabs list={tabsList2}>
          {tabsList2.map((item, i) => (
            <Tabs.Tab key={item + i} title={item} />
          ))}
        </Tabs>
      </DemoBlock>
      <DemoBlock title="指定滚动并基于屏幕居中" className="tabsWrap">
        <Tabs ref={tabsRef} className="tabs" list={tabsList2} isMiddleScreen>
          {tabsList2.map((item, i) => (
            <Tabs.Tab key={item + i} title={item} />
          ))}
        </Tabs>
        <View className="arrow" onClick={() => tabsRef.current?.scrollTo(9999)}>
          {'>'}
        </View>
      </DemoBlock>
      <DemoBlock title="自定义选中icon">
        <Tabs
          list={tabsList2}
          activeLine={
            <Image
              src="https://cdn.lightwork.com.cn/img/20230223113209-yxG6Xu.png"
              className="line-icon"
            ></Image>
          }
        >
          {tabsList2.map((item, i) => (
            <Tabs.Tab key={item + i} title={item} />
          ))}
        </Tabs>
      </DemoBlock>
    </View>
  );
};
