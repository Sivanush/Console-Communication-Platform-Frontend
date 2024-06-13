import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private jwtHelper = new JwtHelperService();
  private apiLink = 'http://localhost:3000'
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





  signup(user:object){
    return this.http.post(`${this.apiLink}/api/signup`,user)
  }


  login(user:object){
    return this.http.post<{token:string}>(`${this.apiLink}/api/login`,user)
  }
}
