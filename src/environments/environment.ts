 
export const environment = {
  production: false,
  apiUrl: process.env['NG_APP_API_URL'],
  domain: process.env['NG_APP_DOMAIN'],
  googleClientId: process.env['NG_APP_GOOGLE_CLIENT_ID']
};

export const firebaseConfig = {
  apiKey: process.env['NG_APP_FIREBASE_API_KEY'],
  authDomain: process.env['NG_APP_FIREBASE_AUTH_DOMAIN'],
  databaseURL: process.env['NG_APP_FIREBASE_DATABASE_URL'],
  projectId: process.env['NG_APP_FIREBASE_PROJECT_ID'],
  storageBucket: process.env['NG_APP_FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: process.env['NG_APP_FIREBASE_MESSAGING_SENDER_ID'],
  appId: process.env['NG_APP_FIREBASE_APP_ID'],
  measurementId: process.env['NG_APP_FIREBASE_MEASUREMENT_ID']
};

export const socketUrl = process.env['NG_APP_SOCKET_URL']

export const awsCredentials = {
  accessKey: process.env['NG_APP_AWS_ACCESS_KEY'],
  secretKey: process.env['NG_APP_AWS_SECRET_KEY']
}
