export type IconName =
  | 'xuanxiangka_fuzhi'
  | 'shangchuan'
  | 'gold'
  | 'slash'
  | 'disablecase'
  | 'remen1'
  | 'mn_shengyinwu_fill'
  | 'mn_shengyin_fill'
  | 'jianshen-daduzi-pijiudu'
  | '24gf-pause2'
  | 'xuanxiang'
  | 'gift'
  | 'ashbin'
  | 'kaishi1'
  | 'jinbi1';

export enum IconEnum {
  'xuanxiangka_fuzhi' = 'xuanxiangka_fuzhi',
  'shangchuan' = 'shangchuan',
  'gold' = 'gold',
  'slash' = 'slash',
  'disablecase' = 'disablecase',
  'remen1' = 'remen1',
  'mn_shengyinwu_fill' = 'mn_shengyinwu_fill',
  'mn_shengyin_fill' = 'mn_shengyin_fill',
  'jianshen-daduzi-pijiudu' = 'jianshen-daduzi-pijiudu',
  '24gf-pause2' = '24gf-pause2',
  'xuanxiang' = 'xuanxiang',
  'gift' = 'gift',
  'ashbin' = 'ashbin',
  'kaishi1' = 'kaishi1',
  'jinbi1' = 'jinbi1',
}

export type IconObjType = {
  [key in IconEnum]: string;
};
