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
  private unreadMessagesSubject = new BehaviorSubject<{[userId: string]: number}>({});
  private currentChatPartner: string | null = null;


  constructor(private socket: Socket) {
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('online-users', (users: string[]) => {
      this.onlineUsersSubject.next(users);
    })

    this.socket.on('unreadMessages', ({ senderId, count }:{senderId:string,count:number}) => {
      this.updateUnreadCount(senderId,count)
    });



    this.socket.on('message', (message: directChatI) => {
      if (message.senderId._id === this.currentChatPartner) {
        this.markMessagesAsRead(message.receiverId._id, message.senderId._id);
      } else {
        // Otherwise, update the unread count
        this.getUnreadMessageCount(message.receiverId._id, message.senderId._id);
      }
      // if (message.senderId && message.senderId._id) {
      //   this.getUnreadMessageCount(message.receiverId._id, message.senderId._id);
      // }
    });

  }

  setCurrentChatPartner(userId: string | null) {
    this.currentChatPartner = userId;
  }

  getCurrentChatPartner(): string | null {
    return this.currentChatPartner;
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
    console.log('Sending message:', { senderId, receiverId, message });
    this.socket.emit('sendMessage', { senderId, receiverId, message });

  }

  updateUnreadCount(senderId: string, count: number) {
    const currentUnread = this.unreadMessagesSubject.value;
    this.unreadMessagesSubject.next({
      ...currentUnread,
      [senderId]: count
    });
  }

  getLastMessage(): Observable<directChatI> {
    return this.socket.fromEvent<directChatI>('message');
  }

  getAllMessages(): Observable<directChatI[]> {
    return this.socket.fromEvent<directChatI[]>('allMessages');
  }

  markMessagesAsRead(userId: string, otherUserId: string){
    this.socket.emit('markMessagesAsRead', { userId, otherUserId });

    const currentUnread = this.unreadMessagesSubject.value;
    this.unreadMessagesSubject.next({
      ...currentUnread,
      [otherUserId]: 0
    });
  }

  getUnreadMessageCount(userId: string, otherUserId: string) {
    this.socket.emit('getUnreadMessageCount', { userId, otherUserId });
  }

  getUnreadCounts(): Observable<{[userId: string]: number}>{
    return this.unreadMessagesSubject.asObservable()
  }

}