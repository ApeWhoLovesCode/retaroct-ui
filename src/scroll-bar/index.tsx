
import { View } from '@tarojs/components'
import Taro, { nextTick } from '@tarojs/taro'
import './index.less'
import { forwardRef, useState, useEffect, useMemo, ReactElement, useImperativeHandle, useRef } from 'react';
import getEleInfo from "../utils/getEleInfo";
import { randomStr } from '../utils/random';
import React from 'react';
import { handleStylePx } from '../utils/handleDom';
import classNames from 'classnames';

type PropsType = {
  /** 滚动的内容 */
  title: string | ReactElement
  /** 滚动速度 默认 50 */
  speed?: number
  /** 每段文字间的间距 默认 50 */
  space?: number | string
  /** 文字的颜色 */
  color?: string
  className?: string
}

export type ScrollBarInstance = {
  /** 重新获取dom并开启动画 */
  renderDom: () => void
  /** 取消滚动 */
  cancelScroll: () => void
}

type AnimationData = {
  actions: object[]
}

export default forwardRef<ScrollBarInstance, PropsType>((
  { title, speed = 50, space = 50, color = '#000', className }, ref
) => {
  const [barElemId] = useState(`b_${randomStr()}`)
  const [animElemId] = useState(`a_${randomStr()}`)
  const [itemElemId] = useState(`i_${randomStr()}`)
  // 需要渲染的滚动元素个数
  const [eleNum, setEleNum] = useState<number>(1)
  const timer = useRef<NodeJS.Timer>()

  const [animationData, setAnimationData] = useState<AnimationData>({
    actions: [{}]
  })

  /** 渲染dom并开启动画 */
  const renderDom = () => {
    Promise.all([
      getEleInfo(`#${barElemId}`),
      getEleInfo(`#${animElemId}`),
      getEleInfo(`#${itemElemId}`),
    ]).then(([scrollEle, animEle, itemEle]) => {
      const scrollW = scrollEle?.width, animElemW = animEle?.width, itemW = itemEle?.width
      if(!itemW || !scrollW || !animElemW) {
        return
      }
      // 需要渲染的滚动元素个数（需要大于 滚动文字 + 外部滚动区域宽度)
      const n = Math.min(Math.ceil((scrollW + itemW) / itemW), 20)
      const duration = scrollW / speed * 1000
      const _animation = Taro.createAnimation({
        duration: duration,
        timingFunction: 'linear',
      })
      const resetAnimation = Taro.createAnimation({
        duration: 0,
        timingFunction: 'linear'
      })
      /** 重置并开启动画 */
      const animationRun = () => {
        resetAnimation.translateX(0).step()
        setAnimationData(resetAnimation.export())
        setTimeout(() => {
          _animation.translateX(-itemW).step()
          setAnimationData(_animation.export())
        }, 10);
      }
      animationRun()
      clearInterval(timer.current)
      timer.current = setInterval(animationRun, duration + 10)
      setEleNum(n)
    })
  }

  /** 取消滚动 */
  const cancelScroll = () => {
    clearInterval(timer.current)
  }

  useImperativeHandle(ref, () => ({
    renderDom,
    cancelScroll,
  }))

  useEffect(() => {
    nextTick(() => {
      renderDom()
    });
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  // 滚动的元素
  const RenderItem = () => {
    return (
      <View id={itemElemId} className="com-scroll-bar-item" style={{paddingRight: handleStylePx(space), color: color}}>
        {title}
      </View>
    )
  }

  // 渲染滚动元素的列表
  const renderList = useMemo(() => () => {
    const arr: ReactElement[] = []
    for(let i = 0; i < eleNum; i++) {
      arr.push(<RenderItem key={i} />)
    }
    return arr
  }, [eleNum, space, color])

  return (
    <View id={barElemId} className={`com-scroll-bar ${classNames(className)}`}>
      <View
        id={animElemId}
        className="com-scroll-bar-itemWrap"
        animation={animationData}
      >
        { renderList() }
      </View>
    </View>
  )
})