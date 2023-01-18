import DemoBlock from '../../demo-block';
import { View } from '@tarojs/components';
import Loading from '..';
import React from 'react';
import './index.less';

export default () => {
  return (
    <View className="demo-loading">
      <DemoBlock className="block" title="常规使用" padding="0 10px">
        <Loading />
        <Loading className="loading" type="three-point" />
        <Loading className="loading" type="rotate-xz" />
      </DemoBlock>
      <DemoBlock className="block" title="自定义颜色" padding="0 10px">
        <Loading color="#4285fb" />
        <Loading color="#D3F850" className="loading" type="three-point" />
        <Loading color="#EB3223" size={50} className="loading" type="rotate-xz" />
      </DemoBlock>
      <DemoBlock className="block" title="自定义大小" padding="0 10px">
        <Loading size={50} />
        <Loading size={50} className="loading" type="three-point" />
      </DemoBlock>
      <DemoBlock className="block" title="与文字搭配使用" padding="0 10px">
        正在
        <Loading />
        加载中
        <Loading type="three-point" />
      </DemoBlock>
    </View>
  );
};
