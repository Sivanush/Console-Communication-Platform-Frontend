



import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChannelChatService } from '../../../../service/channel-chat/channel-chat.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../service/user/user.service';
import { ToastService } from '../../../../service/toster/toster-service.service';
import { currentGroupI, MessageGroupI, MessageI } from '../../../../interface/server/channelChat';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LoadingService } from '../../../../service/loading/loading.service';


@Component({
  selector: 'app-community-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ProgressSpinnerModule,NgxSkeletonLoaderModule],
  templateUrl: './community-chat.component.html',
  styleUrls: ['./community-chat.component.scss'],
  providers: [DatePipe]
})
export class CommunityChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('scrollSentinel') private scrollSentinel!: ElementRef;
  
  private loadTriggerOffset = 400;
  allMessagesLoaded = false;

  messages: MessageI[] = [];
  groupedMessages: MessageGroupI[] = [];
  userId!: string | null;
  message: string = '';
  channelId!: string | null;
  private routeSubscription!: Subscription;
  private messageSubscription!: Subscription;
  isLoading = false;

  private observer!: IntersectionObserver;

  constructor(
    private chatService: ChannelChatService,
    private route: ActivatedRoute,
    private userService: UserService,
    private datePipe: DatePipe,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadingService.show()
    // this.cdr.detectChanges();
   }

  async ngOnInit(): Promise<void> {

  

    this.userId = await this.userService.getUserId();
    this.routeSubscription = this.route.params.subscribe(params => {
      if (this.channelId) {
        this.chatService.leaveChannel(this.channelId);
      }
      this.channelId = params['channelId'];
      this.loadChannelMessages();
      this.scrollToBottom()
     
    //    setTimeout(() => {
    //   this.loadingService.hide();
    // }, 1000);
      
    });
  }

  ngAfterViewInit() { 
    
    setTimeout(() => {
      this.setUpObserver();
      this.scrollContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this))
    }, 0);
  }

  setUpObserver() {
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !this.isLoading) {
        this.loadMoreMessages();
      }
      if (this.allMessagesLoaded) {
        this.observer.disconnect()
      }
    },{
      root:this.scrollContainer.nativeElement,
      rootMargin:`${this.loadTriggerOffset}px 0px 0px 0px`,
      threshold:0
    });
    this.observer.observe(this.scrollSentinel.nativeElement);
  }

  onScroll() {
    if (this.scrollContainer.nativeElement.scrollTop <= this.loadTriggerOffset && !this.isLoading && !this.allMessagesLoaded) {
      this.loadMoreMessages();
    }
  } 


  loadChannelMessages() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.allMessagesLoaded = false;
    if (this.channelId && this.userId) {
      this.chatService.joinChannel(this.userId, this.channelId);
      this.messageSubscription = this.chatService.getAllMessages().subscribe(messages => {
        this.messages = messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        this.groupMessages();
        this.scrollToBottom();
        setTimeout(() => {
        this.loadingService.hide()
        }, 1000);
      });
    } else {
      this.toastService.showWarn('Warning', 'Something Went Wrong Please Try Again');
    }
  }

  loadMoreMessages() {
    if (this.isLoading || !this.userId || !this.channelId) {
      return;
    }
    this.isLoading = true;
    const prevHeight = this.scrollContainer.nativeElement.scrollHeight;

    this.chatService.loadMoreMessages(this.userId, this.channelId).subscribe({
      next: (response) => {
        if (response.length === 0) {
          this.allMessagesLoaded = true;
          this.isLoading = false;
          return;
        }

        this.messages = [...response, ...this.messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        this.groupMessages();

        setTimeout(() => {
          const newHeight = this.scrollContainer.nativeElement.scrollHeight;
          const scrollOffset = newHeight - prevHeight;
          this.scrollContainer.nativeElement.scrollTop = scrollOffset > 0 ? scrollOffset : 0;
          this.isLoading = false;
        }, 100);
      },
      error: (err) => {
        console.error('Error loading more messages:', err);
        this.isLoading = false;
      }
    });
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
        msg.grouped = false;
      }
      if (!currentGroup.messages.some(existingMsg => existingMsg._id === msg._id)) {
        currentGroup.messages.push(msg);

      }
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
      this.scrollToBottom()
      this.message = '';

    }
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMMM d, yyyy')!;
  }

  formatTime(date: string): string {
    return this.datePipe.transform(date, 'shortTime')!;
  }

  // ngAfterViewChecked() {
  //   // this.scrollToBottom();
  // }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }, 200);
    } catch (err) {
      console.log(err);
    }
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
    if (this.observer) {
      this.observer.disconnect();
    }
    this.scrollContainer.nativeElement.removeEventListener('scroll', this.onScroll.bind(this));
  }
}
