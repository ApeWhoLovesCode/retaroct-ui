import { Button, View } from '@tarojs/components';
import React, { useRef, useState } from 'react';
import Picker from '..';
import { PickerInstance } from '../type';
import { PickerChangeEvents } from '../../picker-view';
import DemoBlock from '../../demo-block';
import './index.less';

export default () => {
  const pickerRef = useRef<PickerInstance>(null);
  const [state, setState] = useState({
    v1: ['宁波'],
  });
  const [isShow, setIsShow] = useState(false);
  const columns1 = ['杭州', '宁波', '温州', '嘉兴', '湖州', '深圳', '广州', '佛山'];

  const onShow = () => {
    setIsShow(true);
  };

  const onClose = () => {
    setIsShow(false);
  };

  const onConfirm = (e: PickerChangeEvents) => {
    console.log(e);
    onClose();
    setState((s) => ({ ...s, v1: e.value }));
  };

  return (
    <View className="demo-picker">
      <DemoBlock title="正常使用" padding="0 12px">
        <Button onClick={onShow}>选择数据</Button>
        <View className="info">当前选择的数据是：{JSON.stringify(state.v1)}</View>
        <Picker
          ref={pickerRef}
          show={isShow}
          value={state.v1}
          columns={columns1}
          showToolbar
          onConfirm={onConfirm}
          onCancel={onClose}
          onClose={onClose}
        />
      </DemoBlock>
    </View>
  );
};
