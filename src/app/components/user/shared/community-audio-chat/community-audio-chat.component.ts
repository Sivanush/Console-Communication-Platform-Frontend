import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServerVoiceCallService } from '../../../../service/server-voice-call/server-voice-call.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-community-audio-chat',
  standalone: true,
  imports: [],
  templateUrl: './community-audio-chat.component.html',
  styleUrl: './community-audio-chat.component.scss'
})
export class CommunityAudioChatComponent {

  isCallStarted = false;
  channelId: string | null = null;
  remoteStreams: Map<string, MediaStream> = new Map();
  isAudioMuted = false;
  networkQuality = 'Unknown';
  localPeerId: string | null = null;

  private subscriptions: Subscription[] = [];


  constructor(
    private serverVoiceCallService: ServerVoiceCallService,
    private route: ActivatedRoute
  ) { }




  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.channelId = params['channelId'];
        if (this.channelId) {
          this.initializeAudioCall(this.channelId);
        }
      }),

      this.serverVoiceCallService.isCallStartedBs.subscribe(isStarted => {
        this.isCallStarted = isStarted;
      }),

      this.serverVoiceCallService.remoteStreamsBs.subscribe(streams => {
        this.remoteStreams = streams;
        this.updateRemoteAudios();
      }),

      this.serverVoiceCallService.networkQualityBs.subscribe(quality => {
        this.networkQuality = quality;
      }),


      this.serverVoiceCallService.localPeerIdBs.subscribe(peerId => {
        this.localPeerId = peerId;
      })
    );

    window.addEventListener('beforeunload', this.handleTabClose.bind(this));
  }



  async initializeAudioCall(channelId: string) {
    try {
      console.log('Initializing audio call');
      await this.serverVoiceCallService.initializeAudioCall(channelId);
      console.log('Audio call initialized, joining room');
      await this.serverVoiceCallService.joinAudioRoom();
      console.log('Joined audio room successfully');
      this.isCallStarted = true;
    } catch (error) {
      console.error('Error setting up audio call:', error);
    }
  }




  joinCall(): void {
    if (this.channelId) {
      this.serverVoiceCallService.joinAudioRoom();
    }
  }

  leaveCall(): void {
    this.serverVoiceCallService.leaveRoom();
    this.isCallStarted = false;
  }

  toggleAudio() {
    this.isAudioMuted = !this.isAudioMuted;
    this.serverVoiceCallService.toggleAudio(this.isAudioMuted);
  }


  // private updateRemoteAudios(): void {
  //   // Update audio elements for remote streams
  //   // This will be simpler than video, as we don't need to display anything
  // }


  private handleTabClose() {
    this.leaveCall();
  }

  ngOnDestroy(): void {
    this.serverVoiceCallService.destroyPeerConnection();
    this.serverVoiceCallService.leaveRoom();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    window.removeEventListener('beforeunload', this.handleTabClose.bind(this));
  }

































  private updateRemoteAudios(): void {
    const audioContainer = document.getElementById('audio-grid');
    if (!audioContainer) return;
  
    // Remove indicators for peers that have left
    Array.from(audioContainer.children).forEach(child => {
      if (child.id.startsWith('audio-indicator-') && !this.remoteStreams.has(child.id.replace('audio-indicator-', ''))) {
        audioContainer.removeChild(child);
      }
    });
  
    // Add or update indicators for current peers
    this.remoteStreams.forEach((stream, peerId) => {

      if (peerId === this.localPeerId) return;


      let indicator = document.getElementById(`audio-indicator-${peerId}`);
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = `audio-indicator-${peerId}`;
        indicator.className = 'audio-indicator';
        audioContainer.appendChild(indicator);
  
        // Create hidden audio element
        const audio = document.createElement('audio');
        audio.srcObject = stream;
        audio.autoplay = true;
        audio.style.display = 'none';
        audioContainer.appendChild(audio);
  
        // Set up volume meter
        this.createVolumeMeter(stream, indicator);
      }
    });
  }
  
  private createVolumeMeter(stream: MediaStream, indicator: HTMLElement): void {
    const audioContext = new AudioContext();
    const sourceNode = audioContext.createMediaStreamSource(stream);
    const analyserNode = audioContext.createAnalyser();
    sourceNode.connect(analyserNode);
  
    const volumes = new Uint8Array(analyserNode.frequencyBinCount);
  
    const updateVolume = () => {
      analyserNode.getByteFrequencyData(volumes);
      let volumeSum = 0;
      for(const volume of volumes) {
        volumeSum += volume;
      }
      const averageVolume = volumeSum / volumes.length;
      
      // Change color based on volume
      if (averageVolume > 128) {
        indicator.style.backgroundColor = 'red';
      } else if (averageVolume > 64) {
        indicator.style.backgroundColor = 'yellow';
      } else if (averageVolume > 20) {
        indicator.style.backgroundColor = 'green';
      } else {
        indicator.style.backgroundColor = 'gray';
      }
  
      requestAnimationFrame(updateVolume);
    };
  
    updateVolume();
  }



  
}
