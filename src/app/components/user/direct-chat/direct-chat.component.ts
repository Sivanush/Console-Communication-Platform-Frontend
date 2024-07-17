import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChatServiceService } from '../../../service/direct-chat/chat-service.service';
import { ToastService } from '../../../service/toster/toster-service.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { directChatI } from '../../../interface/user/direct-chat';
import { DatePipe } from '@angular/common';
import { FriendsHeaderComponent } from '../shared/friends-header/friends-header.component';
import { FriendsSidebarComponent } from '../shared/friends-sidebar/friends-sidebar.component';
import { Observable, Subscription, filter } from 'rxjs';
import { DirectChatHeaderComponent } from '../shared/direct-chat-header/direct-chat-header.component';
import { User } from '../../../interface/user/user.model';
import { UserService } from '../../../service/user/user.service';
import { log } from 'util';

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [FriendsSidebarComponent, FriendsHeaderComponent, FormsModule, CommonModule, DirectChatHeaderComponent, AsyncPipe],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss',
  providers: [DatePipe]
})
export class DirectChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  friendUserData: User = {} as User;
  userId: string | null = null;
  friendId: string | null = null;
  message!: string;
  messages: directChatI[] = [];
  isFriendOnline$: Observable<boolean> | undefined;

  private paramSubscription!: Subscription;
  private messagesSubscription!: Subscription;
  private lastMessageSubscription!: Subscription;
  private routerSubscription!: Subscription;


  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private chatService: ChatServiceService,
    private toaster: ToastService,
    private userService: UserService
  ) { }

  ngOnInit(): void {

    this.paramSubscription = this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId');
      this.friendId = params.get('friendId');
      this.initializeChat();
    });
    
   
    
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.initializeChat();
    });

    if (this.userId) {
      this.chatService.connectUser(this.userId);
    }
  }

  initializeChat(): void {
    
    this.messages = [];

  
    if (this.userId && this.friendId) {
      this.chatService.joinDirectChat(this.userId, this.friendId);
      this.isFriendOnline$ = this.chatService.isUserOnline(this.friendId);
    } else {
      console.log("User ID or Friend ID is missing");
      this.toaster.showError('Error', 'Something Went Wrong. Please Try Again');
    }

    this.userService.getUserDataForFriend(this.friendId as string).subscribe({
      next: (data) => {
        this.friendUserData = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
    console.log('start');
    
    this.messagesSubscription =  this.chatService.getAllMessages().subscribe(msg => {
      console.log(msg, "All messages");
      this.messages = msg;
      this.scrollToBottom();
    });
    console.log('end');


    this.lastMessageSubscription = this.chatService.getLastMessage().subscribe((msg) => {
      console.log("last message   ", msg);
      this.messages.push(msg);
      this.scrollToBottom();
    });
  }

  ngOnDestroy(): void {
    this.paramSubscription?.unsubscribe();
    this.messagesSubscription?.unsubscribe();
    this.lastMessageSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
    if (this.userId) {
      // this.chatService.disconnectUser();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  formatTime(dateString: Date): string {
    return this.datePipe.transform(dateString, 'shortTime')!;
  }

  sendMessage() {
    if (this.userId && this.friendId && this.message.trim()) {
      this.chatService.sendDirectMessage(this.userId, this.friendId, this.message);
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