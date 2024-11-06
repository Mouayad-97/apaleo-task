export interface SortableColumn<M> {
  colName: keyof M & string;
  direction: 'asc' | 'desc';
}
