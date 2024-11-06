export type RecursiveKeys<T> = T extends object
  ? {
      [K in keyof T]:
        | K
        | (T[K] extends object
            ? `${K & string}.${RecursiveKeys<T[K]> & string}`
            : K);
    }[keyof T]
  : T;
