import { View } from '@tarojs/components';
import React, { useState } from 'react';
import useTouchEvent from '..';
import './index.less';

const Demo: React.FC = () => {
  const [dom, setDom] = useState({
    x: 0,
    y: 0,
  });

  const { info, onTouchFn } = useTouchEvent({
    onTouchStart(e) {
      console.log('onTouchStart: ', e);
    },
    onTouchMove() {
      setDom({ x: info.x, y: info.y });
    },
    onTouchEnd(e) {
      console.log('onTouchEnd: ', e);
    },
  });

  return (
    <View className="demo-use-touches">
      <View
        className="ball"
        style={{
          transform: `translate(${dom.x}px, ${dom.y}px)`,
        }}
        {...onTouchFn}
      >
        移动
      </View>
    </View>
  );
};

export default Demo;
