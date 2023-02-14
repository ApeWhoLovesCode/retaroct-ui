import DemoBlock from '../../demo-block';
import { Button, View } from '@tarojs/components';
import React from 'react';
import './index.less';
import Toast from '../index';

export default () => {
  return (
    <View className="demo-toast">
      <DemoBlock title="常规使用" padding="0 10px">
        <Button
          onClick={() => {
            Toast.show({ message: '来点内容' });
          }}
        >
          文字提示
        </Button>
        <Button
          onClick={() => {
            Toast.show({ type: 'loading', message: '加载中...', forbidClick: true });
          }}
        >
          加载提示
        </Button>
        <Button
          onClick={() => {
            Toast.success({ message: '成功了' });
          }}
        >
          成功提示
        </Button>
        <Button
          onClick={() => {
            Toast.fail({ message: '失败了' });
          }}
        >
          失败提示
        </Button>
      </DemoBlock>
      <DemoBlock title="自定义图片" padding="0 10px">
        <Button
          onClick={() => {
            Toast.show({
              type: 'icon',
              icon: 'https://cdn.lightwork.com.cn/img/20230214104245-iQHWke.png',
              message: '自定义图片',
            });
          }}
        >
          自定义图片
        </Button>
      </DemoBlock>
      <DemoBlock title="自定义位置" padding="0 10px">
        <Button
          onClick={() => {
            Toast.show({ message: 'top 展示', position: 'top' });
          }}
        >
          top 展示
        </Button>
        <Button
          onClick={() => {
            Toast.show({ message: 'bottom 展示', position: 'bottom' });
          }}
        >
          bottom 展示
        </Button>
      </DemoBlock>
      <DemoBlock title="遮罩层" padding="0 10px">
        <Button
          onClick={() => {
            Toast.show({ message: '显示遮罩层', mask: true });
          }}
        >
          显示遮罩层
        </Button>
        <Button
          onClick={() => {
            Toast.show({
              message: '显示遮罩层',
              mask: true,
              maskClickClose: true,
              onClose() {
                console.log('close');
              },
            });
          }}
        >
          点击遮罩层关闭
        </Button>
        <Button
          onClick={() => {
            Toast.show({ message: '来点内容', forbidClick: true });
          }}
        >
          遮罩层不显示，背景不能点击
        </Button>
        <Button onClick={() => Toast.clear()}>清除提示</Button>
      </DemoBlock>
      <Toast />
    </View>
  );
};
