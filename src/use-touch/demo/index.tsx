import { View } from '@tarojs/components';
import React from 'react';
import useTouch from '..';
import useRender from '../../use-render';
import './index.less';

const Demo: React.FC = () => {
  const touch = useTouch();
  const { renderFn } = useRender();
  return (
    <View
      className="demo-use-touch"
      onTouchStart={(e) => touch.start(e)}
      onTouchMove={(e) => {
        touch.move(e);
        renderFn();
      }}
    >
      <View>deltaX: {touch.info.deltaX}</View>
      <View>deltaY: {touch.info.deltaY}</View>
    </View>
  );
};

export default Demo;
