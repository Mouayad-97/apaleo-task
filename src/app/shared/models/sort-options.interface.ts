export interface SortOptions<M> {
  sortBy: keyof M & string;
  order: 'asc' | 'desc' | 'none';
}
