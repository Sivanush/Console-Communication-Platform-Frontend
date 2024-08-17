import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageI } from '../../interface/server/channelChat';
import { S3 } from 'aws-sdk';
import { awsCredentials } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChannelChatService {


  private channelMessages = new BehaviorSubject<MessageI[]>([])
  private currentPage = 1
  private pageSize = 20
  private s3: S3

  constructor(private socket: Socket) {
    this.setupSocketListeners()
    this.s3 = new S3({
      accessKeyId: awsCredentials.accessKey,
      secretAccessKey: awsCredentials.secretKey,
      region: 'ap-south-1',
    });
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


  sendMessage(userId: string, channelId: string, message: string) {
    this.socket.emit('sendChannelMessage', { userId, channelId, message })
  }


  sendFileMessage(userId: string, channelId: string, fileUrl: string, fileType: string) {
    this.socket.emit('sendChannelMessage', { userId, channelId, fileUrl, fileType })
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
