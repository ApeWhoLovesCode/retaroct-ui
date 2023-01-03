import React, { useEffect } from 'react';
import useCountDown from '..';

const UseRenderDemo: React.FC = () => {
  const [count, setCountDown] = useCountDown()
  useEffect(() => {
    setCountDown(Date.now(), 3000_000)
  }, [])
  return (
    <div>
      <div>倒计时：{count}</div>
    </div>
  );
};

export default UseRenderDemo;
