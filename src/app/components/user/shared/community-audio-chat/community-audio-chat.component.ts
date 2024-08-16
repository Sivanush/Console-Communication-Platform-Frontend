import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServerVoiceCallService } from '../../../../service/server-voice-call/server-voice-call.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { UserService } from '../../../../service/user/user.service';

@Component({
  selector: 'app-community-audio-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './community-audio-chat.component.html',
  styleUrl: './community-audio-chat.component.scss'
})
export class CommunityAudioChatComponent implements OnInit, OnDestroy {
  isCallStarted = false;
  channelId: string | null = null;
  remoteStreams: Map<string, MediaStream> = new Map();
  localStream: MediaStream | null = null;
  isAudioMuted = false;
  networkQuality = 'Unknown';
  localPeerId: string | null = null;
  userImage: string = 'https://via.placeholder.com/50'
  othersImage: string = 'https://via.placeholder.com/50'
  private subscriptions: Subscription[] = [];

  constructor(
    private serverVoiceCallService: ServerVoiceCallService,
    private route: ActivatedRoute,
    private userService: UserService,
    private location:Location
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
        this.updateAudioIndicators();
      }),

      this.serverVoiceCallService.localStreamBs.subscribe(stream => {
        this.localStream = stream;
        this.updateLocalAudioIndicator();
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
    this.location.back()
  }

  toggleAudio() {
    this.isAudioMuted = !this.isAudioMuted;
    this.serverVoiceCallService.toggleAudio(this.isAudioMuted);
  }

  private updateAudioIndicators(): void {
    this.updateLocalAudioIndicator();
    this.updateRemoteAudioIndicators();
    this.updateGridLayout();
  }

  private updateLocalAudioIndicator(): void {
    const container = document.getElementById('audio-grid');
    if (!container || !this.localStream) return;

    let audioWrapper = document.getElementById('local-audio-indicator');
    if (!audioWrapper) {

      this.userService.getUserData().subscribe({
        next: (userData) => {
          this.userImage = userData.image
          audioWrapper = this.createAudioIndicator('local-audio-indicator', 'You', this.userImage);
          container.insertBefore(audioWrapper, container.firstChild);
          this.createVolumeMeter(this.localStream as MediaStream, audioWrapper.querySelector('.audio-indicator') as HTMLElement);
        }
      })
    }
  }

  private updateRemoteAudioIndicators(): void {
    const container = document.getElementById('audio-grid');
    if (!container) return;

    // Remove indicators for users that have left
    Array.from(container.children).forEach(child => {
      if (child.id.startsWith('remote-audio-') && !this.remoteStreams.has(child.id.replace('remote-audio-', ''))) {
        container.removeChild(child);
      }
    });

    // Add or update indicators for current users
    this.remoteStreams.forEach((stream, peerId) => {
      let audioWrapper = document.getElementById(`remote-audio-${peerId}`);
      if (!audioWrapper) {



        const userId = peerId.split('-')[0]
        this.userService.getUserDataForFriend(userId).subscribe({
          next: (userData) => {
            this.othersImage = userData.image; // Assigning the image
            audioWrapper = this.createAudioIndicator(`remote-audio-${peerId}`, 'Loading...', this.othersImage);
            container.appendChild(audioWrapper);

            // Create hidden audio element
            const audioElement = document.createElement('audio');
            audioElement.srcObject = stream;
            audioElement.autoplay = true;
            audioElement.style.display = 'none';
            audioWrapper.appendChild(audioElement);

            this.serverVoiceCallService.getUserName(peerId).subscribe({
              next: (username) => {
                const usernameElement = audioWrapper?.querySelector('.username') as HTMLElement;
                if (usernameElement) {
                  usernameElement.textContent = username;
                }
              },
              error: (error) => {
                console.error('Error fetching username:', error);
                const usernameElement = audioWrapper?.querySelector('.username') as HTMLElement;
                if (usernameElement) {
                  usernameElement.textContent = `User ${peerId.substr(0, 8)}`;
                }
              }
            });

            this.createVolumeMeter(stream, audioWrapper.querySelector('.audio-indicator') as HTMLElement);
          },
          error: (error) => {
            console.error('Error fetching user data:', error);
          }
        });
      }
    });
  }

    private createAudioIndicator(id: string, initialUsername: string, userImage: string): HTMLElement {
      const audioWrapper = document.createElement('div');
      audioWrapper.id = id;
      audioWrapper.className = 'flex  flex-col justify-center items-center relative bg-[#2f3136] rounded-lg overflow-hidden p-4';

      const avatarElement = document.createElement('img');
      avatarElement.src = userImage;
      avatarElement.className = 'w-20 h-20 rounded-full bg-[#5865F2] mx-auto mb-2';

      const usernameElement = document.createElement('div');
      usernameElement.className = 'text-center text-sm username';
      usernameElement.textContent = initialUsername;

      const audioIndicator = document.createElement('div');
      audioIndicator.className = 'audio-indicator absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-500';

      audioWrapper.appendChild(avatarElement);
      audioWrapper.appendChild(usernameElement); // Append the username after the avatar
      audioWrapper.appendChild(audioIndicator);

      return audioWrapper;
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
      for (const volume of volumes) {
        volumeSum += volume;
      }
      const averageVolume = volumeSum / volumes.length;

      // Update audio indicator
      if (averageVolume > 20) {
        indicator.classList.add('animate-pulse');
      } else {
        indicator.classList.remove('animate-pulse');
      }

      requestAnimationFrame(updateVolume);
    };

    updateVolume();
  }

  private updateGridLayout(): void {
    const container = document.getElementById('audio-grid');
    if (!container) return;

    const count = this.remoteStreams.size + 1; // +1 for local user
    let gridClass = '';

    if (count === 1) {
      gridClass = 'grid-cols-1';
    } else if (count === 2) {
      gridClass = 'grid grid-cols-2';
    } else if (count <= 4) {
      gridClass = 'grid grid-cols-2 grid-rows-2';
    } else {
      gridClass = 'grid grid-cols-3 grid-rows-3';
    }

    container.className = `${gridClass} gap-4 p-4 h-full`;
  }

  private handleTabClose() {
    this.leaveCall();
  }

  ngOnDestroy(): void {
    this.serverVoiceCallService.destroyPeerConnection();
    this.serverVoiceCallService.leaveRoom();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    window.removeEventListener('beforeunload', this.handleTabClose.bind(this));
  }












  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;

  testAudioEffect(): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
    }

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // 440 Hz = A4 note

    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime); // Set volume to 10%

    this.oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    this.oscillator.start();
    setTimeout(() => {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
    }, 1000); // Stop after 1 second
  }
}