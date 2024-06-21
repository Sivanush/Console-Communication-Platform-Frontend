import { Injectable } from '@angular/core';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { signInWithPopup } from '@angular/fire/auth';
import { ToastService } from '../toster/toster-service.service';
import { Router } from '@angular/router';
import { FirebaseApp } from '@angular/fire/app';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})



export class GoogleAuthService {

  private auth: Auth;

  constructor(private toster: ToastService, private router: Router, private firebaseApp: FirebaseApp, private userService: UserService) {
    this.auth = getAuth(firebaseApp)
  }


  async loginWithGoogle() {
    signInWithPopup(this.auth, new GoogleAuthProvider())
      .then(async googleResponse => {

        this.userService.googleAuthentication(googleResponse.user).subscribe({
          next: (response) => {
            localStorage.setItem('token', response?.token)
            console.log('Login successful:', response);
            this.toster.showSuccess('Success', 'Logged in successfully with Google!')

            this.router.navigate([''])
          },
          error:(err)=>{
            console.log('Error', err?.message);
            this.toster.showError('Error', err?.message)

          }
        })



      }).catch(err => {
        console.log('Login Error:', err);
        this.toster.showError('Error', 'Failed to log in with Google. Please try again!')
      });
  }
}

