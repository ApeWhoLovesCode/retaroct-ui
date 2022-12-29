// import Taro from "@tarojs/taro";
import { useCallback, useState } from 'react';

const useRender = () => {
  const [isRender, setIsRender] = useState(false);
  /** 页面show时render页面 */
  const pageShowRender = () => {
    // return Taro.useDidShow(() => {
    //   setIsRender(v => !v);
    // })
  };
  return {
    isRender,
    /** 手动render页面 */
    renderFn: useCallback(() => {
      setIsRender((v) => !v);
    }, []),
    pageShowRender,
  };
};

export default useRender;
