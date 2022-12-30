import { View } from '@tarojs/components';
import SwipeAction, { Action } from '../index';
import React, { useState } from 'react';
import './index.less';
import DemoBlock from '../../demo-block';

export default () => {
  const leftActions: Action[] = [
    {key: 'collection', text: '收藏', color: 'green'}
  ]
  const rightActions: Action[] = [
    {key: 'like', text: '点赞', color: 'red'},
    {key: 'coin', text: '投币', color: 'green'},
    {key: 'collection', text: '收藏', color: 'blue'},
  ]
  const customText = (
    <View className="customText">自定义的内容</View>
  )
  const customList: Action[] = [
    {key: 'custom', text: customText}
  ]

  return (
    <View className="demo-swipe-action">
      <DemoBlock title='常规使用'>
        <SwipeAction>
          <Card />
        </SwipeAction>
      </DemoBlock>
      <DemoBlock title='左边也能滑'>
        <SwipeAction leftActions={leftActions}>
          <Card />
        </SwipeAction>
      </DemoBlock>
      <DemoBlock title='多个选项'>
        <SwipeAction rightActions={rightActions}>
          <Card />
        </SwipeAction>
      </DemoBlock>
      <DemoBlock title='自定义'>
        <SwipeAction rightActions={customList}>
          <Card />
        </SwipeAction>
      </DemoBlock>
    </View>
  );
};

const Card = () => {
  return (
    <View className="demo-card">
      卡片（滑动试试）
    </View>
  )
}
