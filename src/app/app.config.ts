import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { userRoute } from './routes/user.route';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
// import { firebaseConfig } from '../environments/environment.prod';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getDatabase } from '@angular/fire/database';
import { provideDatabase } from '@angular/fire/database';

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

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: firebaseConfig },
    provideRouter(routes),
    provideRouter(userRoute),
    provideHttpClient(),
    provideAnimations(),
    MessageService,
    BrowserModule,
    BrowserAnimationsModule,

    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideDatabase(() => getDatabase()),
  ]
};
