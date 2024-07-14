import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { directChatI } from '../../interface/user/direct-chat';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  private onlineUsersSubject = new BehaviorSubject<string[]>([]);
  private heartbeatInterval: any;

  constructor(private socket: Socket) {       
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('online-users', (users: string[]) => {
      this.onlineUsersSubject.next(users);
    });
  }

  connectUser(userId: string) {
    this.socket.emit('user-connect', userId);
    this.startHeartbeat(userId);
  }

  disconnectUser() {
    this.socket.disconnect();
    this.stopHeartbeat();
  }

  getOnlineUsers(): Observable<string[]> {
    return this.onlineUsersSubject.asObservable();
  }

  isUserOnline(userId: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.getOnlineUsers().subscribe(users => {
        observer.next(users.includes(userId));
      });
    });
  }

  private startHeartbeat(userId: string) {
    this.heartbeatInterval = setInterval(() => {
      this.socket.emit('heartbeat', userId);
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }







  joinDirectChat(userId: string, friendId: string) {
    this.socket.emit('joinChat', { senderId: userId, receiverId: friendId });
  }

  sendDirectMessage(senderId: string, receiverId: string, message: string) {
    this.socket.emit('sendMessage', { senderId, receiverId, message });
  }

  getLastMessage(): Observable<directChatI> {
    return this.socket.fromEvent<directChatI>('message');
  }

  getAllMessages(): Observable<directChatI[]> {
    return this.socket.fromEvent<directChatI[]>('allMessages');
  }
}