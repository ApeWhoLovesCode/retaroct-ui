import { Button, View } from '@tarojs/components';
import React from 'react';
import useSetState from '..';

const UseSetStateDemo: React.FC = () => {
  const [state, setState] = useSetState({
    hello: '',
    count: 0,
  });

  return (
    <View>
      <View>{JSON.stringify(state, null, 2)}</View>
      <Button onClick={() => setState({ hello: 'hello world' })}>set hello world</Button>
    </View>
  );
};

export default UseSetStateDemo;
