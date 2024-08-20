const fs = require('fs');
const path = require('path');

// Define the path to the environments directory
const environmentsDir = path.join(__dirname, 'src', 'environments');

// Check if the environments directory exists, and create it if it doesn't
if (!fs.existsSync(environmentsDir)) {
  fs.mkdirSync(environmentsDir, { recursive: true });
}

const environmentFile = `
export const environment = {
  production: ${process.env.NODE_ENV === 'production'},
  apiUrl: '${process.env.NG_APP_API_URL}',
  domain: '${process.env.NG_APP_DOMAIN}',
  googleClientId: '${process.env.NG_APP_GOOGLE_CLIENT_ID}'
};

export const firebaseConfig = {
  apiKey: '${process.env.NG_APP_FIREBASE_API_KEY}',
  authDomain: '${process.env.NG_APP_FIREBASE_AUTH_DOMAIN}',
  databaseURL: '${process.env.NG_APP_FIREBASE_DATABASE_URL}',
  projectId: '${process.env.NG_APP_FIREBASE_PROJECT_ID}',
  storageBucket: '${process.env.NG_APP_FIREBASE_STORAGE_BUCKET}',
  messagingSenderId: '${process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID}',
  appId: '${process.env.NG_APP_FIREBASE_APP_ID}',
  measurementId: '${process.env.NG_APP_FIREBASE_MEASUREMENT_ID}'
};

export const socketUrl = '${process.env.NG_APP_SOCKET_URL}';

export const awsCredentials = {
  accessKey: '${process.env.NG_APP_AWS_ACCESS_KEY}',
  secretKey: '${process.env.NG_APP_AWS_SECRET_KEY}'
};
`;

// Write the environment.ts and environment.prod.ts files
fs.writeFileSync(path.join(environmentsDir, 'environment.ts'), environmentFile);
fs.writeFileSync(path.join(environmentsDir, 'environment.prod.ts'), environmentFile);

console.log('Environment files generated successfully.');
