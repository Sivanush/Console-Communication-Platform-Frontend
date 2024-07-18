import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageI } from '../../interface/server/channelChat';

@Injectable({
  providedIn: 'root'
})
export class ChannelChatService {

 
  private channelMessages = new BehaviorSubject<MessageI[]>([])
  private currentPage = 1
  private pageSize = 20


  constructor( private socket:Socket) {
    this.setupSocketListeners()
   }

   private setupSocketListeners(){
    this.socket.on('allMessages',(messages:any[])=>{
      this.channelMessages.next(messages)
    })

    this.socket.on('channelMessage',(message:any)=>{
      this.channelMessages.next([...this.channelMessages.value,message])
    })
   }


   joinChannel(userId: string, channelId: string){
    this.channelMessages.next([])
    this.socket.emit('joinChannel',{userId,channelId})
   }

   leaveChannel(channelId:string){
    this.socket.emit('leaveChannel',{channelId})
    this.channelMessages.next([])
   }

   sendMessage(userId:string,channelId:string,message:string){
    this.socket.emit('sendChannelMessage',{userId,channelId,message})
   }

   getAllMessages(): Observable<MessageI[]>{
    return this.channelMessages.asObservable()
   }

   loadMoreMessages(userId:string,channelId:string):Observable<MessageI[]>{
    return new Observable(observe=>{
      this.socket.emit('getMoreMessages',{userId,channelId,page:this.currentPage,pageSize:this.pageSize})
      this.socket.once('paginatedMessages',(messages:MessageI[])=>{
        observe.next(messages)
        observe.complete()
        this.currentPage++
      })
     
    })


   
   }
}
