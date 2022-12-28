import { View, Text } from '@tarojs/components';
import React from 'react';
import './index.less';

type PropsType = {
  marginTop?: number | string;
  height?: number | string;
};

export default ({ marginTop = 30, height }: PropsType) => {
  const styleWrap = (val?: number | string) => {
    if (val === void 0) return '';
    if (typeof val === 'number') return val + 'px';
    return val;
  };
  return (
    <View
      className="comLoadingWrap"
      style={{
        marginTop: styleWrap(marginTop),
        height: styleWrap(height),
      }}
    >
      <Text className="comLoadingItem"></Text>
      <Text className="comLoadingItem"></Text>
      <Text className="comLoadingItem"></Text>
    </View>
  );
};
