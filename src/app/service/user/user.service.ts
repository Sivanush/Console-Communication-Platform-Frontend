import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { User, UserRequestI } from '../../interface/user/user.model';
// import { User } from '../../interface/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private jwtHelper = new JwtHelperService();
  private apiLink = environment.apiUrl
  private token: string | null = null;
  userId!: string|null


  constructor(private http: HttpClient, private router: Router) {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.userId = this.getUserIdFromToken();
    }
   }



   private getUserIdFromToken() {
    if (this.token) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
    return decodedToken ? decodedToken.userId : null;
    }
  }

  getUserId(): string | null {
    return this.userId;
  }



  logout() {
    this.token = null;
    this.userId = null; 
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







  signup(user: object): Observable<{ message: string, otpToken: string }> {
    return this.http.post<{ message: string, otpToken: string }>(`${this.apiLink}/signup`, user)
  }


  login(user: object) {
    return this.http.post<{ result(arg0: string): unknown; token: string, message: string }>(`${this.apiLink}/login`, user)
  }


  otpVerification(otp: number, otpToken: string | null) {
    const data = { otp, otpToken };
    return this.http.post<{ token: string, message: string }>(`${this.apiLink}/otp`, data)
  }

  googleAuthentication(user: object) {
    console.log(user);
    return this.http.post<{ message: string, token: string }>(`${this.apiLink}/googleAuth`, user)
  }


  forgetPassword(email: string) {
    return this.http.post<{ message: string }>(`${this.apiLink}/forget-password`, email)
  }

  resetPassword(token: string | null, newPassword: string) {
    return this.http.post(`${this.apiLink}/reset-password`, { token, newPassword })
  }


  addFriends(query: string) {
    return this.http.get<{ users: User[] }>(`${this.apiLink}/search-users?query=${query}`)
  }


  sendFriendRequest(receiverId: string) {

    return this.http.post<{ message: string }>(`${this.apiLink}/send-request`, { receiverId })
  }


  listPendingFriendRequest() {
    return this.http.get<{ message: string, requests: UserRequestI[] }>(`${this.apiLink}/pending-request`)
  }


  acceptFriendRequest(requestId: string) {
    return this.http.post<{ message: string }>(`${this.apiLink}/accept-request`, { requestId })
  }


  rejectFriendRequest(requestId: string) {
    return this.http.post<{ message: string }>(`${this.apiLink}/reject-request`, { requestId })
  }

  getAllFriends(){
    return this.http.get<{ message: string, friends: User[] }>(`${this.apiLink}/all-friends`)
  }
}

