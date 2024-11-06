import { Column } from './column';

export type ColumnFeature<M> = (feature: Column<M>) => void;

export function withSort<M>(): ColumnFeature<M> {
  return (col: Column<M>) => {
    col.sortable = true;
  };
}

export function withFilter<M>(
  name?: keyof M & string,
  bindKey?: string
): ColumnFeature<M> {
  return (col: Column<M>) => {
    col.filter = true;
    col.name = name ?? col.name;
    col.bindKey = bindKey;
    col.filterName = `${name ?? col.name}_filter`;
  };
}
