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
 
import { CreateServerComponent } from "../shared/create-server/create-server.component";
import { ToggleUserProfileService } from '../../../service/toggleUserProfile/toggle-user-profile.service';
import { ToggleCreateServerService } from '../../../service/toggleCreateServer/toggle-create-server.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MatDialog } from '@angular/material/dialog';
import { MediaDialogComponent } from '../shared/media-dialog/media-dialog.component';
import { LoadingService } from '../../../service/loading/loading.service';
import { NgxLoadingModule } from 'ngx-loading';


@Component({
  selector: 'app-direct-chat',
  standalone: true,
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss',
  providers: [DatePipe],
  imports: [FriendsSidebarComponent, FriendsHeaderComponent, FormsModule, CommonModule, DirectChatHeaderComponent, AsyncPipe, CreateServerComponent,NgxLoadingModule]
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
  private readonly THUMBNAIL_SIZE = 300

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
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private loading:LoadingService
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



  async onImageUpload(event: Event) {
    this.isLoading = true
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const file = files[0];
      try {
        const fileType = file.type.split('/')[0];
        let fileUrl = ''
        let thumbnailUrl = '';

        if (file.type.startsWith('image/')) {
          const response = await this.chatService.uploadImage(file);
          console.log('Image uploaded:', response);
          fileUrl = response
        } else if (file.type.startsWith('video/')) {
          const thumbnailBlob = await this.generateVideoThumbnail(file);
          const thumbnailFile = new File([thumbnailBlob as BlobPart],Date.now()+ 'thumbnail.jpg', { type: 'image/jpeg' });
          
          // Upload video and thumbnail
          const [videoUploadResult, thumbnailUploadResult] = await Promise.all([
            this.chatService.uploadImage(file),
            this.chatService.uploadImage(thumbnailFile)
          ]);

          fileUrl = videoUploadResult;
          thumbnailUrl = thumbnailUploadResult;

        }
        if (fileUrl) {
          this.chatService.sendDirectImage(this.userId!, this.friendId!, fileUrl, fileType,thumbnailUrl);
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






  openMediaDialog(src: string, type: string) {
    this.dialog.open(MediaDialogComponent, {
      width: 'auto',
      data: { src, type }
    });
  }




generateVideoThumbnail(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(video.duration / 3, 1);
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Calculate the scaling factor to fit the video within the thumbnail size
      const scale = Math.min(this.THUMBNAIL_SIZE / video.videoWidth, this.THUMBNAIL_SIZE / video.videoHeight);
      
      // Calculate the new dimensions
      const newWidth = video.videoWidth * scale;
      const newHeight = video.videoHeight * scale;

      // Set canvas size to our desired thumbnail size
      canvas.width = this.THUMBNAIL_SIZE;
      canvas.height = this.THUMBNAIL_SIZE;

      // Fill the background with a color (e.g., black)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate position to center the scaled video frame
      const x = (canvas.width - newWidth) / 2;
      const y = (canvas.height - newHeight) / 2;

      // Draw the scaled video frame
      ctx.drawImage(video, x, y, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create thumbnail blob'));
          }
        },
        'image/jpeg',
        0.7
      );
    };

    video.onerror = () => {
      reject(new Error('Error loading video'));
    };

    video.src = URL.createObjectURL(file);
  });
}

}