import { Component } from '@angular/core';
import { UserService } from '../../service/user/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  user = {
    username:'',
    email:'',
    password:'',
    isVerified:false
  }
  socialUser:SocialUser | null = null
  isLogin: boolean = false;

  constructor(private userService:UserService, private authService: SocialAuthService, private router: Router) {}

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



    this.authService.authState.subscribe((user)=>{
      this.socialUser = user
      this.isLogin = (user != null);
      if (this.isLogin) {
        this.user = {
          username:user.name,
          email: user.email,
          password: user.idToken ,
          isVerified:true
        }
        this.signup()
      }
    })
  }

  
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  signup(){
    this.userService.signup(this.user).subscribe((response)=>{
      console.log(response);
      this.router.navigate([''])
    })
  }


}