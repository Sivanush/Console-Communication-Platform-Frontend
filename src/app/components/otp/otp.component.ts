import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputOtpModule } from 'primeng/inputotp';
import { UserService } from '../../service/user/user.service';
import { ToastService } from '../../service/toster/toster-service.service';
import { Subscription, interval } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule, InputOtpModule, ToastModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent {
  otpValue: any;

  counter: number = 60;
  private timerSubscription: Subscription | null = null;
  

  constructor(private userService:UserService, private toster:ToastService, private router:Router) {
    
  }


  ngOnInit(): void {
    this.startCountdown();
  }

  
  startCountdown():void {
    this.timerSubscription = interval(1000).subscribe(()=>{
      if (this.counter>0) {
        this.counter--
      } else {
        this.stopCountdown();
      }
    })
  }

  stopCountdown(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }



  resendOtp(): void {
    if (this.counter === 0) {
      this.counter = 60;  
      this.startCountdown();  
      
      console.log('OTP resent');
    }
  }



  ngOnDestroy(): void {
    this.stopCountdown(); 
  }





  verificationOtp(){
    let otpToken = localStorage.getItem('otpToken')
    console.log(otpToken)

    this.userService.otpVerification(this.otpValue,otpToken).subscribe({
      next:async(response)=>{
        console.log(response);
        this.toster.showSuccess('Success',response.message)
        setTimeout(() => {
          this.router.navigate(['login'])
        }, 2000);
      },
      error:(err)=>{
        console.log(err);
        this.toster.showError('Error',err.error.message)
      }
    })
  }

}
