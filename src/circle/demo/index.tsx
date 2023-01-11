import { View, Button } from '@tarojs/components';
import Circle from '../index';
import { useEffect, useState } from 'react';
import React from 'react';
import './index.less';
import DemoBlock from '../../demo-block';

export default () => {
  const [value, setValue] = useState(50);
  return (
    <View className="demo-circle">
      <DemoBlock padding="10px" className="demoWrap" title="简单使用">
        <Circle lineCap="round" value={value} text={value} />
        <View className="btnWrap">
          <Button
            className="btn"
            size="mini"
            onClick={() => {
              setValue((v) => (v += 20));
            }}
          >
            加20
          </Button>
          <Button
            className="btn"
            size="mini"
            onClick={() => {
              setValue((v) => (v -= 20));
            }}
          >
            减20
          </Button>
        </View>
      </DemoBlock>
      <DemoBlock padding="10px" className="demoWrap demoStyleWrap" title="自定义样式">
        <Circle value={value} strokeWidth={10} text="加粗圆环" />
        <Circle value={value} size={120} text="大小定制" />
        <Circle value={value} layerColor="#cccccc" color="#ffd01e" text="颜色定制" />
        <Circle
          value={value}
          color={{
            '0%': '#ffd01e',
            '100%': '#D3F850',
          }}
          text="渐变色"
        />
      </DemoBlock>
      <DemoBlock padding="10px" className="demoWrap" title="逆时针 + 自定义children">
        <Circle value={value} clockwise={false}>
          <View className="circle-inside">{value}%</View>
        </Circle>
      </DemoBlock>
    </View>
  );
};
