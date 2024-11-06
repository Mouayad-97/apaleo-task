import { ColumnFeature } from './column-feature.type';

export class Column<M> {
  name: keyof M & string;
  displayName: string;
  filterName: string;
  filter?: boolean;
  sortable?: boolean;
  bindKey?: string;

  constructor(
    name: keyof M & string,
    displayName?: string,
    ...features: ColumnFeature<M>[]
  ) {
    this.name = name;
    this.displayName = displayName ?? name;
    this.filterName = `${name}_not_filter`;
    features.forEach((feature) => feature(this));
  }
}
