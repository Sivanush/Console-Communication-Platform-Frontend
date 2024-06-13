import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';


import { ToastService } from '../../service/toster/toster-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  styleUrls: ['./signup.component.scss'],
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule, ToastModule],
})
export class SignupComponent implements OnInit {
  
  userForm: FormGroup;
  // socialUser: SocialUser | null = null;
  // isLogin: boolean = false;

  constructor(
    private userService: UserService,
    // private authService: SocialAuthService,
    private router: Router,
    private fb: FormBuilder,
    private toster:ToastService
  ) {
    this.userForm = fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9@!#$%^&*_-]{8,}$/)]]
    });
  }

  ngOnInit() {
    const toggleButton: HTMLElement | null = document.getElementById('dark-mode-toggle');
    const rootElement: HTMLElement | null = document.documentElement;

    toggleButton?.addEventListener('click', () => {
      if (rootElement?.classList.contains('dark')) {
        rootElement?.classList.remove('dark');
      } else {
        rootElement?.classList.add('dark');
      }
    });


    // this.authService.authState.subscribe((user) => {
    //   this.socialUser = user;
    //   this.isLogin = (user != null);
    //   if (this.isLogin) {
    //     this.signup();
    //   }
    // });
  }


  click(){
    this.toster.showSuccess('Success', 'Signup successful');
  }

  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

  // signOut(): void {
  //   this.authService.signOut();
  // }

  async signup() {
    if (this.userForm.valid) {
      const user = this.userForm.value;
      this.userService.signup(user).subscribe({
        next: async(response) => {
          console.log('Signup response:', response); 
          this.toster.showSuccess('Success', 'Signup successful');
          setTimeout(() => {
            this.router.navigate(['']);
          }, 2000); 
        },
        error: (err) => {
          console.error('Signup error:', err); 
          this.toster.showError('Error', 'Signup failed');
        }
      });
    } else {
      console.log('Form is invalid:', this.userForm); 
    }
  }
}