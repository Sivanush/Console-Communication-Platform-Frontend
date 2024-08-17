// export const environment = {
//     production: true,
//     apiUrl: process.env["apiUrl"],
//     domain: process.env["domain"],
//     googleClientId: process.env["googleClientId"],
//   };
  
//   export const firebaseConfig = {
//     apiKey: process.env["apiKey"],
//     authDomain: process.env["authDomain"],
//     databaseURL: process.env["databaseURL"],
//     projectId: process.env["projectId"],
//     storageBucket: process.env["storageBucket"],
//     messagingSenderId: process.env["messagingSenderId"],
//     appId: process.env["appId"],
//     measurementId: process.env["measurementId"],
//   };
  
//   export const socketUrl = process.env["socketUrl"];
  
//   export const awsCredentials = {
//     accessKey: process.env["Access_key"],
//     secretKey: process.env["Secret_key"],
//   };
  


// // export const environment = {
// //     production: true,
// //     apiUrl: process.env["apiUrl"],
// //     domain: process.env["domain"],
// //     googleClientId: process.env["googleClientId"],
// //     firebaseConfig: {
// //       apiKey: process.env["apiKey"],
// //       authDomain: process.env["authDomain"],
// //       databaseURL: process.env["databaseURL"],
// //       projectId: process.env["projectId"],
// //       storageBucket: process.env["storageBucket"],
// //       messagingSenderId: process.env["messagingSenderId"],
// //       appId: process.env["appId"],
// //       measurementId: process.env["measurementId"],
// //     },
// //     socketUrl: process.env["socketUrl"],
// //     awsCredentials: {
// //       accessKey: process.env["Access_key"],
// //       secretKey: process.env["Secret_key"],
// //     },
// //   };
  




// export const environment = {
//     production: true,
//     apiUrl: process.env["apiUrl"] || 'defaultApiUrl', // Provide a default value if needed
//     domain: process.env["domain"] || 'defaultDomain',
//     googleClientId: process.env["googleClientId"] || 'defaultGoogleClientId',
//   };
  
//   export const firebaseConfig = {
//     apiKey: process.env["apiKey"] || 'defaultApiKey',
//     authDomain: process.env["authDomain"] || 'defaultAuthDomain',
//     databaseURL: process.env["databaseURL"] || 'defaultDatabaseURL',
//     projectId: process.env["projectId"] || 'defaultProjectId',
//     storageBucket: process.env["storageBucket"] || 'defaultStorageBucket',
//     messagingSenderId: process.env["messagingSenderId"] || 'defaultMessagingSenderId',
//     appId: process.env["appId"] || 'defaultAppId',
//     measurementId: process.env["measurementId"] || 'defaultMeasurementId',
//   };
  
//   export const socketUrl = process.env["socketUrl"] || 'defaultSocketUrl';
  
//   export const awsCredentials = {
//     accessKey: process.env["accessKey"] || 'defaultAccessKey',
//     secretKey: process.env["secretKey"] || 'defaultSecretKey',
//   };
  



export const environment = {
    production: true,
    apiUrl: process.env.API_URL || 'http://localhost:3000/api',
    domain: process.env.DOMAIN || 'http://localhost:4200',
    googleClientId: process.env.GOOGLE_CLIENT_ID || 'default_google_client_id',
  };
  
  export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || 'default_firebase_api_key',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'default_firebase_auth_domain',
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'default_firebase_database_url',
    projectId: process.env.FIREBASE_PROJECT_ID || 'default_firebase_project_id',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'default_firebase_storage_bucket',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'default_firebase_messaging_sender_id',
    appId: process.env.FIREBASE_APP_ID || 'default_firebase_app_id',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'default_firebase_measurement_id'
  };
  
  export const socketUrl = process.env.SOCKET_URL || 'http://localhost:3000';
  
  export const awsCredentials = {
    accessKey: process.env.AWS_ACCESS_KEY || 'default_aws_access_key',
    secretKey: process.env.AWS_SECRET_KEY || 'default_aws_secret_key'
  };
  