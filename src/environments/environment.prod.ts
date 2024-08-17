export const environment = {
    production: true,
    apiUrl: process.env["API_URL"],
    domain: process.env["DOMAIN"],
    googleClientId: process.env["GOOGLE_CLIENT_ID"],
  };
  
  export const firebaseConfig = {
    apiKey: process.env["FIREBASE_API_KEY"],
    authDomain: process.env["FIREBASE_AUTH_DOMAIN"],
    databaseURL: process.env["FIREBASE_DATABASE_URL"],
    projectId: process.env["FIREBASE_PROJECT_ID"],
    storageBucket: process.env["FIREBASE_STORAGE_BUCKET"],
    messagingSenderId: process.env["FIREBASE_MESSAGING_SENDER_ID"],
    appId: process.env["FIREBASE_APP_ID"],
    measurementId: process.env["FIREBASE_MEASUREMENT_ID"],
  };
  
  export const socketUrl = process.env["SOCKET_URL"];
  
  export const awsCredentials = {
    accessKey: process.env["AWS_ACCESS_KEY"],
    secretKey: process.env["AWS_SECRET_KEY"],
  };
  