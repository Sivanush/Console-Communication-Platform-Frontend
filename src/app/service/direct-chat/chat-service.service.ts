import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { directChatI } from '../../interface/user/direct-chat';
import { User } from '../../interface/user/user.model';
import { S3 } from 'aws-sdk';
import { awsCredentials } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  private onlineUsersSubject = new BehaviorSubject<string[]>([]);
  private heartbeatInterval: any;
  private unreadMessagesSubject = new BehaviorSubject<{[userId: string]: number}>({});
  private currentChatPartner: string | null = null;
  private friendsStatus = new BehaviorSubject<any>([]);


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



    this.socket.on('friendsStatus',(friends:directChatI[])=>{
      this.friendsStatus.next(friends);
    })

    this.socket.on('userStatusUpdate', ({ userId, status }:{userId:string,status:string}) => {
      const currentFriends = this.friendsStatus.value;
      const updatedFriends = currentFriends.map((friend: { _id: string; }) => 
          friend._id === userId ? { ...friend, status } : friend
      );
      this.friendsStatus.next(updatedFriends);
  });


  }








  // async uploadToCloudinary(file: File) {
  //   return new Promise((res, rej) => {
  //     const formData = new FormData();
  //     formData.append('file', file);
  //     formData.append('upload_preset', cloudinaryCredentials.uploadPreset);
  //     formData.append('api_key', cloudinaryCredentials.apiKey);
  
  //     const xhr = new XMLHttpRequest();
  //     xhr.open('POST', `https://api.cloudinary.com/v1_1/dgpcd5c0d/image/upload`, true);
  
  //     xhr.onload = function () {
  //       if (this.status === 200) {
  //         const response = JSON.parse(this.response);
  //         res(response.secure_url);
  //       } else {
  //         rej(new Error('Upload failed'));
  //       }
  //     };
  
  //     xhr.send(formData);
  //   });
  // }

  async uploadImage(file: File): Promise<string> {
    return this.uploadFile(file);
  }

  async uploadVideo(file: File): Promise<string> {
    return this.uploadFile(file);
  }


  // private async uploadFile(file: File, resourceType: 'image' | 'video'): Promise<string> {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('upload_preset', this.uploadPreset);
  //   formData.append('api_key', this.apiKey);



  //   const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/upload`;

  //   try {
  //     const response = await axios.post(url, formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' }
  //     });
  //     // return response.data.secure_url
  //     const baseUrl = response.data.secure_url;
  //     return `${baseUrl.replace('/upload/', `/upload/q_${1}/`)}`;
  //   } catch (error) {
  //     console.error('Upload failed:', error);
  //     throw error;
  //   }
  // }


  uploadFile(file: File): Promise<string>  {
    // const fileName = folderPath ? `${folderPath}/${file.name}` : file.name;
    const fileName = file.name;
    const params = {
      Bucket: 'discord-bucket-7',
      Key: fileName,
      Body: file,
      // ACL: 'public-read',  // Optional: Set file permissions
      ContentType: file.type,
    };

    // return this.s3.upload(params).promise();
    return this.s3.upload(params).promise().then((data) => {
      // Return the URL of the uploaded file
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

  getFriendsStatus(userId: string): Observable<{  friends: User[] }> {
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
    console.log('✅✅✅✅✅✅✅✅✅');
    console.log(fileUrl,fileType);
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