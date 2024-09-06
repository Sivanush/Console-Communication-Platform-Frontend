

import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DirectCallService } from '../../../service/direct-call/direct-call.service';
import { AsyncPipe, CommonModule, KeyValuePipe, Location } from '@angular/common';
import { FriendsHeaderComponent } from '../shared/friends-header/friends-header.component';
import { FriendsSidebarComponent } from '../shared/friends-sidebar/friends-sidebar.component';
import { CreateServerComponent } from '../shared/create-server/create-server.component';
import { DirectChatHeaderComponent } from '../shared/direct-chat-header/direct-chat-header.component';
import { ToggleCreateServerService } from '../../../service/toggleCreateServer/toggle-create-server.service';

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
  createServerVisible: boolean = false
  isAudioMuted = false;
  isVideoOff = false;

  subscription!:Subscription

  constructor(
    private route: ActivatedRoute,
    private directCallService: DirectCallService,
    private location:Location,
    private toggleCreateServerService:ToggleCreateServerService
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
    if (this.subscription) {
      this.subscription.unsubscribe()
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