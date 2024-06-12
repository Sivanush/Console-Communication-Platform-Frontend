import { Routes } from '@angular/router';
import { SignupComponent } from '../components/signup/signup.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';

export const userRoute: Routes = [
    {
        path:'signup',
        component:SignupComponent
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'',
        component:HomeComponent
    },

];
