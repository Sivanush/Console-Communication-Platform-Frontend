import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../service/toster/toster-service.service';
import { GoogleAuthService } from '../../service/googleAuth/google.auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, ReactiveFormsModule,ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  userForm: FormGroup
  constructor(
    private userService: UserService,
    private router: Router, 
    private fb: FormBuilder,
    private toster:ToastService,
    private googleAuthService:GoogleAuthService,
  ) {


    this.userForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9@!#$%^&*_-]{8,}$/)]]
    })
  }

  

  signInWithGoogle() {
    this.googleAuthService.loginWithGoogle()
  }

  token: string = ''

  userData = {
    username: '',
    email: '',
    password: '',
    isVerified: false
  }


  login() {
    if (this.userForm.valid) {
      const user = this.userForm.value
      this.userService.login(user).subscribe({
        next:async(response)=>{
          console.log(response);
          this.token = response?.token
          localStorage.setItem('token', this.token)
           this.toster.showSuccess('Success', response?.message);
          this.router.navigate([''])
        },
        error:(err)=>{
          console.error('Signup error:', err.error.message); 
          this.toster.showError('Error', err.error.message);
        }
      })
    }
  }

}
