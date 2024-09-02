// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CreateServerComponent } from '../shared/create-server/create-server.component';
// import { DirectChatHeaderComponent } from '../shared/direct-chat-header/direct-chat-header.component';
// import { FriendsSidebarComponent } from '../shared/friends-sidebar/friends-sidebar.component';
// import { FriendsHeaderComponent } from '../shared/friends-header/friends-header.component';
// import { filter, Observable, Subscription } from 'rxjs';
// import { User } from '../../../interface/user/user.model';
// import { ToggleUserProfileService } from '../../../service/toggleUserProfile/toggle-user-profile.service';
// import { ToggleCreateServerService } from '../../../service/toggleCreateServer/toggle-create-server.service';
// import { UserService } from '../../../service/user/user.service';
// import { ToastService } from '../../../service/toster/toster-service.service';
// import { FriendVideoCallService } from '../../../service/friend-video-call/friend-video-call.service';
// import { AcceptVideoCallComponent } from '../shared/accept-video-call/accept-video-call.component';
// import { MatDialog } from '@angular/material/dialog';
// import { AsyncPipe, CommonModule, KeyValuePipe, Location } from '@angular/common';
// import { DirectCallService } from '../../../service/direct-call/direct-call.service';

// @Component({
//   selector: 'app-direct-video-call',
//   standalone: true,
//   imports: [DirectChatHeaderComponent, CreateServerComponent, FriendsSidebarComponent, FriendsHeaderComponent, AsyncPipe, KeyValuePipe, CommonModule],
//   templateUrl: './direct-video-call.component.html',
//   styleUrl: './direct-video-call.component.scss'
// })
// export class DirectVideoCallComponent {
//   @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
//   @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

//   private subscriptions: Subscription[] = [];
//   isRemoteUserJoined: boolean = true;
//   userId!: string | null;
//   friendId!: string | null;
//   isAudioMuted = false;
//   isVideoOff = false;
//   friendUserData!: User;

//   constructor(
//     private friendVideoCallService: DirectCallService,
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
//       this.friendVideoCallService.localStreamBS.subscribe(stream => {
//         if (stream && this.localVideo) {
//           this.localVideo.nativeElement.srcObject = stream;
//         }
//       }),
//       this.friendVideoCallService.remoteStreamBS.subscribe(stream => {
//         if (stream && this.remoteVideo) {
//           this.remoteVideo.nativeElement.srcObject = stream;
//         }
//       }),
//       this.friendVideoCallService.callEndedBS.subscribe(() => {
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
//       await this.friendVideoCallService.startCall(friendId,true);
//     } catch (error) {
//       console.error('Failed to initialize call:', error);
//     }
//   }

//   toggleAudio(): void {
//     this.isAudioMuted = !this.isAudioMuted;
//     this.friendVideoCallService.toggleAudio(this.isAudioMuted);
//   }

//     toggleVideo(): void {
//     this.isVideoOff = !this.isVideoOff;
//     this.friendVideoCallService.toggleVideo(this.isVideoOff);
//   }

//   endCall(): void {
//     this.friendVideoCallService.endCall();
//     // this.location.back();
//   }

//   ngOnDestroy(): void {
//     this.subscriptions.forEach(sub => sub.unsubscribe());
//     this.friendVideoCallService.destroyPeer();
//   }
// }











import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DirectCallService } from '../../../service/direct-call/direct-call.service';
import { AsyncPipe, CommonModule, KeyValuePipe, Location } from '@angular/common';
import { FriendsHeaderComponent } from '../shared/friends-header/friends-header.component';
import { FriendsSidebarComponent } from '../shared/friends-sidebar/friends-sidebar.component';
import { CreateServerComponent } from '../shared/create-server/create-server.component';
import { DirectChatHeaderComponent } from '../shared/direct-chat-header/direct-chat-header.component';

@Component({
    selector: 'app-direct-video-call',
  standalone: true,
  imports: [DirectChatHeaderComponent, CreateServerComponent, FriendsSidebarComponent, FriendsHeaderComponent, AsyncPipe, KeyValuePipe, CommonModule],
  templateUrl: './direct-video-call.component.html',
  styleUrl: './direct-video-call.component.scss'
})
export class DirectVideoCallComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  private remoteStreamSubscription: Subscription | null = null;
  isAudioMuted = false;
  isVideoOff = false;

  constructor(
    private route: ActivatedRoute,
    private directCallService: DirectCallService,
    private location:Location
  ) {}

  ngOnInit() {
    const calleeId = this.route.snapshot.paramMap.get('friendId');
    if (calleeId) {
      this.startCall(calleeId);
    }
    this.remoteStreamSubscription = this.directCallService.remoteStreamBS.subscribe(stream => {
      if (stream) {
        this.remoteVideo.nativeElement.srcObject = stream;
      }
    });
  }

  ngOnDestroy() {
    if (this.remoteStreamSubscription) {
      this.remoteStreamSubscription.unsubscribe();
    }
    this.directCallService.endCall();
  }

  private async startCall(calleeId: string) {
    try {
      await this.directCallService.startCall(calleeId, true);
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localVideo.nativeElement.srcObject = localStream;
    } catch (error) {
      console.error('Error starting video call:', error);
      // Handle error (e.g., show error message to user)
    }
  }

  toggleAudio() {
    this.isAudioMuted = !this.isAudioMuted;
    this.directCallService.toggleAudio(this.isAudioMuted);
  }

  toggleVideo() {
    this.isVideoOff = !this.isVideoOff;
    this.directCallService.toggleVideo(this.isVideoOff);
  }

  endCall() {
    this.directCallService.endCall();
    // Navigate back to the previous page or a specific route
    this.location.back()
  }
}