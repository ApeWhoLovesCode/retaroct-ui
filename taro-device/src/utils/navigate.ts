import Taro from "@tarojs/taro"
import TabbarModel from "@/model/tabbarModel";

/** 回到tab页面 tabIndex: tab的索引 */
const switchTab = (tabIndex: number = 0) => {
  const pages = Taro.getCurrentPages()
  // 当前已经在tabbar页面
  if(pages.length === 1 && pages[0].route === 'pages/index/index') {
    return
  }
  // 页面栈大于1 且已经有tabbar页了
  if(pages.length > 1 && pages[0].route === 'pages/index/index') {
    TabbarModel.switchTab = tabIndex
    setTimeout(() => {
      Taro.navigateBack({
        delta: pages.length,
      })
    }, 10);
  } else { // 当前页面栈还没有tabbar页面
    TabbarModel.tabIndex = tabIndex
    Taro.redirectTo({ url: `/pages/index/index` })
  }
}

export {
  switchTab
}