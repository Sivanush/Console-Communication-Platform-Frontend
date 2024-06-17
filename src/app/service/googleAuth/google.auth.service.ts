import { Injectable } from '@angular/core';
import { getAuth , GoogleAuthProvider} from 'firebase/auth';
import { signInWithPopup } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})



export class GoogleAuthService {

  constructor() {}


  loginWithGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, new GoogleAuthProvider())
    .then(googleResponse => {
      // Successfully logged in
      console.log(googleResponse);
      // Add your logic here
      
    }).catch(err => {
      // Login error
      console.log(err);
    });
}
}

