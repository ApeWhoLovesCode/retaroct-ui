import { View } from '@tarojs/components'
import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import './index.less';
import ScrollRotate from '../index';
import React from 'react';

export default () => {
  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    init()
  }, [])
  /** 初始化获取数据 */
  const init = async () => {
    setTimeout(() => {
      const newList = new Array(23).fill('Tops').map((a,i) => (
        {_id: 'id' + i, title: a + i}
      ))
      setList(newList)
    }, 300);
  }

  return (
    <View className='demo-scroll-circle'>
      <View className="top" style={{height: '50px', background: '#458cfe'}}></View>
      <ScrollRotate list={list} height={`calc(100vh - 100px)`}>
        {list?.map((item,i) => (
          <ScrollRotate.Item key={item._id} index={i}>
            <View className={`card`}>
              <View className="cardTitle">{item.title}</View>
            </View>
          </ScrollRotate.Item>
        ))}
      </ScrollRotate>
      <View className="navWrap">
        <View className='navItem'>T</View>
        <View className='navItem'>C</View>
        <View className='navItem'>B</View>
      </View>
      <View className="bottom" style={{height: '50px', background: '#458cfe'}}></View>
    </View>
  )
}