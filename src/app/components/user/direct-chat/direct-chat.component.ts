import { Component } from '@angular/core';
import { FriendsSidebarComponent } from '../reuse/friends-sidebar/friends-sidebar.component';
import { FriendsHeaderComponent } from '../reuse/friends-header/friends-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from '@angular/fire/auth';
import { ChatServiceService } from '../../../service/chat/chat-service.service';
import { ToastService } from '../../../service/toster/toster-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [FriendsSidebarComponent, FriendsHeaderComponent,FormsModule],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
})
export class DirectChatComponent {

  userId!: string | null
  friendId!: string | null
  message!: string;
  messages: any[] = [];

  constructor(private route: ActivatedRoute, private chatService: ChatServiceService,private toaster:ToastService) { }
  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId')
    this.friendId = this.route.snapshot.paramMap.get('friendId')
    
    if (this.userId && this.friendId) {
      this.chatService.joinDirectChat(this.userId, this.friendId)
    }
  }




  sendMessage(){
   if (this.userId && this.friendId && this.message) {
    this.chatService.sendDirectMessage(this.userId, this.friendId, this.message)
   }else{
    this.toaster.showError('SomeThing Went Wrong Try Login Again')
    console.log('SomeThing Went Wrong Try Login Again');
    
   }
  }
}
