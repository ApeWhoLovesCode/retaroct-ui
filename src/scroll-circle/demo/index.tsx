import { View } from '@tarojs/components';
import { useState, useEffect } from 'react';
import './index.less';
import ScrollRotate from '../index';
import React from 'react';

export default () => {
  const [list, setList] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    init();
  }, []);
  /** 初始化获取数据 */
  const init = () => {
    setTimeout(() => {
      const newList = new Array(30).fill('Tops').map((a, i) => ({ _id: 'id' + i, title: a + i }));
      const preIndex = (pageNum - 1) * pageSize;
      const newItems = newList.slice(preIndex, preIndex + pageSize);
      setItems(newItems);
      setList(newList);
    }, 300);
  };
  const onPageChange = ({ pageNum, pageSize }: { pageNum: number; pageSize: number }) => {
    const preIndex = (pageNum - 1) * pageSize;
    const newItems = list.slice(preIndex, preIndex + pageSize);
    // 填充空数据
    const length = newItems.length;
    for (let i = 0; i < pageSize - length; i++) {
      newItems.push({ _id: 'id-i-' + i, title: 'Null-' + i });
    }
    setItems(newItems);
    setPageNum(pageNum);
    setPageSize(pageSize);
  };

  return (
    <View className="demo-scroll-circle">
      <View className="top" style={{ height: '50px', background: '#458cfe' }}></View>
      <ScrollRotate list={list} height={`calc(100vh - 100px)`} onPageChange={onPageChange}>
        {items?.map((item, i) => (
          <ScrollRotate.Item key={item._id} index={i}>
            <View className={`card`}>
              <View className="cardTitle">{item.title}</View>
            </View>
          </ScrollRotate.Item>
        ))}
      </ScrollRotate>
      <View className="navWrap">
        <View className="navItem">T</View>
        <View className="navItem">C</View>
        <View className="navItem">B</View>
      </View>
      <View className="bottom" style={{ height: '50px', background: '#458cfe' }}></View>
    </View>
  );
};
