export const environment = {
    production: true,
    apiUrl: process.env["apiUrl"],
    domain: process.env["domain"],
    googleClientId: process.env["googleClientId"],
  };
  
  export const firebaseConfig = {
    apiKey: process.env["apiKey"],
    authDomain: process.env["authDomain"],
    databaseURL: process.env["databaseURL"],
    projectId: process.env["projectId"],
    storageBucket: process.env["storageBucket"],
    messagingSenderId: process.env["messagingSenderId"],
    appId: process.env["appId"],
    measurementId: process.env["measurementId"],
  };
  
  export const socketUrl = process.env["socketUrl"];
  
  export const awsCredentials = {
    accessKey: process.env["Access_key"],
    secretKey: process.env["Secret_key"],
  };
  