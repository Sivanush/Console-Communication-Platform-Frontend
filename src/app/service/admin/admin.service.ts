import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { User } from '../../interface/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

 
  constructor(private http:HttpClient,private router:Router) { }

  private apiUrl = environment.apiUrl

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
