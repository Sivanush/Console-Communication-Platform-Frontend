import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { User } from '../../interface/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  private jwtHelper = new JwtHelperService();
  private apiLink = environment.apiUrl
  private token: string | null = null;
  

  constructor(private http:HttpClient,private router:Router) { }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

 





  signup(user:object):Observable<{message:string ,otpToken:string}>{
    return this.http.post<{ message: string, otpToken:string }>(`${this.apiLink}/signup`,user)
  }


  login(user:object){
    return this.http.post<{
      result(arg0: string, result: any): unknown;token:string,message:string
}>(`${this.apiLink}/login`,user)
  }


  otpVerification(otp:number,otpToken:string|null){
    const data = { otp,otpToken }; 
    return this.http.post<{token:string,message:string}>(`${this.apiLink}/otp`,data)
  }

  googleAuthentication(user:object){
    console.log(user);
    return this.http.post<{message:string,token:string}>(`${this.apiLink}/googleAuth`,user)
  }





}
