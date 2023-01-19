import { View } from '@tarojs/components';
import React, { useRef, useState } from 'react';
import useTouchs from '..';
import './index.less';

const Demo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [dom, setDom] = useState({
    x: 0,
    y: 0,
  });

  const { info } = useTouchs(
    ref,
    {
      onTouchStart() {
        console.log('onTouchStart: ', dom);
      },
      onTouchMove() {
        setDom({ x: info.x, y: info.y });
      },
      onTouchEnd(e) {
        console.log('onTouchEnd: ', e);
      },
    },
    [dom],
  );

  return (
    <View className="demo-use-touches">
      <View
        ref={ref}
        className="ball"
        style={{
          transform: `translate(${dom.x}px, ${dom.y}px)`,
        }}
      >
        移动
      </View>
    </View>
  );
};

export default Demo;
