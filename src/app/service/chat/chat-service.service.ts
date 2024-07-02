import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { directChatI } from '../../interface/user/direct-chat';
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
    
      this.socket.emit('joinChat', { senderId:userId, receiverId:friendId });
  }

  sendDirectMessage(senderId: string, receiverId: string, message: string){
    this.socket.emit('sendMessage',{senderId, receiverId, message})
  }

  getLastMessages(): Observable<directChatI> {
    return this.socket.fromEvent<directChatI>('message');
  }

  getAllMessages(): Observable<directChatI[]> {
    return this.socket.fromEvent<directChatI[]>('allMessages');
  }
}