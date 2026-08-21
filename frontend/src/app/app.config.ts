import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BaseUrlInterceptor } from './modules/base/base-url.interceptor';
import { providePrimeNG } from 'primeng/config';
import { AppPreset } from './app-preset';
import {MessageService} from 'primeng/api';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {AuthService} from './modules/user/service/auth.service';
import {AuthInterceptor} from './modules/user/service/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
      theme: {
        preset: AppPreset,
        options: {
          prefix: 'p',
          darkModeSelector: false,
          cssLayer: false,
          cssVariables: true
        }
      }
    }),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true },
    { provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true },
    provideAnimationsAsync(),
    MessageService,
    AuthService,
    AuthInterceptor
  ]
};
