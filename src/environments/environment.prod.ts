// export const environment = {
//     production: true,
//     apiUrl: process.env['API_URL'] || 'https://default-production-api-url.com/api',
//     domain: process.env['DOMAIN'] || 'https://default-production-domain.com',
//     googleClientId: process.env['GOOGLE_CLIENT_ID'] || 'default-google-client-id'
//   };

//   export const firebaseConfig = {
//     apiKey: process.env['FIREBASE_API_KEY'] || 'default-firebase-api-key',
//     authDomain: process.env['FIREBASE_AUTH_DOMAIN'] || 'default-firebase-auth-domain',
//     databaseURL: process.env['FIREBASE_DATABASE_URL'] || 'default-firebase-database-url',
//     projectId: process.env['FIREBASE_PROJECT_ID'] || 'default-firebase-project-id',
//     storageBucket: process.env['FIREBASE_STORAGE_BUCKET'] || 'default-firebase-storage-bucket',
//     messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'] || 'default-firebase-messaging-sender-id',
//     appId: process.env['FIREBASE_APP_ID'] || 'default-firebase-app-id',
//     measurementId: process.env['FIREBASE_MEASUREMENT_ID'] || 'default-firebase-measurement-id'
//   };

//   export const socketUrl = process.env['SOCKET_URL'] || 'https://default-production-socket-url.com';

//   export const awsCredentials = {
//     accessKey: process.env['AWS_ACCESS_KEY'] || 'default-access-key',
//     secretKey: process.env['AWS_SECRET_KEY'] || 'default-secret-key'
//   };


 
export const environment = {

  production: true,
  apiUrl: process.env.API_URL,
  domain: process.env.DOMAIN,
  googleClientId: process.env.GOOGLE_CLIENT_ID
};

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

export const socketUrl = process.env.SOCKET_URL

export const awsCredentials = {
  accessKey: process.env.AWS_ACCESS_KEY,
  secretKey: process.env.AWS_SECRET_KEY
}
