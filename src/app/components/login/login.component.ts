import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  userForm: FormGroup
  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.userForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9@!#$%^&*_-]{8,}$/)]]
    })
  }

  

  signInWithGoogle() {
    throw new Error('Method not implemented.');
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
      this.userService.login(user).subscribe((response) => {
        console.log(response);
        this.token = response?.token
        localStorage.setItem('token', this.token)
        this.router.navigate([''])
      })
    }
  }

}
