import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRequestI } from '../../interface/user/user.model';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatusSubject.asObservable();
  private hasPendingRequests = new BehaviorSubject<boolean>(false);

  private jwtHelper = new JwtHelperService();
  private apiLink = environment.apiUrl
  private token: string | null = null;
  userId!: string | null


  constructor(private http: HttpClient, private router: Router,private socket:Socket) {
    this.token = localStorage.getItem('token');
    this.setUserIdFromToken()
    this.setupSocketListeners();
  }

  private setupSocketListeners(){
    this.socket.on('newFriendRequest',()=>{
      this.hasPendingRequests.next(true);
    })
  }


  setUserIdFromToken() {
    if (this.token) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      this.userId = decodedToken.userId
    } else {
      this.userId = null
    }
  }

  async getUserId(): Promise<string | null> {
    if (!this.userId) {
      this.setUserIdFromToken();
    }
    return this.userId;
  }

  async getEmailFromOtpToken() {
    let otpToken = localStorage.getItem('otpToken')
    if (otpToken) {
      const decodedToken = await this.jwtHelper.decodeToken(otpToken);
      return decodedToken.email
    }
  }

 

  logout() {
    this.token = null;
    this.userId = null;
    localStorage.removeItem('token');
    this.authStatusSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token')
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

  resendOtp(email: string) {
    return this.http.post<{ message: string, newOtpToken: string }>(`${this.apiLink}/resend-otp`, { email })
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


  getUserForFriends(query: string) {
    return this.http.get<{ users: User[] }>(`${this.apiLink}/search-users?query=${query}`)
  }


  sendFriendRequest(receiverId: string) {
    this.socket.emit('sendFriendRequest', { senderId:this.userId, receiverId });
    return this.http.post<{ message: string }>(`${this.apiLink}/send-request`, { receiverId })
  }

  getPendingRequestsStatus() {

    return this.hasPendingRequests.asObservable();
  }

  updatePendingRequestsStatus(status: boolean) {
    this.hasPendingRequests.next(status);
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

  getAllFriends() {
    return this.http.get<{ message: string, friends: User[] }>(`${this.apiLink}/all-friends`)
  }


  getUserData(){
    return this.http.get<User>(`${this.apiLink}/user-data`)
  }

  getUserDataForFriend(userId:string){
    return this.http.get<User>(`${this.apiLink}/user/${userId}`)
  }

  updateProfile(userData:User){  
    return this.http.post(`${this.apiLink}/update-profile`,userData)
  }

  getRandomUsers(){
    return this.http.get<User[]>(`${this.apiLink}/get-random-users`)
  }

}

