import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import Peer, { MediaConnection } from 'peerjs';
import { BehaviorSubject, map, of, tap } from 'rxjs';
import { ToastService } from '../toster/toster-service.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ServerVoiceCallService {

  private peer!: Peer
  private roomId!: string;
  private connections: Map<string, MediaConnection> = new Map();
  private screenStream: MediaStream | null = null
  private userNames: Map<string, string> = new Map();
  networkQualityBs = new BehaviorSubject<string>('Unknown');

  localStreamBs = new BehaviorSubject<MediaStream | null>(null);
  remoteStreamsBs = new BehaviorSubject<Map<string, MediaStream>>(new Map());
  isCallStartedBs = new BehaviorSubject<boolean>(false);
  localPeerIdBs = new BehaviorSubject<string | null>(null);

  constructor(
    private socket: Socket,
    private toaster: ToastService,
    private userService: UserService
  ) {
    this.setupSocketListeners();
  }


  private setupSocketListeners() {


    this.socket.fromEvent<string>('user-joined').subscribe(peerId => {
      console.log('Server notified: User joined:', peerId);
      if (this.peer && this.localStreamBs.value) {
        console.log('Attempting to call newly joined peer:', peerId);
        this.callPeer(peerId, this.localStreamBs.value);
      } else {
        console.log('Cannot call peer. Peer or local stream not ready.');
      }
    });

    this.socket.fromEvent<string>('user-left').subscribe(peerId => {
      if (this.connections.has(peerId)) {
        this.connections.get(peerId)!.close();
        this.connections.delete(peerId);
        const remoteStreams = this.remoteStreamsBs.value;
        remoteStreams.delete(peerId);
        this.remoteStreamsBs.next(remoteStreams);
      }
    });



    this.socket.fromEvent<string[]>('existing-peers').subscribe(peerIds => {
      console.log('Server sent existing peers:', peerIds);
      peerIds.forEach(peerId => {
        if (this.peer && this.localStreamBs.value) {
          console.log('Attempting to call existing peer:', peerId);
          this.callPeer(peerId, this.localStreamBs.value);
        } else {
          console.log('Cannot call peer. Peer or local stream not ready.');
        }
      });
    });
  }


  private callPeer(peerId: string, stream: MediaStream): void {
    console.log('PeerJS: Calling peer:', peerId);
    const call = this.peer.call(peerId, stream);
    this.handleIncomingAudioCall(call);
  }


  async initializeAudioCall(channelId: string): Promise<void> {
    if (this.peer) {
      this.peer.destroy();
    }
    this.roomId = `video-room-${channelId}`;
    console.log('Initializing peer connection for room:', this.roomId);
    const userId = await this.userService.getUserId();
    if (!userId) {
      this.toaster.showError('Error', 'User data is not available. Try logging in again');
      throw new Error('User ID not available');
    }

    // Generate a random string to append to the userId
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const peerId = `${userId}-${randomSuffix}`;

    if (userId) {
      this.peer = new Peer(peerId, {
        debug: 3,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ]
        }
      });
    } else {
      this.toaster.showError('Error', 'User data is not able to read, Try login again')
    }

    return new Promise((resolve, reject) => {
      this.peer.on('open', (id) => {
        console.log('PeerJS: My peer ID is:', id);
        console.log('Emitting join-room event to server');
        this.localPeerIdBs.next(id);
        this.socket.emit('join-room', this.roomId, id);
        resolve();
      });

      this.peer.on('error', (error) => {
        console.error('PeerJS error:', error);
        this.toaster.showError('Connection Error', error.toString());
        reject(error);
      });

      this.peer.on('connection', (conn) => {
        console.log('PeerJS: Incoming peer connection from:', conn.peer);
      });
    });
  }


  async joinAudioRoom(): Promise<void> {
    try {
      console.log('Attempting to join audio room and get user media');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Got user audio stream');
      this.localStreamBs.next(stream);

      this.peer.on('call', (call) => {
        console.log('PeerJS: Receiving audio call from:', call.peer);
        call.answer(stream);
        this.handleIncomingAudioCall(call);
      });

      this.isCallStartedBs.next(true);
    } catch (error) {
      console.error('Error accessing audio devices:', error);
      this.toaster.showError('Audio Error', 'Failed to access microphone');
    }
  }



  private handleIncomingAudioCall(call: MediaConnection): void {
    call.on('stream', (remoteStream) => {
      console.log('PeerJS: Received remote audio stream from:', call.peer);
      const remoteStreams = this.remoteStreamsBs.value;
      remoteStreams.set(call.peer, remoteStream);
      this.checkNetworkQuality(call.peerConnection);
      this.remoteStreamsBs.next(remoteStreams);
    });

    // ... (keep existing close event handler)
    call.on('close', () => {
      console.log('Call closed with:', call.peer);
      const remoteStreams = this.remoteStreamsBs.value;
      remoteStreams.delete(call.peer);
      this.remoteStreamsBs.next(remoteStreams);
    });

    this.connections.set(call.peer, call);
  }


  toggleAudio(mute: boolean) {
    this.localStreamBs.value?.getAudioTracks().forEach(track => track.enabled = !mute);
  }

  checkNetworkQuality(connection: RTCPeerConnection) {
    setInterval(() => {
      connection.getStats(null).then((stats: RTCStatsReport) => {
        stats.forEach(report => {
          if (report.type === 'candidate-pair' && report.state === 'succeeded') {
            const rtt = report.currentRoundTripTime;
            if (rtt < 0.1) this.networkQualityBs.next('Excellent');
            else if (rtt < 0.3) this.networkQualityBs.next('Good');
            else if (rtt < 0.5) this.networkQualityBs.next('Fair');
            else this.networkQualityBs.next('Poor');
          }
        });
      });
    }, 5000); // Check every 5 seconds
  }





  getUserData(userId: string) {
    return this.userService.getUserDataForFriend(userId).pipe(
      tap(userData => {
        this.userNames.set(userId, userData.username)
      }),
      map(() => void 0)
    )
  }

  private extractUserId(peerId: string): string {
    return peerId.split('-')[0];
  }

  getUserName(peerId: string) {
    const userId = this.extractUserId(peerId);
    if (this.userNames.has(userId)) {
      return of(this.userNames.get(userId)!);
    } else {
      return this.userService.getUserDataForFriend(userId).pipe(
        tap(userData => {
          this.userNames.set(userId, userData.username);
        }),
        map(userData => userData.username)
      );
    }
  }



  destroyPeerConnection(): void {
    if (this.peer) {
      this.peer.destroy();
    }
  }

  leaveRoom(): void {
    this.localStreamBs.value?.getTracks().forEach(track => track.stop());
    this.connections.forEach(connection => connection.close());
    this.connections.clear();
    this.remoteStreamsBs.next(new Map());
    this.localStreamBs.next(null);
    this.isCallStartedBs.next(false);
    if (this.peer && !this.peer.destroyed) {
      this.peer.disconnect();
      this.peer.destroy();
    }
    this.socket.emit('leave-room', this.roomId, this.peer?.id);
    this.toaster.showInfo('Call Ended', 'You have left the Voice call');
  }

}
