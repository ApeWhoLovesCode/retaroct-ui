import { View, Image } from '@tarojs/components';
import { useState, useEffect } from 'react';
import './index.less';
import PullToRefresh from '..';
import React from 'react';
import Tabs from '../../tabs';
import FloatingBall from '../../floating-ball';

type listType = {
  id: string;
  name: string;
};
export default () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [list, setList] = useState<listType[]>([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const arr: listType[] = [];
    for (let index = 0; index < 25; index++) {
      arr.push({ id: `id-${index}`, name: '内容-' + index });
    }
    setTimeout(() => {
      setList(arr);
    }, 20);
  };

  const onRefresh = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setList([...[{ id: `id-${Date.now()}`, name: 'hahah' + Date.now() }], ...list]);
        resolve(true);
      }, 1000);
    });
  };

  const renderContent = (
    <View className="content">
      {list.map((item, index) => (
        <View key={index} className="item">
          {item.name}
        </View>
      ))}
    </View>
  );

  return (
    <View className="demo-pull-to-refresh">
      <Tabs
        activeIndex={activeIndex}
        style={{ height: '60px' }}
        onChange={(i) => setActiveIndex(i)}
      >
        <Tabs.Tab title="基础用法" key="1" />
        <Tabs.Tab title="文案修改" key="2" />
        <Tabs.Tab title="自定义内容" key="3" />
      </Tabs>
      {activeIndex === 0 ? (
        <PullToRefresh onRefresh={() => onRefresh()} style={{ height: 'calc(100vh - 60px)' }}>
          {renderContent}
        </PullToRefresh>
      ) : activeIndex === 1 ? (
        <PullToRefresh
          pullingText="加油，继续下拉吧..."
          loosingText="松手就刷新了..."
          completeText="恭喜你，刷新成功了"
          loadingType="circular"
          onRefresh={() => onRefresh()}
          style={{ height: 'calc(100vh - 60px)' }}
        >
          {renderContent}
        </PullToRefresh>
      ) : (
        <PullToRefresh
          renderText={({ status, distance }) => {
            if (status === 'complete') {
              return (
                <Image
                  className="img"
                  src="https://cdn.lightwork.com.cn/img/20230223105059-mJmxR1.png"
                />
              );
            } else {
              return (
                <Image
                  className="img"
                  src="https://cdn.lightwork.com.cn/img/20230223105452-9U9WDJ.png"
                  style={{ transform: `scale(${distance / 80})` }}
                />
              );
            }
          }}
          onRefresh={() => onRefresh()}
          style={{ height: 'calc(100vh - 60px)' }}
        >
          {renderContent}
        </PullToRefresh>
      )}
      {/* fixed定位的内容不要放到下拉加载里面, transfrom 会导致 fixed 定位出问题 */}
      <Ball />
    </View>
  );
};

const Ball = () => {
  return (
    <FloatingBall
      axis="xy"
      magnetic="x"
      style={{
        '--initial-position-bottom': '258px',
        '--initial-position-right': '0',
      }}
    >
      <View className="kefu">球</View>
    </FloatingBall>
  );
};
