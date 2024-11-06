import { APP_INITIALIZER, Provider } from '@angular/core';
import { ConfigService, UrlService } from '@core/services';
import { forkJoin, tap } from 'rxjs';

export default {
  provide: APP_INITIALIZER,
  useFactory: (configService: ConfigService, urlService: UrlService) => {
    return () =>
      forkJoin([configService.load()]).pipe(
        tap(() => urlService.setConfigService(configService)),
        tap(() => urlService.prepareUrls())
      );
  },
  deps: [ConfigService, UrlService],
  multi: true,
} satisfies Provider;
