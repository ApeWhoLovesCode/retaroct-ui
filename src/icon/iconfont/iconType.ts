export type IconName =
  | 'add'
  | 'add-circle'
  | 'arrow-down'
  | 'ashbin'
  | 'arrow-right'
  | 'browse'
  | 'bottom'
  | 'back'
  | 'bad'
  | 'camera'
  | 'chart-bar'
  | 'attachment'
  | 'code'
  | 'close'
  | 'check-item'
  | 'comment'
  | 'copy'
  | 'search'
  | 'setting'
  | 'user';

export enum IconEnum {
  'add' = 'add',
  'add-circle' = 'add-circle',
  'arrow-down' = 'arrow-down',
  'ashbin' = 'ashbin',
  'arrow-right' = 'arrow-right',
  'browse' = 'browse',
  'bottom' = 'bottom',
  'back' = 'back',
  'bad' = 'bad',
  'camera' = 'camera',
  'chart-bar' = 'chart-bar',
  'attachment' = 'attachment',
  'code' = 'code',
  'close' = 'close',
  'check-item' = 'check-item',
  'comment' = 'comment',
  'copy' = 'copy',
  'search' = 'search',
  'setting' = 'setting',
  'user' = 'user',
}

export type IconObjType = {
  [key in IconEnum]: string;
};
