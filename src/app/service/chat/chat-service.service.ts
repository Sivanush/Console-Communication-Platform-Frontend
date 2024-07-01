import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import { environment } from '../../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  constructor(private socket:Socket, private http:HttpClient) { }

  apiUrl = environment.apiUrl

  // joinDirectChat(userId:string,friendId:string){
  //   this.socket.emit('joinChat',{userId,friendId})
  // }
  joinDirectChat(userId: string, friendId: string) {
    this.http.post(`${this.apiUrl}/join-direct-chat`, { userId, friendId }).subscribe({
      next:(response)=>{
        console.log('Joined chat:', response);
        this.socket.emit('joinChat', { userId, friendId });
      },
      error:(err)=>{
          console.error('Failed to join chat:', err);
      }
    })
  }

  sendDirectMessage(senderId: string, receiverId: string, message: string){
    this.socket.emit('sendMessage',{senderId, receiverId, message})
  }
}