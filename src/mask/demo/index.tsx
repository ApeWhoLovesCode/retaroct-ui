import { Button } from '@tarojs/components';
import React, { useRef, useState } from 'react';
import Mask from '..';
import DemoBlock from '../../demo-block';

export default () => {
  const timer = useRef<NodeJS.Timer | undefined>();
  const [show, setShow] = useState(false);

  const btnClick = () => {
    setShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setShow(false);
    }, 2000);
  };

  return (
    <DemoBlock title="基本使用">
      <Button onClick={btnClick}>显示遮罩层</Button>
      <Mask
        show={show}
        onClose={() => {
          clearTimeout(timer.current);
          setShow(false);
        }}
      >
        <Button
          size="mini"
          style={{
            position: 'absolute',
            left: '30%',
            top: '30%',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          来个按钮
        </Button>
      </Mask>
    </DemoBlock>
  );
};
