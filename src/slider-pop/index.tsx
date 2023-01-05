import { View, ITouchEvent } from '@tarojs/components'
import { ReactElement, forwardRef, useImperativeHandle, useEffect, ReactNode, useRef } from 'react'
import { useState } from 'react';
import './index.less';
import classNames from 'classnames';
import getEleInfo from '../utils/getEleInfo';
import { randomStr } from '../utils/random';
import { nextTick } from '@tarojs/taro';
import React from 'react';

type PropsType = { 
  /** 弹出层的方向 默认为left */
  direction?: 'left' | 'right'
  /** 弹出层中的内容 */
  popContent: string | ReactElement
  /** 内容区域 */
  children: ReactNode;
  /** 内容区域的类名 */
  className?: string
  /** 自定义弹出层区域的类名 建议用来携带宽度，默认为273px */
  popClassName?: string
}

export type SliderPopInstance = {
  popShow: () => void
  popHide: () => void
}

/** 滑动弹出层 */
const SliderPop = forwardRef<SliderPopInstance, PropsType>(({
  direction = 'left', popContent, className, children, popClassName
}, ref) => {
  const [sliderPopId] = useState(`sliderPop_${randomStr()}`)
  /** 滑动弹出层的宽度 */
  const [filterPopWidth, setFilterPopWidth] = useState<number>(0)
  const touchRef = useRef({
    startX: 0,
  })
  const [moveX, setMoveX] = useState<number>(0)
  const [isMask, setIsMask] = useState(false)

  const isLeft = direction === 'left'

  const onTouchStart = (e: ITouchEvent) => {
    touchRef.current.startX = e.touches[0].clientX
  }
  const onTouchMove = (e: ITouchEvent) => {
    const x = e.touches[0].clientX - touchRef.current.startX
    const _filterPopWidth = (x < 0 ? 1 : -1) * filterPopWidth
    const _x = Math[x < 0 ? 'max' : 'min'](x, -_filterPopWidth)
    if(isLeft && x < 0) {
      setMoveX(_filterPopWidth + _x)
    }
    if(!isLeft && x > 0) {
      setMoveX(_filterPopWidth + _x)
    }
  }
  const onTouchEnd = (e: ITouchEvent) => {
    const x = e.changedTouches[0].clientX - touchRef.current.startX
    if(isLeft ? (x < -50) : (x > 50)) {
      popHide()
    } else {
      popShow()
    }
  }

  const popShow = () => {
    setMoveX((isLeft ? 1 : -1 ) * filterPopWidth); 
    setIsMask(true)
  }
  const popHide = () => {
    setMoveX(0); 
    setIsMask(false)
  }
  
  useImperativeHandle(ref, () => ({
    popShow,
    popHide 
  }))

  useEffect(() => {
    nextTick(async () => {
      const _info = (await getEleInfo(`#${sliderPopId}`))
      setFilterPopWidth(_info?.width ?? 0)
    });
  }, [])

  const SliderPopContent = () => {
    return (
      <View 
        className={`sliderPopContent ${classNames(className)}`}
      >
        {children}
      </View>
    )
  }

  return (
    <View 
      className={`com-slider-pop`} 
      style={{transform: `translateX(${moveX ?? 0}px)`}}
    >
      {
        !isLeft && SliderPopContent()
      }
      <View 
        id={sliderPopId}
        className={`com-slider-popPop ${popClassName} ${isLeft ? 'com-slider-popPop-left' : 'com-slider-popPop-right'}`}
        // catchMove：阻止滑动穿透
        catchMove 
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {popContent}
        {
          isMask && 
          <View className={`mask mask-${direction}`} onClick={() => {popHide()}} style={{width: `calc(100vw - ${filterPopWidth}px)`}}></View>
        }
      </View>
      {
        isLeft && SliderPopContent()
      }
    </View>
  )
})

export default SliderPop