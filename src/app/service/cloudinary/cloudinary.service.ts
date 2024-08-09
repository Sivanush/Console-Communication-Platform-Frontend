// // import { HttpClient } from '@angular/common/http';
// // import { Injectable } from '@angular/core';
// // import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
// // import { Observable } from 'rxjs';
// // import { map } from 'rxjs/operators';


// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class CloudinaryService {

// //   private cloudinary: Cloudinary
// //   private cloudName = 'dgpcd5c0d';
// //   private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

// //   constructor(private http: HttpClient) {
// //     this.cloudinary = new Cloudinary({
// //       cloud: {
// //         cloudName: 'dgpcd5c0d',
// //         apiKey: '214699356353973',
// //         apiSecret: 'AgxVndp621yUcbQbdUNcB7I1h4g'
// //       }
// //     });
// //   }


// //   uploadImage(file: File): Observable<string> {
// //     const formData = new FormData();
// //     formData.append('file', file);;

// //     return this.http.post<any>(this.uploadUrl, formData).pipe(
// //       map(response => response.secure_url)
// //     );
// //   }
// // }









// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Cloudinary } from '@cloudinary/url-gen';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class CloudinaryService {

//   private cloudName = 'dgpcd5c0d';
//   private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

//   constructor(private http: HttpClient,private Http:HttpClient) {}

//   uploadImage(file: File): Observable<string>  {
//     const formData = new FormData();
//     formData.append('file', file);

//     // return this.http.post<any>(this.uploadUrl, formData).pipe(
//     //   map(response => response.secure_url)
//     // );
//     return this.http.post(this.uploadUrl, formData).pipe(
//       map((response: any) => {
//         if (response.secure_url) {
//           console.log('Upload successful', response);
//           return response.secure_url;
//         }
//       })
//     );
//   }
// }
