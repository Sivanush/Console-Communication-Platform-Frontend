import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageI } from '../../interface/server/channelChat';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ChannelChatService {


  private channelMessages = new BehaviorSubject<MessageI[]>([])
  private currentPage = 1
  private pageSize = 20

  private cloudName = environment.CLOUDINARY_CLOUD_NAME
  private uploadPreset = environment.CLOUDINARY_UPLOADPRESET



  constructor(private socket: Socket,private http:HttpClient) {
    this.setupSocketListeners()
   
  }

  private setupSocketListeners() {
    this.socket.on('allMessages', (messages: MessageI[]) => {
      this.channelMessages.next(messages)
    })

    this.socket.on('channelMessage', (message: MessageI) => {
      this.channelMessages.next([...this.channelMessages.value, message])
    })
  }


  joinChannel(userId: string, channelId: string) {
    this.channelMessages.next([])
    this.socket.emit('joinChannel', { userId, channelId })
  }

  leaveChannel(channelId: string) {
    this.socket.emit('leaveChannel', { channelId })
    this.channelMessages.next([])
  }




  async uploadImage(file: File): Promise<string> {
    return this.uploadFile(file);
  }

  async uploadVideo(file: File): Promise<string> {
    return this.uploadFile(file);
  }



  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/${file.type.startsWith('image/') ? 'image' : 'video'}/upload`;

    return this.http.post<{ url: string }>(uploadUrl, formData)
      .toPromise()
      .then(response => response!.url)
      .catch(error => {
        console.error('Upload error:', error);
        throw new Error("Failed to upload file");
      });
  }



  sendMessage(userId: string, channelId: string, message: string) {
    this.socket.emit('sendChannelMessage', { userId, channelId, message })
  }


  sendFileMessage(userId: string, channelId: string, fileUrl: string, fileType: string, thumbnailUrl:string) {
    this.socket.emit('sendChannelMessage', { userId, channelId, fileUrl, fileType, thumbnailUrl})
  }


  getAllMessages(): Observable<MessageI[]> {
    return this.channelMessages.asObservable()
  }

  loadMoreMessages(userId: string, channelId: string): Observable<MessageI[]> {
    return new Observable(observe => {
      this.socket.emit('getMoreMessages', { userId, channelId, page: this.currentPage, pageSize: this.pageSize })
      this.socket.once('paginatedMessages', (messages: MessageI[]) => {
        observe.next(messages)
        observe.complete()
        this.currentPage++
      })

    })



  }
}
