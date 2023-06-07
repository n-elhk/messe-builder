import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID } from '@angular/core';
import { IconRegistery } from '../components/icon/icon-registery';
import { DomSanitizer } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './core/services/api/api.service';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

/** @docs-private */
export function initializeIcon(
  iconRegistery: IconRegistery,
  domSanitizer: DomSanitizer
) {
  return () => {
    const baseSvg = 'assets/icons/';

    const icons = [{ name: 'logo', path:  `${baseSvg}/logo.svg` }];

    icons.forEach(icon => {
      return iconRegistery.addSvgIcon(
        icon.name,
        domSanitizer.bypassSecurityTrustResourceUrl(icon.path)
      );
    })

  };
}

export function initializeSong(
  aelfService: ApiService,
) {
  return () => {
    return aelfService.initializeSong();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeIcon,
      deps: [IconRegistery, DomSanitizer],
      multi: true,
    },

    {
      provide: APP_INITIALIZER,
      useFactory: initializeSong,
      deps: [ApiService],
      multi: true,
    },
    { provide: LOCALE_ID, useValue: "fr-FR" }, //replace "en-US" with your locale
  ],
};
