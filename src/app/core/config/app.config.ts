import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { assetProvider } from '@core/providers';
import configInit from './config.init';
import { routes } from '../../app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    configInit,
    assetProvider,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withFetch()),
    // provideClientHydration(),
  ],
};
