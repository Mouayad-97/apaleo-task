import { InjectionToken, Provider } from '@angular/core';

export const ASSETS = new InjectionToken<Assets>('ASSETS');

type Asset = { url: string; alt: string; width: number; height: number };

type AssetKey =
  | 'right-chevron'
  | 'left-chevron'
  | 'double-right-chevron'
  | 'double-left-chevron'
  | 'arrow-up'
  | 'arrow-down'
  | 'filter'
  | 'filter-clear'
  | 'search'
  | 'apaleo-logo'
  | 'check-icon'
  | 'done-icon';

export const assets: Record<AssetKey, Asset> = {
  'arrow-down': {
    url: 'assets/icons/arrow-down.svg',
    alt: 'arrow-down',
    width: 20,
    height: 20,
  },
  'arrow-up': {
    url: 'assets/icons/arrow-up.svg',
    alt: 'arrow-up',
    width: 20,
    height: 20,
  },
  'double-left-chevron': {
    url: 'assets/icons/chevron-left-double.svg',
    alt: 'double-left-chevron',
    width: 15,
    height: 15,
  },
  'double-right-chevron': {
    url: 'assets/icons/chevron-right-double.svg',
    alt: 'double-right-chevron',
    width: 15,
    height: 15,
  },
  'left-chevron': {
    url: 'assets/icons/chevron-left.svg',
    alt: 'left-chevron',
    width: 15,
    height: 15,
  },
  'right-chevron': {
    url: 'assets/icons/chevron-right.svg',
    alt: 'right-chevron',
    width: 15,
    height: 15,
  },
  filter: {
    url: 'assets/icons/filter.svg',
    alt: 'filter',
    width: 30,
    height: 30,
  },
  'filter-clear': {
    url: 'assets/icons/filter-clear.svg',
    alt: 'filter-clear',
    width: 30,
    height: 30,
  },
  search: {
    url: 'assets/icons/search.svg',
    alt: 'search',
    width: 20,
    height: 20,
  },
  'apaleo-logo': {
    url: 'assets/images/apaleo-logo.png',
    alt: 'apaleo-logo',
    width: 100,
    height: 100,
  },
  'check-icon': {
    url: 'assets/icons/check-icon.svg',
    alt: 'check',
    width: 20,
    height: 20,
  },
  'done-icon': {
    url: 'assets/images/done.svg',
    alt: 'done',
    width: 200,
    height: 200,
  },
} as const;

type Assets = typeof assets;

export const assetProvider = {
  provide: ASSETS,
  useValue: assets,
} satisfies Provider;
