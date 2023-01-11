import React, { useState } from 'react';
import useThrottle from '..';
import { View, Button } from '@tarojs/components';

const Demo: React.FC = () => {
  const [val, setVal] = useState<number>(0);
  const [time, setTime] = useState<number>(200);

  const add = useThrottle(
    (v: number) => {
      setVal(v);
    },
    time,
    [time],
  );

  return (
    <View className="demo-use-throttle">
      <Button
        onClick={() => {
          add(val + 1);
        }}
      >
        节流 + 1
      </Button>
      <View style={{ textAlign: 'center' }}>{val}</View>
      <Button
        onClick={() => {
          setTime((t) => (t === 200 ? 1000 : 200));
        }}
      >
        节流时间:{time},点击改变
      </Button>
    </View>
  );
};

export default Demo;
