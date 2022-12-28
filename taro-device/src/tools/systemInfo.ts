import Taro from '@tarojs/taro'
import type { BoundingClientRectCallbackResult } from "@/utils/getEleInfo";

// 手机系统
const systemInfo = Taro.getSystemInfoSync()
// 小程序胶囊
// const menu = Taro.getMenuButtonBoundingClientRect()
const menu = {height: 0, top: 0}

/** 手机顶部导航栏高度 */
const statusBarHeight = systemInfo.statusBarHeight ?? 0

/** navbar 高度 */
const navbarH = menu.height + (menu.top - (statusBarHeight ?? 0)) * 2
/** navbar 整体高度 包括上下padding */
const navbarHeight = (statusBarHeight ?? 0) + navbarH + 5

export const tabbarInfo: {info?: BoundingClientRectCallbackResult} = {
  info: undefined
}

/** 主题颜色 红 */
export const ThemeColor = '#EB3223'
/** 主题颜色 白 */
export const ThemeBgColor = '#FFFFFF'
/** 主题颜色 黑 */
export const ThemeBlackColor = '#000'

export {
  systemInfo,
  menu,
  statusBarHeight,
  navbarH,
  navbarHeight,
}