import { Button, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useEffect, useState } from 'react';
import useUnmountedRef from '..';

const TestComponent = () => {
  const unmountedRef = useUnmountedRef();
  useEffect(() => {
    setTimeout(() => {
      if (!unmountedRef.current) {
        Taro.showToast({ title: '组件还未被卸载～', icon: 'none' });
      }
    }, 2000);
  }, []);
  return <View>Hello World!</View>;
};

export default () => {
  const [show, setShow] = useState(false);
  return (
    <View>
      {show && <TestComponent />}
      <Button onClick={() => setShow((v) => !v)}>{show ? 'unmount' : 'mount'}</Button>
    </View>
  );
};
