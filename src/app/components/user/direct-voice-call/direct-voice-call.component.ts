// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Subscription } from 'rxjs';
// import { User } from '../../../interface/user/user.model';
// import { UserService } from '../../../service/user/user.service';
// import { FriendVoiceCallService } from '../../../service/friend-voice-call/friend-voice-call.service';
// import { AsyncPipe, CommonModule } from '@angular/common';
// import { DirectChatHeaderComponent } from '../shared/direct-chat-header/direct-chat-header.component';
// import { FriendsSidebarComponent } from '../shared/friends-sidebar/friends-sidebar.component';
// import { Location } from '@angular/common';
// import { DirectCallService } from '../../../service/direct-call/direct-call.service';

// @Component({
//   selector: 'app-direct-voice-call',
//   standalone: true,
//   imports: [DirectChatHeaderComponent, FriendsSidebarComponent, AsyncPipe, CommonModule],
//   templateUrl: './direct-voice-call.component.html',
//   styleUrls: ['./direct-voice-call.component.scss']
// })
// export class DirectVoiceCallComponent implements OnInit, OnDestroy {
//   private subscriptions: Subscription[] = [];
//   isRemoteUserJoined: boolean = false;
//   userId!: string | null;
//   friendId!: string | null;
//   isAudioMuted = false;
//   friendUserData!: User;

//   constructor(
//     private friendVoiceCallService: DirectCallService,
//     private route: ActivatedRoute,
//     private userService: UserService,
//     private location: Location
//   ) {}

//   ngOnInit(): void {
//     this.subscriptions.push(
//       this.route.paramMap.subscribe(params => {
//         this.userId = params.get('userId');
//         this.friendId = params.get('friendId');
//         this.loadFriendData();
//       })
//     );

//     if (this.userId && this.friendId) {
//       this.initializeCall(this.userId, this.friendId);
//     }

//     this.subscriptions.push(
//       this.friendVoiceCallService.isInCallBS.subscribe(isInCall => {
//         this.isRemoteUserJoined = isInCall;
//       }),
//       this.friendVoiceCallService.callEndedBS.subscribe(() => {
//         this.location.back();
//       })
//     );
//   }

//   private loadFriendData(): void {
//     if (this.friendId) {
//       this.userService.getUserDataForFriend(this.friendId).subscribe({
//         next: (data) => {
//           this.friendUserData = data;
//         },
//         error: (err) => {
//           console.error('Error fetching friend data:', err);
//         }
//       });
//     }
//   }

//   async initializeCall(userId: string, friendId: string): Promise<void> {
//     try {
//       await this.friendVoiceCallService.startCall(friendId,false);
//     } catch (error) {
//       console.error('Failed to initialize call:', error);
//     }
//   }

//   toggleAudio(): void {
//     this.isAudioMuted = !this.isAudioMuted;
//     this.friendVoiceCallService.toggleAudio(this.isAudioMuted);
//   }

//   endCall(): void {
//     this.friendVoiceCallService.endCall();
//     // this.location.back();
//   }

//   ngOnDestroy(): void {
//     this.subscriptions.forEach(sub => sub.unsubscribe());
//     this.friendVoiceCallService.destroyPeer();
//   }
// }






















import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DirectChatHeaderComponent } from '../shared/direct-chat-header/direct-chat-header.component';
import { FriendsSidebarComponent } from '../shared/friends-sidebar/friends-sidebar.component';
import { AsyncPipe, CommonModule, Location } from '@angular/common';
import { DirectCallService } from '../../../service/direct-call/direct-call.service';
import { CreateServerComponent } from "../shared/create-server/create-server.component";
import { ToggleCreateServerService } from '../../../service/toggleCreateServer/toggle-create-server.service';

@Component({
  selector: 'app-direct-voice-call',
  standalone: true,
  imports: [DirectChatHeaderComponent, FriendsSidebarComponent, AsyncPipe, CommonModule, CreateServerComponent],
  templateUrl: './direct-voice-call.component.html',
  styleUrls: ['./direct-voice-call.component.scss']
})
export class DirectVoiceCallComponent implements OnInit, OnDestroy {
  calleeId: string | null = null;
  callStatus: string = 'Connecting...';
  isAudioMuted = false;
  createServerVisible: boolean = false
  private remoteStreamSubscription: Subscription | null = null;
  subscription!:Subscription
  constructor(
    private route: ActivatedRoute,
    private directCallService: DirectCallService,
    private location:Location,
    private toggleCreateServerService:ToggleCreateServerService
  ) {}

  ngOnInit() {
    this.calleeId = this.route.snapshot.paramMap.get('friendId');
    if (this.calleeId) {
      this.startCall(this.calleeId);
    }

    this.remoteStreamSubscription = this.directCallService.remoteStreamBS.subscribe(stream => {
      if (stream) {
        this.callStatus = 'Connected';
        // Create an audio element to play the remote stream
        const audioElement = new Audio();
        audioElement.srcObject = stream;
        audioElement.play();
      }
    });

    this.subscription = this.toggleCreateServerService.booleanValue$.subscribe({
      next: (value) => {
        this.createServerVisible = value

      },
      error: (err) => console.log(err)
    })
  }

  ngOnDestroy() {
    if (this.remoteStreamSubscription) {
      this.remoteStreamSubscription.unsubscribe();
    }
    this.directCallService.endCall();
  }

  private async startCall(calleeId: string) {
    try {
      await this.directCallService.startCall(calleeId, false);
    } catch (error) {
      console.error('Error starting audio call:', error);
      this.callStatus = 'Failed to connect';
      // Handle error (e.g., show error message to user)
    }
  }

  toggleAudio() {
    this.isAudioMuted = !this.isAudioMuted;
    this.directCallService.toggleAudio(this.isAudioMuted);
  }

  endCall() {
    this.directCallService.endCall();
    // Navigate back to the previous page or a specific route
    this.location.back()
  }
}

