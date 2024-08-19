export const environment = {
  production: false,
  apiUrl: import.meta.env.NG_APP_API_URL,
  domain: import.meta.env.NG_APP_DOMAIN,
  googleClientId: import.meta.env.NG_APP_GOOGLE_CLIENT_ID
};

export const firebaseConfig = {
  apiKey: import.meta.env.NG_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.NG_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.NG_APP_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.NG_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.NG_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.NG_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.NG_APP_FIREBASE_MEASUREMENT_ID
};

export const socketUrl = import.meta.env.NG_APP_SOCKET_URL

export const awsCredentials = {
  accessKey: import.meta.env.NG_APP_AWS_ACCESS_KEY,
  secretKey: import.meta.env.NG_APP_AWS_SECRET_KEY
}
