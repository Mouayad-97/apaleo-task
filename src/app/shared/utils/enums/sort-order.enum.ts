export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
  NONE: 'none',
} as const;

export type SortOrderType = (typeof SortOrder)[keyof typeof SortOrder];
