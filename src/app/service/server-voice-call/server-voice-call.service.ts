// import { Injectable } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
// import Peer, { MediaConnection } from 'peerjs';
// import { BehaviorSubject, map, of, tap } from 'rxjs';
// import { ToastService } from '../toster/toster-service.service';
// import { UserService } from '../user/user.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class ServerVoiceCallService {

//   private peer!: Peer
//   private roomId!: string;
//   private connections: Map<string, MediaConnection> = new Map();
//   private screenStream: MediaStream | null = null
//   private userNames: Map<string, string> = new Map();
//   networkQualityBs = new BehaviorSubject<string>('Unknown');

//   localStreamBs = new BehaviorSubject<MediaStream | null>(null);
//   remoteStreamsBs = new BehaviorSubject<Map<string, MediaStream>>(new Map());
//   isCallStartedBs = new BehaviorSubject<boolean>(false);
//   localPeerIdBs = new BehaviorSubject<string | null>(null);

//   constructor(
//     private socket: Socket,
//     private toaster: ToastService,
//     private userService: UserService
//   ) {
//     this.setupSocketListeners();
//   }


//   private setupSocketListeners() {


//     this.socket.fromEvent<string>('user-joined').subscribe(peerId => {
//       console.log('Server notified: User joined:', peerId);
//       if (this.peer && this.localStreamBs.value) {
//         console.log('Attempting to call newly joined peer:', peerId);
//         this.callPeer(peerId, this.localStreamBs.value);
//       } else {
//         console.log('Cannot call peer. Peer or local stream not ready.');
//       }
//     });

//     this.socket.fromEvent<string>('user-left').subscribe(peerId => {
//       if (this.connections.has(peerId)) {
//         this.connections.get(peerId)!.close();
//         this.connections.delete(peerId);
//         const remoteStreams = this.remoteStreamsBs.value;
//         remoteStreams.delete(peerId);
//         this.remoteStreamsBs.next(remoteStreams);
//       }
//     });



//     this.socket.fromEvent<string[]>('existing-peers').subscribe(peerIds => {
//       console.log('Server sent existing peers:', peerIds);
//       peerIds.forEach(peerId => {
//         if (this.peer && this.localStreamBs.value) {
//           console.log('Attempting to call existing peer:', peerId);
//           this.callPeer(peerId, this.localStreamBs.value);
//         } else {
//           console.log('Cannot call peer. Peer or local stream not ready.');
//         }
//       });
//     });
//   }


//   private callPeer(peerId: string, stream: MediaStream): void {
//     console.log('PeerJS: Calling peer:', peerId);
//     const call = this.peer.call(peerId, stream);
//     this.handleIncomingAudioCall(call);
//   }


//   async initializeAudioCall(channelId: string): Promise<void> {
//     if (this.peer) {
//       this.peer.destroy();
//     }
//     this.roomId = `video-room-${channelId}`;
//     console.log('Initializing peer connection for room:', this.roomId);
//     const userId = await this.userService.getUserId();
//     if (!userId) {
//       this.toaster.showError('Error', 'User data is not available. Try logging in again');
//       throw new Error('User ID not available');
//     }

//     // Generate a random string to append to the userId
//     const randomSuffix = Math.random().toString(36).substring(2, 8);
//     const peerId = `${userId}-${randomSuffix}`;

//     if (userId) {
//       this.peer = new Peer(peerId, {
//         debug: 3,
//         config: {
//           iceServers: [
//             { urls: 'stun:stun.l.google.com:19302' },
//             { urls: 'stun:stun1.l.google.com:19302' },
//           ]
//         }
//       });
//     } else {
//       this.toaster.showError('Error', 'User data is not able to read, Try login again')
//     }

//     return new Promise((resolve, reject) => {
//       this.peer.on('open', (id) => {
//         console.log('PeerJS: My peer ID is:', id);
//         console.log('Emitting join-room event to server');
//         this.localPeerIdBs.next(id);
//         this.socket.emit('join-room', this.roomId, id);
//         resolve();
//       });

