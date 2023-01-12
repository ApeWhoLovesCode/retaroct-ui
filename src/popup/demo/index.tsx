import { View, Button } from '@tarojs/components';
import React from 'react';
import { useState } from 'react';
import Popup, { PopupPosition } from '..';
import './index.less';

const btnObj: any = {
  center: '中间弹出',
  top: '顶部弹出',
  right: '右侧弹出',
  bottom: '底部弹出',
  left: '左侧弹出',
};

export default () => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState<PopupPosition>('top');

  const showAction = function (position: PopupPosition) {
    setPosition(position);
    setShow(true);
  };

  return (
    <View className="demo-popup">
      {Object.keys(btnObj).map((k) => (
        <Button
          key={k}
          onClick={() => {
            showAction(k as PopupPosition);
          }}
        >
          {btnObj[k]}
        </Button>
      ))}
      <Popup
        className="popup"
        show={show}
        position={position}
        round
        closeable
        safeAreaInsetTop
        onClose={() => setShow(false)}
      >
        <View className="content">弹出层</View>
      </Popup>
    </View>
  );
};
