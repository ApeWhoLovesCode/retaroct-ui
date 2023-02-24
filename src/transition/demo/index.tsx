import { View, Button } from '@tarojs/components';
import Transition from '../index';
import React, { useRef, useState } from 'react';
import './index.less';
const animations = [
  'fade',
  'fade-up',
  'fade-down',
  'fade-left',
  'fade-right',
  'slide-up',
  'slide-down',
  'slide-left',
  'slide-right',
];

export default () => {
  const [show, setShow] = useState('');
  const timer = useRef<NodeJS.Timer>();

  const onShowAction = (s: string) => {
    clearTimeout(timer.current);
    setShow(s);
    timer.current = setTimeout(() => {
      setShow('');
      clearTimeout(timer.current);
    }, 1000);
  };

  return (
    <View className="demo-transition">
      {animations.map((item) => (
        <Button key={item} onClick={() => onShowAction(item)}>
          {item}
        </Button>
      ))}
      {animations.map((item, i) => (
        <Transition
          key={`${item}-i-${i}`}
          className="center"
          name={item}
          show={show === item}
          duration={{ enter: 300, leave: 1000 }}
        />
      ))}
    </View>
  );
};
