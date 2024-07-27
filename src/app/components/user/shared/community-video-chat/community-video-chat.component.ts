
import { AfterViewInit, Component, ElementRef, ViewChild, } from '@angular/core';
import { ToastService } from '../../../../service/toster/toster-service.service';
import { ServerVideoCallService } from '../../../../service/server-video-call/server-video-call.service';
import { filter, Observable, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-community-video-chat',
  standalone: true,
  imports: [],
  templateUrl: './community-video-chat.component.html',
  styleUrl: './community-video-chat.component.scss'
})
export class CommunityVideoChatComponent implements AfterViewInit {
  public isCallStarted$: Observable<boolean>;
  private _paramSubscription!: Subscription;
  channelId!: string | null;

  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;

  remoteVideoElements: HTMLVideoElement[] = [];

  constructor(
    private toaster: ToastService, 
    private serverVideoCallService: ServerVideoCallService, 
    private route: ActivatedRoute
  ) {
    this.isCallStarted$ = serverVideoCallService.isCallStarted$;
  }

  async ngOnInit() {
    this._paramSubscription = this.route.params.subscribe(async params => {
      this.channelId = params['channelId'];
      if (this.channelId) {
        try {
          await this.serverVideoCallService.initPeer(this.channelId);
          await this.serverVideoCallService.joinRoom();
        } catch (error) {
          console.error('Failed to initialize peer or join room:', error);
          this.toaster.showError('Connection Error', 'Failed to connect to the video call');
        }
      }
    });

    this.serverVideoCallService.localStreamBs.pipe(
      filter(stream => !!stream)
    ).subscribe(stream => {
      if (stream && this.localVideo && this.localVideo.nativeElement) {
        this.localVideo.nativeElement.srcObject = stream;
      }
    });

    this.serverVideoCallService.remoteStreamsBs.subscribe(streams => {
      this.updateRemoteVideos(streams);
    });
  }

  ngAfterViewInit(): void {
    // Add a container for remote video elements
    const container = document.getElementById('remote-videos');
    if (container) {
      this.remoteVideoElements.forEach(video => container.appendChild(video));
    }
  }

  ngOnDestroy(): void {
    this.serverVideoCallService.destroyPeer();
    if (this._paramSubscription) {
      this._paramSubscription.unsubscribe();
    }
  }

  endCall(): void {
    this.serverVideoCallService.closeMediaCall();
  }

  private updateRemoteVideos(streams: MediaStream[]): void {
    const container = document.getElementById('remote-videos');
    if (!container) return;

    // Remove old video elements
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    this.remoteVideoElements = streams.map(stream => {
      let video = document.createElement('video') as HTMLVideoElement;
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.style.width = '200px'; // Set a size or style as needed
      container.appendChild(video);
      return video;
    });
  }
}