import { Component, OnInit} from '@angular/core';
import { UserService } from '../../../service/user/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../../service/toster/toster-service.service';
import { GoogleAuthService } from '../../../service/googleAuth/google.auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgxLoadingModule } from "ngx-loading";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  styleUrls: ['./signup.component.scss'],
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule, ToastModule,ProgressSpinnerModule,NgxLoadingModule],
})
export class SignupComponent implements OnInit {
  loading:boolean = false
  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private toster:ToastService,
    private googleAuthService:GoogleAuthService,
  ) {
    this.userForm = fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])\S{8,30}$/)]],
      confirmPassword:['',[Validators.required]]
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
  }


  loginWithGoogle(){
    this.googleAuthService.loginWithGoogle()
  }


  async signup() {
    if (this.userForm.valid) {
      this.loading = true
      const user = this.userForm.value;
      this.userService.signup(user).subscribe({
        next: async(response) => {
          this.loading = false
          console.log('Signup response:', response); 
          localStorage.setItem('otpToken',response.otpToken)
          this.toster.showSuccess('Success', response?.message)
          setTimeout(() => {
            this.router.navigate(['otp']);
          }, 2000); 
        },
        error: (err) => {
          this.loading = false
          console.error('Signup error:', err); 
          this.toster.showError('Error', err.error.error);
        }
      });
    } else {
      console.log('Form is invalid:', this.userForm); 
      this.toster.showWarn('Warning', 'Please fill all the fields')
    }
  }
}