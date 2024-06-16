import { ApplicationConfig, ChangeDetectorRef, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { userRoute } from './routes/user.route';
import { provideHttpClient } from '@angular/common/http';
// import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
// import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideRouter(userRoute),
    provideHttpClient(),
    provideAnimations(),
    MessageService,
    BrowserModule,
    BrowserAnimationsModule
    
    // {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: true,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider(
    //           '53056005811-4a5d0re47qnuhud5l9m8ssvp77nhnvtk.apps.googleusercontent.com'
    //         )
    //       }
    //     ]
    //   } as SocialAuthServiceConfig,
    // },
  ]
};
