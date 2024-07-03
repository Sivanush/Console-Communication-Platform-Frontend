import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { User } from '../../interface/user/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

 
  constructor(private http:HttpClient,private router:Router) { }

  private jwtHelper = new JwtHelperService();
  private apiUrl = environment.apiUrl
  private token: string | null = null;


  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('adminToken');
    }
    return this.token;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }



  login(adminData:object){
    console.log(JSON.stringify(adminData));
    
    return this.http.post<{message:string,result:string}>(`${this.apiUrl}/admin/login`,adminData)
  }


  getUser(){
    return this.http.get<{result: User[];}>(`${this.apiUrl}/admin/getUsers`)
  }


  toggleUserBlock(userId:string){
    return this.http.post(`${this.apiUrl}/admin/block/${userId}`,{})
  }
}
