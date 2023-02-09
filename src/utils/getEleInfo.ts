import { createSelectorQuery } from '@tarojs/taro';
// import { BoundingClientRectCallbackResult } from '@tarojs/taro/types/api/wxml';

export type BoundingClientRectCallbackResult = {
  /** 节点的下边界坐标 */
  bottom: number;
  /** 节点的 dataset */
  // dataset: TaroGeneral.IAnyObject;
  /** 节点的高度 */
  height: number;
  /** 节点的 ID */
  id: string;
  /** 节点的左边界坐标 */
  left: number;
  /** 节点的右边界坐标 */
  right: number;
  /** 节点的上边界坐标 */
  top: number;
  /** 节点的宽度 */
  width: number;
};

/** 获取dom元素的信息 */
const getEleInfo = (selector: string): Promise<BoundingClientRectCallbackResult | null> => {
  return new Promise((resolve) => {
    const query = createSelectorQuery();
    query.select(selector).boundingClientRect();
    query.exec((res) => {
      resolve(res[0]);
    });
  });
};
export default getEleInfo;

/** 获取所有dom元素的信息 */
export const getAllEleInfo = (
  selector: string,
): Promise<BoundingClientRectCallbackResult[] | null> => {
  return new Promise((resolve) => {
    const query = createSelectorQuery();
    query.selectAll(selector).boundingClientRect();
    query.exec((res) => {
      resolve(res[0]);
    });
  });
};

/** 获取scrollTop值 */
export const getEleScrollInfo = (selector: string): Promise<any[] | null> => {
  return new Promise((resolve) => {
    const query = createSelectorQuery();
    // 节点必须是 scroll-view 或者 viewport
    query.select(selector).scrollOffset();
    query.exec((res) => {
      resolve(res[0]);
    });
  });
};

/** 获取节点的相关信息 */
export const getFieldsInfo = (
  selector: string,
  fields: Taro.NodesRef.Fields,
): Promise<any | null> => {
  return new Promise((resolve) => {
    const query = createSelectorQuery();
    query.select(selector).fields(fields);
    query.exec((res) => {
      resolve(res[0]);
    });
  });
};

/** 获取节点的上下文 */
export const getNodeContext = (selector: string): Promise<any | null> => {
  return new Promise((resolve) => {
    createSelectorQuery()
      .select(selector)
      .context((res) => {
        resolve(res?.context);
      })
      .exec();
  });
};
