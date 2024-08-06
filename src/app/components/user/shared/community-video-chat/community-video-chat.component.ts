import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { ServerVideoCallService } from '../../../../service/server-video-call/server-video-call.service';
import { Subscription,  } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-community-video-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './community-video-chat.component.html',
  styleUrl: './community-video-chat.component.scss'
})
export class CommunityVideoChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  
  isCallStarted = false;
  channelId: string | null = null;
  remoteStreams: Map<string, MediaStream> = new Map();

  isAudioMuted = false;
  isVideoOff = false;

  isScreenSharing = false;
  networkQuality = 'Unknown';

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
      }),

      this.serverVideoCallService.networkQualityBs.subscribe(quality=>{
        this.networkQuality = quality
      })
    );


    window.addEventListener('beforeunload', this.handleTabClose.bind(this));
  }


  toggleScreenShare(){
    if (this.isScreenSharing) {
      this.serverVideoCallService.stopScreenSharing()
      this.isScreenSharing = false
    }else{
      this.serverVideoCallService.screenShare().then(()=>{
        this.isScreenSharing = true
      })
    }
  }

  handleTabClose() {
    this.leaveCall();
  }

  getGridClass(): string {
    const count = this.remoteStreams.size;
    if (count === 0) return 'hidden';
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    return 'grid-cols-3';
  }


  async initializeVideoCall(channelId: string) {
    try {
      console.log('Initializing peer connection');
      await this.serverVideoCallService.initializePeerConnection(channelId);
      console.log('Peer connection initialized, joining room');
      await this.serverVideoCallService.joinRoom();
      console.log('Joined room successfully');
      this.isCallStarted = true;
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
        this.isCallStarted = true;
      } catch (error) {
        console.error('Failed to join the call:', error);
      }
    }
  }

  leaveCall(): void {
    this.serverVideoCallService.leaveRoom();
    this.isCallStarted = false;
  }



  private updateRemoteVideos(): void {
    const container = document.getElementById('video-grid');
    if (!container) return;


    Array.from(container.children).forEach(child => {
      if (child.id.startsWith('remote-video-') && !this.remoteStreams.has(child.id.replace('remote-video-', ''))) {
        container.removeChild(child);
      }
    });

    this.remoteStreams.forEach((stream, peerId) => {
      let videoWrapper = document.getElementById(`remote-video-${peerId}`);
      if (!videoWrapper) {
        videoWrapper = document.createElement('div');
        videoWrapper.id = `remote-video-${peerId}`;
        videoWrapper.className = 'relative bg-[#2f3136] rounded-lg overflow-hidden';
        
        const videoElement = document.createElement('video');
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.className = 'w-full h-full object-cover scale-x-[-1]';
        
        
        const usernameElement = document.createElement('div');
        usernameElement.className = 'absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm';
        usernameElement.textContent = 'Loading...';

        videoWrapper.appendChild(videoElement);
        videoWrapper.appendChild(usernameElement);
        container.appendChild(videoWrapper);
        
        this.serverVideoCallService.getUserName(peerId).subscribe({
          next:(username)=>{
            usernameElement.textContent = username;
          },
          error:(error)=>{
            console.error('Error fetching username:', error);
            usernameElement.textContent = `User ${peerId.substr(0, 8)}`;
          }
        })
      }


      const videoElement = videoWrapper.querySelector('video');
      if (videoElement && videoElement.srcObject !== stream) {
        videoElement.srcObject = stream;
      }
    });


    this.updateGridLayout();
  }

  private updateGridLayout(): void {
    const container = document.getElementById('video-grid');
    if (!container) return;
  
    const count = this.remoteStreams.size;
    let gridClass = '';
  
    if (count === 0) {
      gridClass = 'hidden';
    } else if (count === 1) {
      gridClass = 'grid-cols-1';
    } else if (count === 2) {
      gridClass = 'grid grid-cols-2';
    } else if (count <= 4) {
      gridClass = 'grid grid-cols-2 grid-rows-2';
    } else {
      gridClass = 'grid grid-cols-3 grid-rows-3';
    }

    container.className = `${gridClass} gap-2 h-full w-full`;
  
    
    const videos = container.querySelectorAll('.relative');
    videos.forEach((video: Element) => {
      const videoElement = video as HTMLElement;
      if (count === 1) {
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
      } else {
        videoElement.style.width = '';
        videoElement.style.height = '';
      }
    });
  }


  toggleAudio() {
    this.isAudioMuted = !this.isAudioMuted;
    this.serverVideoCallService.toggleAudio(this.isAudioMuted);
  }
  
  toggleVideo() {
    this.isVideoOff = !this.isVideoOff;
    this.serverVideoCallService.toggleVideo(this.isVideoOff);
  }


  

  ngOnDestroy(): void {
    // this.leaveCall()
    this.serverVideoCallService.destroyPeerConnection();
    this.serverVideoCallService.leaveRoom();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    window.removeEventListener('beforeunload', this.handleTabClose.bind(this));
  }
}





