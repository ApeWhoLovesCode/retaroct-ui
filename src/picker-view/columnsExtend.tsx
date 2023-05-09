import { useMemo } from 'react';

import type { PickerColumn, PickerColumnOption, PickerViewProps, PickerValueExtend } from './type';

type KeysProps = {
  textKey: string;
  valueKey: string;
  childrenKey: string;
};

function useColumnsFn(options: PickerViewProps['columns'], keys: KeysProps) {
  const { textKey, valueKey, childrenKey } = keys;
  const dataType = useMemo(() => {
    const firstColumn = options![0] || {};

    if (typeof firstColumn === 'object') {
      // 联级
      if (childrenKey in firstColumn) {
        return 'cascade';
      }
      return 'object';
    }
    // 单列
    return 'plain';
  }, [options, childrenKey]);

  const depth = useMemo(() => {
    let depth = 0;
    function traverse(options: PickerViewProps['columns'], currentDepth: number) {
      if (currentDepth > depth) depth = currentDepth;
      const nextDepth = currentDepth + 1;
      options!.forEach((option) => {
        if (option[childrenKey]) {
          traverse(option[childrenKey], nextDepth);
        }
      });
    }
    traverse(options, 1);
    return depth;
  }, [options, childrenKey]);

  if (dataType !== 'cascade') return options;

  return (selected: string[]) => {
    const columns: PickerColumnOption[][] = [];
    let currentOptions = options as PickerColumn<PickerColumnOption>[];
    let i = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const item = currentOptions.map((option) => ({
        [textKey]: option[textKey],
        [valueKey]: option[valueKey] ?? option[textKey],
      })) as any;
      columns.push(item);
      let x = selected[i];
      let targetOptions = currentOptions.find(
        (option) => (option[valueKey] ?? option[textKey]) === x,
      );
      // 将当前项
      if (!targetOptions || !targetOptions[childrenKey]) {
        x = item[0][valueKey] ?? item[0][textKey];
        targetOptions = currentOptions.find(
          (option) => (option[valueKey] ?? option[textKey]) === x,
        );
      }
      if (!targetOptions || !targetOptions[childrenKey]) break;
      currentOptions = targetOptions[childrenKey];
      i++;
    }
    while (i < depth - 1) {
      columns.push([] as any);
      i++;
    }
    return columns;
  };
}

function withCache<T>(generate: () => T) {
  let cache: T | null = null;
  return () => {
    if (cache === null) {
      cache = generate();
    }
    return cache;
  };
}

export function generateColumnsExtend(
  rawColumns: PickerViewProps['columns'] | ((value: string[]) => PickerViewProps['columns']),
  keys: KeysProps,
  val: string[],
) {
  const { textKey, valueKey } = keys;

  const columns = withCache(() => {
    let cls = typeof rawColumns === 'function' ? rawColumns(val) : rawColumns;
    if (!Array.isArray(cls![0])) cls = [cls!];
    return cls!.map((column) =>
      (column as PickerColumnOption | PickerColumn<PickerColumnOption>).map((item: any) => {
        if (typeof item === 'string') return { [textKey]: item, [valueKey]: item };
        if (!(valueKey in item)) item[valueKey] = item[textKey];
        return item;
      }),
    );
  });

  const items = withCache(() => {
    return val.map((v, index) => {
      const column = columns()[index];
      if (!column) return null;
      return column.find((item: any) => item[valueKey] === v) ?? undefined;
    });
  });

  const indexes = withCache(() => {
    return val.map((v, index) => {
      const column = columns()[index];
      if (!column) return null;
      return column.findIndex((item: any) => item[valueKey] === v) ?? null;
    });
  });

  const result: PickerValueExtend = {
    get columns() {
      return columns();
    },
    get items() {
      return items();
    },
    get indexes() {
      return indexes();
    },
  };
  return result;
}

export function useColumnsExtend(
  columns: PickerViewProps['columns'],
  keys: KeysProps,
  value: string[],
) {
  const formatColumns = useColumnsFn(columns, keys);

  return useMemo(() => generateColumnsExtend(formatColumns, keys, value), [columns, keys, value]);
}
