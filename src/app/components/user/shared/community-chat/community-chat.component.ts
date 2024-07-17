// import { CommonModule, DatePipe } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ChannelChatService } from '../../../../service/channel-chat/channel-chat.service';
// import { Subscription } from 'rxjs';
// import { ActivatedRoute } from '@angular/router';
// import { UserService } from '../../../../service/user/user.service';
// import { ToastService } from '../../../../service/toster/toster-service.service';

// @Component({
//   selector: 'app-community-chat',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './community-chat.component.html',
//   styleUrl: './community-chat.component.scss',
//   providers: [DatePipe]

// })
// export class CommunityChatComponent {
//   messages: any
//   // msg: string;
//   userId!: string | null
//   message!: string
//   channelId!: string | null
//   private routeSubscription!: Subscription;
//   private messageSubscription!: Subscription


//   constructor(
//     private chatService: ChannelChatService,
//     private route: ActivatedRoute,
//     private userService: UserService,
//     private datePipe: DatePipe,
//     private toastService: ToastService
//   ) { }

//   async ngOnInit(): Promise<void> {
//     console.log('ngOninit anne ');
//     this.userId = await this.userService.getUserId()
//     this.routeSubscription = this.route.params.subscribe(params => {
//       if (this.channelId) {
//         this.chatService.leaveChannel(this.channelId);
//       }
//       this.channelId = params['channelId'];
//     this.loadChannelMessages();
      
//     });
    

//   }

//   loadChannelMessages() {
//     if (this.messageSubscription) {
//       this.messageSubscription.unsubscribe();
//     }
//     if (this.channelId && this.userId) {

//       this.chatService.joinChannel(this.userId, this.channelId);
//       this.messageSubscription = this.chatService.getAllMessages().subscribe(messages => {
//         this.messages = messages;
//         console.log('all messages ',this.messages);
        
//       });
//     }else{
//       console.log(this.channelId , this.userId);
      
//       this.toastService.showWarn('Warning', 'Something Went Wrong Please Try Again')
//     }
//   }

//   sendMessage() {
//     console.log(this.userId);

//     if (this.userId && this.channelId && this.message) {
//       this.chatService.sendMessage(this.userId, this.channelId, this.message)
//       this.message = ''
//     } else {
//       console.log(this.userId, this.channelId,this.message);
      
//       this.toastService.showWarn('Warning', 'Something Went Wrong Please Try Again')
//     }
//   }
//   formatTime(dateString: Date): string {
//     return this.datePipe.transform(dateString, 'shortTime')!;
//   }

//   ngOnDestroy(): void {
//     if (this.routeSubscription) {
//       this.routeSubscription.unsubscribe
//     }
//     if (this.messageSubscription) {
//       this.messageSubscription.unsubscribe()
//     }
//     if (this.channelId) {
//       this.chatService.leaveChannel(this.channelId)
//     }
//   }

// }



import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChannelChatService } from '../../../../service/channel-chat/channel-chat.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../service/user/user.service';
import { ToastService } from '../../../../service/toster/toster-service.service';
import { currentGroupI, MessageGroupI, MessageI } from '../../../../interface/server/channelChat';

@Component({
  selector: 'app-community-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community-chat.component.html',
  styleUrls: ['./community-chat.component.scss'],
  providers: [DatePipe]
})
export class CommunityChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  messages: MessageI[] = [];
  groupedMessages: MessageGroupI[] = [];
  userId!: string | null;
  message: string = '';
  channelId!: string | null;
  private routeSubscription!: Subscription;
  private messageSubscription!: Subscription;

  constructor(
    private chatService: ChannelChatService,
    private route: ActivatedRoute,
    private userService: UserService,
    private datePipe: DatePipe,
    private toastService: ToastService
  ) { }

  async ngOnInit(): Promise<void> {
    this.userId = await this.userService.getUserId();
    this.routeSubscription = this.route.params.subscribe(params => {
      if (this.channelId) {
        this.chatService.leaveChannel(this.channelId);
      }
      this.channelId = params['channelId'];
      this.loadChannelMessages();
    });
  }

  loadChannelMessages() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.channelId && this.userId) {
      this.chatService.joinChannel(this.userId, this.channelId);
      this.messageSubscription = this.chatService.getAllMessages().subscribe(messages => {
        this.messages = messages;
        this.groupMessages();
      });
    } else {
      this.toastService.showWarn('Warning', 'Something Went Wrong Please Try Again');
    }
  }

  groupMessages() {
    this.groupedMessages = [];
    let currentDate = '';
    let currentGroup!: MessageGroupI;
  
    this.messages.forEach((msg: MessageI, index: number) => {
      const messageDate = this.formatDate(msg.createdAt);
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        currentGroup = { date: currentDate, messages: [] };
        this.groupedMessages.push(currentGroup);
      }
  
      const prevMsg = index > 0 ? this.messages[index - 1] : null;
      if (prevMsg) {
        msg.grouped = this.shouldGroupWithPreviousMessage(msg, prevMsg);
      } else {
        msg.grouped = false; // or any default value you want
      }
      currentGroup.messages.push(msg);
    });
  }
  

  shouldGroupWithPreviousMessage(currentMsg: MessageI, prevMsg: MessageI): boolean {
    if (!prevMsg) return false;
    const timeDiff = new Date(currentMsg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime();
    return currentMsg.sender._id === prevMsg.sender._id && timeDiff < 5 * 60 * 1000; // 5 minutes
  }

  sendMessage() {
    if (this.userId && this.channelId && this.message.trim()) {
      this.chatService.sendMessage(this.userId, this.channelId, this.message.trim());
      this.message = '';
    } else {
      this.toastService.showWarn('Warning', 'Unable to send message. Please try again.');
    }
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMMM d, yyyy')!;
  }

  formatTime(date: string): string {
    return this.datePipe.transform(date, 'shortTime')!;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.channelId) {
      this.chatService.leaveChannel(this.channelId);
    }
  }
}