import { View } from '@tarojs/components';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { withNativeProps } from '../utils/native-props';
import useMergeProps from '../use-merge-props';
import {
  PickerColumnInstance,
  PickerViewProps,
  PickerColumnOption,
  PickerViewToolbarPosition,
} from './type';
import Column from './picker-column';
import { isObj } from '../utils/validate';
import { useColumnsExtend } from './columnsExtend';
import { classMergeBem } from '../utils/handleDom';
import Loading from '../loading';

const classPrefix = `retaroct-picker-view`;

const defaultProps = {
  itemHeight: 48,
  visibleItemCount: 5,
  toolbarPosition: 'top' as PickerViewToolbarPosition,
};
type RequireType = keyof typeof defaultProps;

const PickerView = (comProps: PickerViewProps) => {
  const props = useMergeProps<PickerViewProps, RequireType>(comProps, defaultProps);
  const {
    value,
    columns: propsColumns,
    toolbarPosition,
    showToolbar,
    columnsFieldNames,
    itemHeight,
    visibleItemCount,
    onChange,
    onConfirm,
    onCancel,
    ...ret
  } = props;

  const {
    text: textKey,
    value: valueKey,
    children: childrenKey,
  } = Object.assign(
    {
      text: 'text',
      value: 'value',
      children: 'children',
    },
    columnsFieldNames,
  );
  const columnsRef = useRef<(PickerColumnInstance | null)[]>([]);
  const [innerValue, setInnerValue] = useState<string[]>(value ?? []);

  const formatColumns = useColumnsExtend(
    propsColumns,
    { textKey, valueKey, childrenKey },
    innerValue,
  );
  const { columns, items, indexes } = formatColumns;

  /** 是否是级联数据 */
  const isCascade = useMemo(() => {
    const firstColumn = propsColumns?.[0] || {};
    return typeof firstColumn === 'object' && childrenKey in firstColumn;
  }, [propsColumns]);

  useEffect(() => {
    if (value === undefined) return;
    if (JSON.stringify(innerValue) === JSON.stringify(value)) return;
    setInnerValue(value);
  }, [value]);

  useEffect(() => {
    if (JSON.stringify(value) === JSON.stringify(innerValue)) return;
    onChange?.({ value: innerValue, selectedRows: items, indexes });
  }, [innerValue]);

  const onSelect = (colIndex: number) => {
    const newValue = [...innerValue];
    const columnVal = getColumnValue(colIndex);
    newValue[colIndex] = isObj(columnVal) ? columnVal![textKey ?? valueKey] : columnVal;
    let _indexes: number[] = indexes;
    // 级联数据
    if (colIndex + 1 < columns.length && isCascade) {
      // 处理当前列后面的列
      _indexes = indexes.slice(0, colIndex);
      _indexes[colIndex] = getColumnIndex(colIndex);
      let currentOptions = propsColumns as PickerColumnOption[];
      for (let i = 0; i <= colIndex; i++) {
        currentOptions = currentOptions.find((o) => (o[valueKey] ?? o[textKey]) === newValue[i])?.[
          childrenKey
        ];
      }
      for (let i = colIndex + 1; i < columns.length; i++) {
        newValue[i] = currentOptions[0][valueKey] ?? currentOptions[0][textKey];
        currentOptions = currentOptions[0][childrenKey];
        _indexes.push(0);
      }
      setColumnsIndex(_indexes);
    }
    setInnerValue(newValue);
  };

  const getColumnValue = (i: number) => columnsRef.current[i]?.getValue();
  const getColumnIndex = (i: number) => columnsRef.current[i]?.getCurrentIndex() ?? 0;

  /** 给所有的列滑动到对应的索引 */
  const setColumnsIndex = (indexList: number[]) => {
    indexList.forEach((index, i) => {
      columnsRef.current[i]?.setIndex(index);
    });
  };

  const renderToolbar = showToolbar ? (
    <View className={`${classPrefix}-toolbar`}>
      <View
        className={`${classMergeBem(`${classPrefix}-btn`, ['cancel'])}`}
        onClick={() => onCancel?.()}
      >
        {props.cancelButtonText ?? '取消'}
      </View>
      <View className={`${classPrefix}-title`}>{props.title}</View>
      <View
        className={`${classMergeBem(`${classPrefix}-btn`, ['confirm'])}`}
        onClick={() => onConfirm?.({ value: innerValue, selectedRows: items, indexes })}
      >
        {props.confirmButtonText ?? '确定'}
      </View>
    </View>
  ) : null;

  const renderColumns = (
    <View
      className={`${classPrefix}-columns`}
      style={{ height: +itemHeight * visibleItemCount + 'px' }}
    >
      {columns.map((item, index) => (
        <Column
          ref={(el) => (columnsRef.current[index] = el)}
          className={`${classPrefix}-columns-column`}
          key={index}
          textKey={textKey}
          valueKey={valueKey}
          value={innerValue[index]}
          itemHeight={itemHeight}
          visibleItemCount={visibleItemCount}
          initialOptions={item}
          onChange={() => onSelect(index)}
        />
      ))}
      <View
        className={`${classPrefix}-mask`}
        style={{
          backgroundSize: '100% ' + ((+itemHeight * (visibleItemCount - 1)) / 2 + 'px'),
        }}
      ></View>
      <View
        className={`${classPrefix}-frame`}
        style={{
          height: +itemHeight + 'px',
        }}
      ></View>
    </View>
  );

  return withNativeProps(
    ret,
    <View className={classPrefix}>
      {toolbarPosition === 'top' ? renderToolbar : null}
      {props.loading ? <Loading className={`${classPrefix}-loading`} /> : null}
      {renderColumns}
      {toolbarPosition === 'bottom' ? renderToolbar : null}
    </View>,
  );
};

export default PickerView;
