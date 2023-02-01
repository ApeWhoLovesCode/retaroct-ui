import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import './index.less';
import DemoBlock from '../../demo-block';
import Slider from '..';
import React, { useState } from 'react';

export default () => {
  const [twoV, setTwoV] = useState([20, 60]);
  const [rangeV, setRangeV] = useState(10);
  const [customV, setCustomV] = useState(10);

  const showToast = (title: string) => {
    Taro.showToast({ title, duration: 1500, icon: 'none' });
  };

  return (
    <View className="demo-slider">
      <DemoBlock title="常规使用" padding="5px 20px">
        <Slider />
      </DemoBlock>
      <DemoBlock title="双滑块" padding="5px 20px">
        <Slider
          isTwo
          value={twoV}
          onChange={(v) => setTwoV(v as number[])}
          onDragEnd={(v) => showToast(v.toString())}
        />
      </DemoBlock>
      <DemoBlock title={`指定范围 (-50~50) ${rangeV}`} padding="5px 20px">
        <Slider min={-50} max={50} value={rangeV} onChange={(v) => setRangeV(v as number)} />
      </DemoBlock>
      <DemoBlock title="步长为10" padding="5px 20px">
        <Slider value={20} step={10} />
      </DemoBlock>
      <DemoBlock title="自定义样式" padding="5px 20px">
        <Slider value={30} activeColor="#EB3223" inactiveColor="#ccc" barHeight={8} />
      </DemoBlock>
      <DemoBlock title="自定义按钮" padding="5px 20px">
        <Slider
          value={customV}
          button={<View className="custom-btn">{customV}</View>}
          onChange={(v) => {
            setCustomV(v as number);
          }}
        />
      </DemoBlock>
      <DemoBlock title="禁用" padding="5px 20px">
        <Slider value={10} disabled />
      </DemoBlock>
      <DemoBlock title="添加动画效果" padding="5px 20px">
        <Slider isAnimation value={30} />
      </DemoBlock>
      <DemoBlock className="block" title="垂直方向" padding="5px 20px">
        <View className="sliderWrap">
          <Slider value={20} vertical />
        </View>
        <View className="sliderWrap">
          <Slider isTwo vertical value={[20, 60]} onDragEnd={(v) => showToast(v.toString())} />
        </View>
      </DemoBlock>
    </View>
  );
};
