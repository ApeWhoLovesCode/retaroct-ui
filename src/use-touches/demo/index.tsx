import { View } from '@tarojs/components';
import React, { useRef } from 'react';
import useTouchs from '..';
import useRender from '../../use-render';
import './index.less';

const Demo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useTouchs(ref);
  const { renderFn } = useRender();
  return (
    <View ref={ref} className="demo-use-touchs">
      touches
    </View>
  );
};

export default Demo;
