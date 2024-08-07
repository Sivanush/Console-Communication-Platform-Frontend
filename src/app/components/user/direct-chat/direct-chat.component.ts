import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
import { UserProfileComponent } from "../user-profile/user-profile.component";
import { CreateServerComponent } from "../shared/create-server/create-server.component";
import { ToggleUserProfileService } from '../../../service/toggleUserProfile/toggle-user-profile.service';
import { ToggleCreateServerService } from '../../../service/toggleCreateServer/toggle-create-server.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-direct-chat',
  standalone: true,
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss',
  providers: [DatePipe],
  imports: [FriendsSidebarComponent, FriendsHeaderComponent, FormsModule, CommonModule, DirectChatHeaderComponent, AsyncPipe, UserProfileComponent, CreateServerComponent,ProgressSpinnerModule]
})
export class DirectChatComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  profileVisible: boolean = false
  createServerVisible: boolean = false
  private subscription!: Subscription;

  friendUserData: User = {} as User;
  userId: string | null = null;
  friendId: string | null = null;
  message!: string;
  messages: directChatI[] = [];
  isFriendOnline$: Observable<boolean> | undefined;
  groupedMessages: directChatI[] = [];

  isLoading:boolean = false
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
    private userService: UserService,
    private userProfileService: ToggleUserProfileService,
    private toggleCreateServerService: ToggleCreateServerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.paramSubscription = this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId');
      this.friendId = params.get('friendId');
      this.initializeChat();

      this.subscription = this.toggleCreateServerService.booleanValue$.subscribe({
        next: (value) => {
          this.createServerVisible = value

        },
        error: (err) => console.log(err)
      })

      this.subscription = this.userProfileService.booleanValue$.subscribe((data: boolean) => {
        this.profileVisible = data;
        console.log('Data Updated ', this.profileVisible);

      });


    });

    if (this.userId && this.friendId) {
      this.chatService.markMessagesAsRead(this.userId, this.friendId);
    }





    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.initializeChat();
    });

    if (this.userId) {
      this.chatService.connectUser(this.userId);
    }

    this.chatService.setCurrentChatPartner(this.friendId)



  }

  initializeChat() {
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

    this.messagesSubscription = this.chatService.getAllMessages().subscribe(msg => {
      this.messages = msg;
      this.groupMessages()
      this.scrollToBottom();
    });


    this.lastMessageSubscription = this.chatService.getLastMessage().subscribe((msg) => {
      if (this.userId && this.friendId) {
        this.chatService.markMessagesAsRead(this.userId, this.friendId);
      }
      this.messages.push(msg);
      this.groupMessages()
      this.scrollToBottom();

    });
  }


  private groupMessages() {
    this.groupedMessages = this.messages.map((msg, index, array) => {
      const prevMsg = array[index - 1];
      const isNewGroup = !prevMsg || prevMsg.senderId._id !== msg.senderId._id || this.isNewTimeGroup(prevMsg.createdAt, msg.createdAt)
      return { ...msg, isNewGroup };
    })
    console.log(this.groupedMessages);
  }

  private isNewTimeGroup(prevDate: Date, currDate: Date): boolean {
    return new Date(currDate).getTime() - new Date(prevDate).getTime() > 5 * 60 * 1000; // 5 minutes
  }

  ngOnDestroy(): void {
    this.chatService.setCurrentChatPartner(null);
    this.paramSubscription?.unsubscribe();
    this.messagesSubscription?.unsubscribe();
    this.lastMessageSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
    if (this.userId) {
      // this.chatService.disconnectUser();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  formatFullTime(dateString: Date): string {
    return this.datePipe.transform(dateString, 'MM/dd/yyyy HH:mm')!;
  }

  // ngAfterViewChecked() {
  //   this.scrollToBottom();
  // }
  

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
    // try {
    //   this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    // } catch (err) { }
    setTimeout(() => {
      if (this.scrollContainer && this.scrollContainer.nativeElement) {
        const container = this.scrollContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 300); // Small delay to ensure DOM updates
  }

  // async onImageUpload(event: Event) {
  //   const files = (event.target as HTMLInputElement).files;
  //   if (files && files.length > 0) {
  //     const file = files[0];
  //     try {
  //       const base64Image = await this.fileToBase64(file);
  //       const fileType = file.type.split('/')[0];
  //       const fileUrl = await this.chatService.uploadToCloudinary(file);
  //       this.chatService.sendDirectImage(this.userId!, this.friendId!, fileUrl as string,fileType)
  //     } catch (error) {
  //       console.error('Error converting file to base64:', error);
  //       this.toaster.showError('Failed to upload image. Please try again.');
  //     }
  //   } else {
  //     this.toaster.showInfo('Please select an image to upload.');
  //   }
  // }


  // private fileToBase64(file: File): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = error => reject(error);
  //   });
  // }



  async onImageUpload(event: Event) {
    this.isLoading = true
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const file = files[0];
      try {
        const fileType = file.type.split('/')[0];
        let fileUrl = ''


        if (file.type.startsWith('image/')) {
          const response = await this.chatService.uploadImage(file);
          console.log('Image uploaded:', response);
          fileUrl = response
        } else if (file.type.startsWith('video/')) {
          const response = await this.chatService.uploadVideo(file);
          console.log('Video uploaded:', response);
          fileUrl = response
        }
        if (fileUrl) {
          this.chatService.sendDirectImage(this.userId!, this.friendId!, fileUrl, fileType);
          this.isLoading = false
          this.toaster.showSuccess('File uploaded and sent successfully.');
        } else {
          this.isLoading = false
          throw new Error('File upload failed');
        }
      } catch (error) {
        this.isLoading = false
        console.error('Error uploading file:', error);
        this.toaster.showError('Failed to upload image. Please try again.');
      }
    } else {
      this.isLoading = false
      this.toaster.showInfo('Please select an image to upload.');
    }
  }




}