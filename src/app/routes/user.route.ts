import { Routes } from '@angular/router';
import { SignupComponent } from '../components/user/signup/signup.component';
import { HomeComponent } from '../components/user/home/home.component';
import { LoginComponent } from '../components/user/login/login.component';
import { userAuthGuard } from '../guards/user/user-auth.guard';
import { userNotAuthGuard } from '../guards/user/user-not-auth.guard';
import { OtpComponent } from '../components/user/otp/otp.component';
import { otpGuardGuard } from '../guards/user/otp-guard.guard';


export const userRoute: Routes = [
    {
        path:'signup',
        component:SignupComponent,
        canActivate:[userNotAuthGuard]
    },
    {
        path:'login',
        component:LoginComponent,
        canActivate:[userNotAuthGuard]
    },
    {
        path:'',
        component:HomeComponent,
        canActivate:[userAuthGuard]
    },
    {
        path:'otp',
        component:OtpComponent,
        canActivate:[otpGuardGuard]
    },
];
