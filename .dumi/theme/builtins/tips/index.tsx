import React, { DependencyList, useCallback, useEffect, useRef, useState } from 'react';
import './index.less';

const classPrefix = '__dumi-previewer-tips';

const Tips = ({ previewerProps }) => {
  const [domState, setDomState] = useState({
    top: 0,
    left: 0,
    opacity: 0,
  });

  const getDomInfo = useThrottle(() => {
    const dom = document.querySelector('.__dumi-default-device');
    const info = dom?.getBoundingClientRect();
    if (!info) return;
    setDomState({
      top: info.top + info.height,
      left: info.left + info.width,
      opacity: 1,
    });
  }, 100);

  useEffect(() => {
    setTimeout(() => {
      getDomInfo();
    }, 1000);
  }, [previewerProps]);

  useEffect(() => {
    window.addEventListener('resize', getDomInfo);
    return () => {
      window.removeEventListener('resize', getDomInfo);
    };
  }, []);

  return (
    <div
      className={`${classPrefix}`}
      style={{
        top: domState.top,
        left: domState.left,
        opacity: domState.opacity,
      }}
    >
      <img
        className={`${classPrefix}-icon`}
        src="https://cdn.lightwork.com.cn/img/20230113100855-0hPKvx.png"
        alt=""
      />
      <div className={`${classPrefix}-text`}>点击用浏览器的手机调试查看效果更好</div>
    </div>
  );
};

export default Tips;

type TimerType = {
  fn: Function;
  timer?: NodeJS.Timer;
};

/** 节流 */
function useThrottle(fn: Function, delay = 350, deps: DependencyList = []) {
  const { current } = useRef<TimerType>({ fn, timer: void 0 });
  useEffect(() => {
    current.fn = fn;
  }, [fn]);
  return useCallback(function f(...args) {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        current.timer = void 0;
      }, delay);
      current.fn(...args);
    }
  }, deps);
}
