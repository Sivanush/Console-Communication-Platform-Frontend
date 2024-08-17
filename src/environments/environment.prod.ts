export const environment = {
    production: true,
    apiUrl: process.env.API_URL || 'http://localhost:3000/api',
    domain: process.env.DOMAIN || 'http://localhost:4200',
    googleClientId: process.env.GOOGLE_CLIENT_ID || 'default-client-id'
  };
  
  export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || 'default-api-key',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'default-auth-domain',
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'default-database-url',
    projectId: process.env.FIREBASE_PROJECT_ID || 'default-project-id',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'default-storage-bucket',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'default-messaging-sender-id',
    appId: process.env.FIREBASE_APP_ID || 'default-app-id',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'default-measurement-id'
  };
  
  export const socketUrl = process.env.SOCKET_URL || 'http://localhost:3000';
  
  export const awsCredentials = {
    accessKey: process.env.AWS_ACCESS_KEY || 'default-access-key',
    secretKey: process.env.AWS_SECRET_KEY || 'default-secret-key'
  };
  