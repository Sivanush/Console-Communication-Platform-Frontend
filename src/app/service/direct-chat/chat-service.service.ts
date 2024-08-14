import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { directChatI } from '../../interface/user/direct-chat';
import { User } from '../../interface/user/user.model';
import { S3 } from 'aws-sdk';
import { awsCredentials } from '../../../environments/environment.prod';
import { UserI } from '../../interface/server/channelChat';

export interface FriendsStatus extends User{
  _id: string;
  status: string;
}


@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  private onlineUsersSubject = new BehaviorSubject<string[]>([]);
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private unreadMessagesSubject = new BehaviorSubject<{[userId: string]: number}>({});
  private currentChatPartner: string | null = null;
  private friendsStatus = new BehaviorSubject<FriendsStatus[]>([]);

  private s3: S3;
  
  constructor(private socket: Socket) {
    this.setupSocketListeners();
    this.s3 = new S3({
      accessKeyId: awsCredentials.Access_key,
      secretAccessKey: awsCredentials.Secret_key,
      region: 'ap-south-1',
    });
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
  
    });



    this.socket.on('friendsStatus',(friends:FriendsStatus[])=>{
      this.friendsStatus.next(friends);
    })

    this.socket.on('userStatusUpdate', ({ userId, status }:{userId:string,status:string}) => {
      const currentFriends = this.friendsStatus.value;
      const updatedFriends = currentFriends.map((friend: FriendsStatus) => 
          friend._id === userId ? { ...friend, status } : friend
      );
      this.friendsStatus.next(updatedFriends);
  });


  }






  async uploadImage(file: File): Promise<string> {
    return this.uploadFile(file);
  }

  async uploadVideo(file: File): Promise<string> {
    return this.uploadFile(file);
  }



  async uploadFile(file: File): Promise<string>  {
    const fileName = file.name;
    const params = {
      Bucket: 'discord-bucket-7',
      Key: fileName,
      Body: file,
      ContentType: file.type,
    };

    return this.s3.upload(params).promise().then((data) => {
      return data.Location;
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

  getFriendsStatus(userId: string): Observable<FriendsStatus[]> {
    this.socket.emit('getFriendsStatus', userId);
    return this.friendsStatus.asObservable();
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

  sendDirectImage(senderId: string, receiverId: string, fileUrl: string, fileType: string){
    this.socket.emit('sendMessage', { senderId, receiverId, fileUrl, fileType});
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