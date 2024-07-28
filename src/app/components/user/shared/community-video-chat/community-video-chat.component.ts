
// import { AfterViewInit, Component, ElementRef, ViewChild, } from '@angular/core';
// import { ToastService } from '../../../../service/toster/toster-service.service';
// import { ServerVideoCallService } from '../../../../service/server-video-call/server-video-call.service';
// import { filter, Observable, Subscription, switchMap } from 'rxjs';
// import { ActivatedRoute } from '@angular/router';
// import { UserService } from '../../../../service/user/user.service';

// @Component({
//   selector: 'app-community-video-chat',
//   standalone: true,
//   imports: [],
//   templateUrl: './community-video-chat.component.html',
//   styleUrl: './community-video-chat.component.scss'
// })
// export class CommunityVideoChatComponent implements AfterViewInit {
//     public isCallStarted$: Observable<boolean>;
//     private _paramSubscription!: Subscription;
//     channelId!: string | null;

//     @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;

//     remoteVideoElements: HTMLVideoElement[] = [];

//     constructor(
//       private toaster: ToastService, 
//       private serverVideoCallService: ServerVideoCallService, 
//       private route: ActivatedRoute
//     ) {
//       this.isCallStarted$ = serverVideoCallService.isCallStarted$;
//     }

//     async ngOnInit() {
//       this._paramSubscription = this.route.params.subscribe(async params => {
//         this.channelId = params['channelId'];
//         if (this.channelId) {
//           try {
//             await this.serverVideoCallService.initPeer(this.channelId);
//             await this.serverVideoCallService.joinRoom();
//           } catch (error) {
//             console.error('Failed to initialize peer or join room:', error);
//             this.toaster.showError('Connection Error', 'Failed to connect to the video call');
//           }
//         }
//       });

//       this.serverVideoCallService.localStreamBs.pipe(
//         filter(stream => !!stream)
//       ).subscribe(stream => {
//         if (stream && this.localVideo && this.localVideo.nativeElement) {
//           this.localVideo.nativeElement.srcObject = stream;
//         }
//       });

//       this.serverVideoCallService.remoteStreamsBs.subscribe(streams => {
//         this.updateRemoteVideos(streams);
//       });
//     }

//     ngAfterViewInit(): void {
//       // Ensure remote videos are added after the view initializes
//       this.updateRemoteVideos(this.serverVideoCallService.remoteStreamsBs.value);
//     }

//     ngOnDestroy(): void {
//       this.serverVideoCallService.destroyPeer();
//       if (this._paramSubscription) {
//         this._paramSubscription.unsubscribe();
//       }
//     }

//     endCall(): void {
//       this.serverVideoCallService.closeMediaCall();
//     }

//     private updateRemoteVideos(streams: MediaStream[]): void {
//       const container = document.getElementById('remote-videos');
//       if (!container) return;

//       // Remove old video elements
//       while (container.firstChild) {
//         container.removeChild(container.firstChild);
//       }

//       streams.forEach(stream => {
//         let video = document.createElement('video') as HTMLVideoElement;
//         video.srcObject = stream;
//         video.autoplay = true;
//         video.style.width = '200px'
//         video.playsInline = true;
//         container.appendChild(video);
//       });
//     }
//   }



















import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { ToastService } from '../../../../service/toster/toster-service.service';
import { ServerVideoCallService } from '../../../../service/server-video-call/server-video-call.service';
import { filter, Observable, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../service/user/user.service';

@Component({
  selector: 'app-community-video-chat',
  standalone: true,
  imports: [],
  templateUrl: './community-video-chat.component.html',
  styleUrl: './community-video-chat.component.scss'
})
export class CommunityVideoChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  
  isCallStarted = false;
  channelId: string | null = null;
  remoteStreams: Map<string, MediaStream> = new Map();

  private subscriptions: Subscription[] = [];

  constructor(
    private serverVideoCallService: ServerVideoCallService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.channelId = params['channelId'];
        if (this.channelId) {
          this.initializeVideoCall(this.channelId);
        }
      }),

      this.serverVideoCallService.isCallStartedBs.subscribe(isStarted => {
        this.isCallStarted = isStarted;
      }),

      this.serverVideoCallService.localStreamBs.subscribe(stream => {
        if (stream && this.localVideo) {
          this.localVideo.nativeElement.srcObject = stream;
        }
      }),

      this.serverVideoCallService.remoteStreamsBs.subscribe(streams => {
        this.remoteStreams = streams;
        this.updateRemoteVideos();
      })
    );
  }



  async initializeVideoCall(channelId: string) {
    try {
      console.log('Initializing peer connection');
      await this.serverVideoCallService.initializePeerConnection(channelId);
      console.log('Peer connection initialized, joining room');
      await this.serverVideoCallService.joinRoom();
      console.log('Joined room successfully');
    } catch (error) {
      console.error('Error setting up video call:', error);
    }
  }

  ngAfterViewInit(): void {
    this.updateRemoteVideos();
  }

  async joinCall(): Promise<void> {
    if (this.channelId) {
      try {
        await this.serverVideoCallService.initializePeerConnection(this.channelId);
        await this.serverVideoCallService.joinRoom();
      } catch (error) {
        console.error('Failed to join the call:', error);
      }
    }
  }

  leaveCall(): void {
    this.serverVideoCallService.leaveRoom();
  }

  private updateRemoteVideos(): void {
    const container = document.getElementById('remote-videos');
    if (!container) return;

    // Remove old video elements
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Add new video elements
    this.remoteStreams.forEach((stream, peerId) => {
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.muted = false;
      videoElement.style.width='200px'
      videoElement.id = `remote-video-${peerId}`;
      videoElement.className = 'remote-video';
      container.appendChild(videoElement);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.serverVideoCallService.leaveRoom();
  }
}





