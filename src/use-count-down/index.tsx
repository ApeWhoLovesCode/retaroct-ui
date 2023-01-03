import { useEffect, useRef, useState } from "react"
import { useDidShow } from "@tarojs/taro"

/** 倒计时钩子 */
const useCountDown = () => {
  const timerRef = useRef<NodeJS.Timer | undefined>()
  const [time, setTime] = useState<number>()
  const params = useRef({
    beginTime: 0,
    total: 0
  })

  // 退到后台，大约过个六七秒后定时器会自动暂停掉（回来后自动继续之前的定时器），所以会导致时间不准确
  useDidShow(() => {
    clearInterval(timerRef.current)
    _setInterval(params.current.beginTime, params.current.total)
  })

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  // 开启计时器的函数, beginTime: 输入的初始时间 total: 需要计算的时间
  const setCountDown = (beginTime: number, total: number) => {
    params.current = { beginTime, total }
    clearInterval(timerRef.current)
    _setInterval(beginTime, total)
  }

  const _setInterval = (beginTime: number, total: number) => {
    if(!beginTime || !total) return
    const interval = beginTime + total - Date.now()
    if(interval < 0) return
    setTime(interval)
    timerRef.current = setInterval(() => {
      // console.log('--setInterval--');
      setTime(t => {
        const _t = t! - 1000
        if(_t <= 0) {
          clearInterval(timerRef.current)
          return 0
        }
        return _t
      })
    }, 1000);
  }

  // 手动清除计时器
  const clearCountDownTimer = () => clearInterval(timerRef.current)

  return [time, setCountDown, clearCountDownTimer] as const
}

export default useCountDown