//       this.peer.on('error', (error) => {
//         console.error('PeerJS error:', error);
//         this.toaster.showError('Connection Error', error.toString());
//         reject(error);
//       });

//       this.peer.on('connection', (conn) => {
//         console.log('PeerJS: Incoming peer connection from:', conn.peer);
//       });
//     });
//   }


//   async joinAudioRoom(): Promise<void> {
//     try {
//       console.log('Attempting to join audio room and get user media');
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       console.log('Got user audio stream');
//       this.localStreamBs.next(stream);

//       this.peer.on('call', (call) => {
//         console.log('PeerJS: Receiving audio call from:', call.peer);
//         call.answer(stream);
//         this.handleIncomingAudioCall(call);
//       });

//       this.isCallStartedBs.next(true);
//     } catch (error) {
//       console.error('Error accessing audio devices:', error);
//       this.toaster.showError('Audio Error', 'Failed to access microphone');
//     }
//   }



//   private handleIncomingAudioCall(call: MediaConnection): void {
//     call.on('stream', (remoteStream) => {
//       console.log('PeerJS: Received remote audio stream from:', call.peer);
//       const remoteStreams = this.remoteStreamsBs.value;
//       remoteStreams.set(call.peer, remoteStream);
//       this.checkNetworkQuality(call.peerConnection);
//       this.remoteStreamsBs.next(remoteStreams);
//     });

//     // ... (keep existing close event handler)
//     call.on('close', () => {
//       console.log('Call closed with:', call.peer);
//       const remoteStreams = this.remoteStreamsBs.value;
//       remoteStreams.delete(call.peer);
//       this.remoteStreamsBs.next(remoteStreams);
//     });

//     this.connections.set(call.peer, call);
//   }


//   toggleAudio(mute: boolean) {
//     this.localStreamBs.value?.getAudioTracks().forEach(track => track.enabled = !mute);
//   }

//   checkNetworkQuality(connection: RTCPeerConnection) {
//     setInterval(() => {
//       connection.getStats(null).then((stats: RTCStatsReport) => {
//         stats.forEach(report => {
//           if (report.type === 'candidate-pair' && report.state === 'succeeded') {
//             const rtt = report.currentRoundTripTime;
//             if (rtt < 0.1) this.networkQualityBs.next('Excellent');
//             else if (rtt < 0.3) this.networkQualityBs.next('Good');
//             else if (rtt < 0.5) this.networkQualityBs.next('Fair');
//             else this.networkQualityBs.next('Poor');
//           }
//         });
//       });
//     }, 5000); // Check every 5 seconds
//   }





//   getUserData(userId: string) {
//     return this.userService.getUserDataForFriend(userId).pipe(
//       tap(userData => {
//         this.userNames.set(userId, userData.username)
//       }),
//       map(() => void 0)
//     )
//   }

//   private extractUserId(peerId: string): string {
//     return peerId.split('-')[0];
//   }

//   getUserName(peerId: string) {
//     const userId = this.extractUserId(peerId);
//     if (this.userNames.has(userId)) {
//       return of(this.userNames.get(userId)!);
//     } else {
//       return this.userService.getUserDataForFriend(userId).pipe(
//         tap(userData => {
//           this.userNames.set(userId, userData.username);
//         }),
//         map(userData => userData.username)
//       );
//     }
//   }



//   destroyPeerConnection(): void {
//     if (this.peer) {
//       this.peer.destroy();
//     }
//   }

//   leaveRoom(): void {
//     this.localStreamBs.value?.getTracks().forEach(track => track.stop());
//     this.connections.forEach(connection => connection.close());
//     this.connections.clear();
//     this.remoteStreamsBs.next(new Map());
//     this.localStreamBs.next(null);
//     this.isCallStartedBs.next(false);
//     if (this.peer && !this.peer.destroyed) {
//       this.peer.disconnect();
//       this.peer.destroy();
//     }
//     this.socket.emit('leave-room', this.roomId, this.peer?.id);
//     this.toaster.showInfo('Call Ended', 'You have left the Voice call');
//   }

