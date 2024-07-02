import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FriendsSidebarComponent } from '../reuse/friends-sidebar/friends-sidebar.component';
import { FriendsHeaderComponent } from '../reuse/friends-header/friends-header.component';
import { ActivatedRoute } from '@angular/router';
import { ChatServiceService } from '../../../service/chat/chat-service.service';
import { ToastService } from '../../../service/toster/toster-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { directChatI } from '../../../interface/user/direct-chat';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [FriendsSidebarComponent, FriendsHeaderComponent, FormsModule, CommonModule],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss',
  providers: [DatePipe]
})
export class DirectChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  userId!: string | null;
  friendId!: string | null;
  message!: string;
  messages: directChatI[] = [];


  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private chatService: ChatServiceService,
    private toaster: ToastService
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.friendId = this.route.snapshot.paramMap.get('friendId');

    if (this.userId && this.friendId) {
      this.chatService.joinDirectChat(this.userId, this.friendId);
    } else {
      console.log("User ID or Friend ID is missing");
    }

    this.chatService.getAllMessages().subscribe(msg => {
      console.log(msg, "All messages");
      this.messages = msg;
      this.scrollToBottom();
    });

    this.chatService.getLastMessages().subscribe((msg) => {
      console.log("last message   ",msg);
      
    this.messages.push(msg)
      
      this.scrollToBottom();
    });

  }
  

  ngAfterViewChecked() {
    this.scrollToBottom();


  }

  formatTime(dateString: Date): string {
    return this.datePipe.transform(dateString, 'shortTime')!;
  }

  sendMessage() {
    if (this.userId && this.friendId) {
      this.chatService.sendDirectMessage(this.userId, this.friendId, this.message)
      this.message = '';
    } else {
      this.toaster.showError('Something went wrong. Try logging in again.');
    }
  }

  isCurrentUser(senderId: string): boolean {
    return senderId === this.userId;
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }



}