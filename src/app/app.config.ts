import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { userRoute } from './routes/user.route';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
// import { firebaseConfig } from '../environments/environment.prod';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getDatabase } from '@angular/fire/database';
import { provideDatabase } from '@angular/fire/database';
import { adminRoute } from './routes/admin.route';
import { UserAuthInterceptor } from './interceptor/userAuthInterceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { userReducer } from './store/user-listing/user.reducer';
import { userEffects } from './store/user-listing/user.effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const firebaseConfig = {
  apiKey: "AIzaSyDVmVRn5JBIuKonN9j7r6fTCxhKnCdS3cA",
  authDomain: "console-chat-c7d63.firebaseapp.com",
  databaseURL: "https://console-chat-c7d63-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "console-chat-c7d63",
  storageBucket: "console-chat-c7d63.appspot.com",
  messagingSenderId: "694145689288",
  appId: "1:694145689288:web:974310bf408678829b67fd",
  measurementId: "G-6T1826KL9W"
};

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: firebaseConfig },
    provideRouter(routes),
    provideRouter(userRoute),
    provideRouter(adminRoute),
    provideHttpClient(),
    provideAnimations(),
    provideHttpClient(withInterceptors([UserAuthInterceptor])),
    MessageService,
    BrowserModule,
    BrowserAnimationsModule,
    ConfirmationService,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideDatabase(() => getDatabase()),
    provideStore({user:userReducer}),
    provideEffects([userEffects]),
    importProvidersFrom(SocketIoModule.forRoot(config)), provideAnimationsAsync()
  ]
};
