import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiLink = 'http://localhost:3000'

  constructor(private http:HttpClient) { }

  signup(user:object){
    return this.http.post(`${this.apiLink}/api/signup`,user)
  }


}