// }













import { Injectable, NgZone } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import Peer, { MediaConnection } from 'peerjs';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { ToastService } from '../toster/toster-service.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ServerVoiceCallService {
  private peer!: Peer;
  private roomId!: string;
  private connections: Map<string, MediaConnection> = new Map();
  private userNames: Map<string, string> = new Map();
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  networkQualityBs = new BehaviorSubject<string>('Unknown');
  localStreamBs = new BehaviorSubject<MediaStream | null>(null);
  remoteStreamsBs = new BehaviorSubject<Map<string, MediaStream>>(new Map());
  isCallStartedBs = new BehaviorSubject<boolean>(false);
  localPeerIdBs = new BehaviorSubject<string | null>(null);
  connectionStatusBs = new BehaviorSubject<string>('disconnected');

  constructor(
    private socket: Socket,
    private toaster: ToastService,
    private userService: UserService,
    private ngZone: NgZone
  ) {
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => {
      this.connectionStatusBs.next('connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      this.connectionStatusBs.next('disconnected');
      this.attemptReconnect();
    });

    this.socket.fromEvent<string>('user-joined').subscribe(peerId => {
      console.log('Server notified: User joined:', peerId);
      if (this.peer && this.localStreamBs.value) {
        this.callPeer(peerId, this.localStreamBs.value);
      }
    });

    this.socket.fromEvent<string>('user-left').subscribe(peerId => {
      this.handlePeerDisconnection(peerId);
    });

    this.socket.fromEvent<string[]>('existing-peers').subscribe(peerIds => {
      peerIds.forEach(peerId => {
        if (this.peer && this.localStreamBs.value) {
          this.callPeer(peerId, this.localStreamBs.value);
        }
      });
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.socket.connect();
      }, 5000 * this.reconnectAttempts);
    } else {
      this.toaster.showError('Connection Error', 'Failed to reconnect to the server');
    }
  }

  // async initializeAudioCall(channelId: string): Promise<void> {
  //   if (this.peer) {
  //     this.peer.destroy();
  //   }
  //   this.roomId = `audio-room-${channelId}`;
  //   const userId = await this.userService.getUserId();
  //   if (!userId) {
  //     throw new Error('User ID not available');
  //   }

  //   const randomSuffix = Math.random().toString(36).substring(2, 8);
  //   const peerId = `${userId}-${randomSuffix}`;

  //   this.peer = new Peer(peerId, {
  //     debug: 3,
  //     config: {
  //       iceServers: [
  //         { urls: 'stun:stun.l.google.com:19302' },
  //         { urls: 'stun:stun1.l.google.com:19302' },
  //         // Add TURN server configuration here
  //       ]
  //     }
  //   });

  //   return new Promise((resolve, reject) => {
  //     this.peer.on('open', (id) => {
  //       console.log('PeerJS: My peer ID is:', id);
  //       this.localPeerIdBs.next(id);
  //       this.socket.emit('join-room', this.roomId, id);
  //       resolve();
  //     });

  //     this.peer.on('error', (error) => {
  //       console.error('PeerJS error:', error);
  //       this.toaster.showError('Connection Error', error.toString());
  //       reject(error);
  //     });

  //     this.peer.on('disconnected', () => {
  //       console.log('PeerJS: Disconnected from server, attempting to reconnect');
  //       this.peer.reconnect();
  //     });
  //   });
  // }


  async initializeAudioCall(channelId: string): Promise<void> {
    if (this.peer) {
      this.peer.destroy();
    }
    this.roomId = `audio-room-${channelId}`;
    const userId = await this.userService.getUserId();
    if (!userId) {
      throw new Error('User ID not available');
    }
  
    const timestamp = Date.now();
    const peerId = `${userId}-${timestamp}`;
  
    this.peer = new Peer(peerId, {
      debug: 3,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      }
    });
  
    return new Promise((resolve, reject) => {
      this.peer.on('open', (id) => {
        console.log('PeerJS: My peer ID is:', id);
        this.localPeerIdBs.next(id);
        
        // Disconnect any existing connections for this user
        this.socket.emit('disconnect-existing-user', userId, this.roomId);
        
        // Join the room with the new peer ID
        this.socket.emit('join-room', this.roomId, id, userId);
        resolve();
      });
  
      this.peer.on('error', (error) => {
        if (error.type === 'unavailable-id') {
          console.log('PeerJS: ID already taken, retrying...');
          this.initializeAudioCall(channelId); // Retry with a new timestamp
        } else {
          console.error('PeerJS error:', error);
          this.toaster.showError('Connection Error', error.toString());
          reject(error);
        }
      });
  
      this.peer.on('disconnected', () => {
        console.log('PeerJS: Disconnected from server, attempting to reconnect');
        this.peer.reconnect();
      });
    });
  }


  
  async joinAudioRoom(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.localStreamBs.next(stream);

      this.peer.on('call', (call) => {
        call.answer(stream);
        this.handleIncomingAudioCall(call);
      });

      this.isCallStartedBs.next(true);
    } catch (error) {
      console.error('Error accessing audio devices:', error);
      this.toaster.showError('Audio Error', 'Failed to access microphone');
      throw error;
    }
  }

  private callPeer(peerId: string, stream: MediaStream): void {
    console.log('PeerJS: Calling peer:', peerId);
    const call = this.peer.call(peerId, stream);
    this.handleIncomingAudioCall(call);
  }

  private handleIncomingAudioCall(call: MediaConnection): void {
    call.on('stream', (remoteStream) => {
      this.ngZone.run(() => {
        const remoteStreams = this.remoteStreamsBs.value;
        remoteStreams.set(call.peer, remoteStream);
        this.remoteStreamsBs.next(remoteStreams);
        this.checkNetworkQuality(call.peerConnection);
      });
    });

    call.on('close', () => {
      this.handlePeerDisconnection(call.peer);
    });

    this.connections.set(call.peer, call);
  }

  private handlePeerDisconnection(peerId: string): void {
    this.ngZone.run(() => {
      if (this.connections.has(peerId)) {
        this.connections.get(peerId)!.close();
        this.connections.delete(peerId);
        const remoteStreams = this.remoteStreamsBs.value;
        remoteStreams.delete(peerId);
        this.remoteStreamsBs.next(remoteStreams);
      }
    });
  }

  toggleAudio(mute: boolean): void {
    this.localStreamBs.value?.getAudioTracks().forEach(track => track.enabled = !mute);
  }

  private checkNetworkQuality(connection: RTCPeerConnection): void {
    const interval = setInterval(() => {
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
    }, 5000);

    // Clear interval when connection is closed
    connection.oniceconnectionstatechange = () => {
      if (connection.iceConnectionState === 'disconnected' || 
          connection.iceConnectionState === 'failed' || 
          connection.iceConnectionState === 'closed') {
        clearInterval(interval);
      }
    };
  }

  getUserName(peerId: string): Observable<string> {
    const userId = this.extractUserId(peerId);
    if (this.userNames.has(userId)) {
      return of(this.userNames.get(userId)!);
    } else {
      return this.userService.getUserDataForFriend(userId).pipe(
        tap(userData => {
          this.userNames.set(userId, userData.username);
        }),
        map(userData => userData.username),
        catchError(error => {
          console.error('Error fetching user data:', error);
          return of(`User ${userId.substr(0, 8)}`);
        }),
        retry(3)
      );
    }
  }

  private extractUserId(peerId: string): string {
    return peerId.split('-')[0];
  }

  destroyPeerConnection(): void {
    if (this.peer && !this.peer.destroyed) {
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
    this.destroyPeerConnection();
    this.socket.emit('leave-room', this.roomId, this.peer?.id);
    this.toaster.showInfo('Call Ended', 'You have left the Voice call');
  }

  // New method to manually reconnect
  manualReconnect(): void {    
    this.socket.connect();
    if (this.peer && this.peer.disconnected) {
      this.peer.reconnect();
    }
  }
}