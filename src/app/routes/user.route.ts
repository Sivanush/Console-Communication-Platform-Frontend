import { Routes } from '@angular/router';
import { SignupComponent } from '../components/signup/signup.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';
import { userAuthGuard } from '../guards/user/user-auth.guard';
import { userNotAuthGuard } from '../guards/user/user-not-auth.guard';
import { OtpComponent } from '../components/otp/otp.component';


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
        component:OtpComponent
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    }

];
