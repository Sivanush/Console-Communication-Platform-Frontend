// import { Injectable } from '@angular/core';
// import Peer, { MediaConnection } from 'peerjs';
// import { BehaviorSubject, Subject } from 'rxjs';
// import { ToastService } from '../toster/toster-service.service';
// import { UserService } from '../user/user.service';


// @Injectable({
//   providedIn: 'root'
// })
// export class DirectCallService {
//   private peer!: Peer;
//   private currentCall: MediaConnection | null = null;

//   localStreamBS = new BehaviorSubject<MediaStream | null>(null);
//   remoteStreamBS = new BehaviorSubject<MediaStream | null>(null);
//   incomingCallBS = new Subject<{ callerId: string, isVideo: boolean }>();
//   callEndedBS = new Subject<void>();
//   isInCallBS = new BehaviorSubject<boolean>(false);
//   private userId: string | null = null;

//   constructor(private toaster: ToastService, private userService: UserService) {
//     window.addEventListener('beforeunload', () => this.cleanup());
//   }

//   async initializePeer(userId: string): Promise<void> {
//     if (this.peer) {
//       console.log('Peer already initialized');
//       return;
//     }
//     this.userId = userId;
//     await this.createNewPeer();
//   }

//   private async createNewPeer(): Promise<void> {
//     if (this.peer) {
//       this.peer.destroy();
//     }

//     return new Promise((resolve, reject) => {
//       this.peer = new Peer(this.userId!, {
//         config: {
//           iceServers: [
//             { urls: 'stun:stun.l.google.com:19302' },
//             { urls: 'stun:stun1.l.google.com:19302' }
//           ]
//         }
//       });

//       this.peer.on('open', () => {
//         console.log('Peer initialized with ID:', this.userId);
//         resolve();
//       });

//       this.peer.on('error', (error) => {
//         console.error('Peer error:', error);
//         if (error.type === 'disconnected'|| error.type === 'network') {
//           this.handleDisconnection();
//         }
//         reject(error);
//       });

//       this.peer.on('call', (call) => {
//         const isVideo = call.metadata?.isVideo ?? false;
//         this.incomingCallBS.next({ callerId: call.peer, isVideo });
//         this.currentCall = call;
//       });
//     });
//   }

//   private handleDisconnection() {
//     console.log('Peer disconnected. Attempting to reconnect...');
//     this.toaster.showInfo('Peer disconnected. Attempting to reconnect...');
//     setTimeout(() => {
//       this.createNewPeer();
//     }, 5000);
//   }

//   async startCall(friendId: string, isVideo: boolean): Promise<void> {
//     if (!this.peer|| this.peer.disconnected) {
//       try {
//         await this.createNewPeer();
//       } catch (error) {
//         console.error('Failed to reinitialize peer:', error);
//         this.toaster.showError('Connection Error', 'Failed to establish connection. Please try again.');
//         throw error;
//       }
//     }

//     try {
//       console.log(`Starting ${isVideo ? 'video' : 'voice'} call with ${friendId}`);
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: isVideo });
//       this.localStreamBS.next(stream);

//       const call = this.peer.call(friendId, stream, { metadata: { isVideo } });
//       if (!call) {
//         throw new Error('Failed to create call');
//       }
//       this.handleCall(call);
//     } catch (error) {
//       console.error('Error starting call:', error);
//       this.toaster.showError('Call Error', 'Failed to start the call');
//       throw error;
//     }
//   }

//   async answerCall(isVideo: boolean): Promise<void> {
//     if (this.currentCall) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: isVideo });
//         this.localStreamBS.next(stream);
//         this.currentCall.answer(stream);
//         this.handleCall(this.currentCall);
//       } catch (error) {
//         console.error('Error answering call:', error);
//         this.toaster.showError('Call Error', 'Failed to answer the call');
//       }
//     }
//   }

//   private handleCall(call: MediaConnection): void {
//     this.currentCall = call;
//     this.isInCallBS.next(true);

//     call.on('stream', (remoteStream: MediaStream) => {
//       this.remoteStreamBS.next(remoteStream);
//     });

//     call.on('close', () => {
//       this.endCall();
//     });

//     call.on('error', (error) => {
//       console.error('Call error:', error);
//       this.toaster.showError('Call Error', 'An error occurred during the call');
//       this.endCall();
//     });
//   }

//   endCall(): void {
//     if (this.currentCall) {
//       this.currentCall.close();
//       this.currentCall = null;
//     }
//     this.localStreamBS.value?.getTracks().forEach(track => track.stop());
//     this.localStreamBS.next(null);
//     this.remoteStreamBS.next(null);
//     this.isInCallBS.next(false);
//     this.callEndedBS.next();

//     this.createNewPeer().catch(error => {
//       console.error('Failed to reinitialize peer after call:', error);
//     });
//   }

//   toggleAudio(mute: boolean): void {
//     this.localStreamBS.value?.getAudioTracks().forEach(track => track.enabled = !mute);
//   }

//   toggleVideo(turnOff: boolean): void {
//     this.localStreamBS.value?.getVideoTracks().forEach(track => track.enabled = !turnOff);
//   }

//   cleanup(): void {
//     this.endCall();
//     if (this.peer) {
//       this.peer.destroy();
//       // this.peer = null;
//     }
//     this.userId = null;
//   }

//   destroyPeer(): void {
//    this.cleanup()
//   }
// }








import { Injectable, NgZone } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import Peer, { MediaConnection } from 'peerjs';
import { ToastService } from '../toster/toster-service.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DirectCallService {
  peer!: Peer;
  private currentCall: MediaConnection | null = null;
  private localStream: MediaStream | null = null;

  public isInCallBS = new BehaviorSubject<boolean>(false);
  public incomingCallBS = new BehaviorSubject<{ callerId: string, isVideo: boolean } | null>(null);
  public remoteStreamBS = new BehaviorSubject<MediaStream | null>(null);

  constructor(
    private socket: Socket,
    private toaster: ToastService,
    private userService: UserService,
    private ngZone: NgZone,
    private router: Router,
    private location:Location
  ) {
    this.initializePeer();
    this.setupSocketListeners();
  }

  private async initializePeer() {
    const userId = await this.userService.getUserId();
    if (!userId) {
      throw new Error('User ID not available');
    }

    this.peer = new Peer(userId, {
      debug: 3,
      config: {
        iceServers: [
          {
            urls: 'turn:turn.assiststore.online:3478',
            username: 'user',
            credential: 'pass'
          }
        ]
      }
    });

    this.peer.on('call', (call) => {
      this.ngZone.run(() => {
        const callerId = call.peer;
        const isVideo = call.metadata?.isVideo || false;
        this.incomingCallBS.next({ callerId, isVideo });

        // Store the call to be answered later
        this.currentCall = call;
      });
    });
  }

  private setupSocketListeners() {
    this.socket.on('call-rejected', (calleeId: string) => {
      this.ngZone.run(() => {
        if (this.currentCall && this.currentCall.peer === calleeId) {
          this.toaster.showInfo('Call Rejected', 'The user rejected your call');
          this.endCall();
        }
      });
    });
  }

  async startCall(calleeId: string, isVideo: boolean): Promise<void> {
    if (this.isInCallBS.getValue()) {
      this.toaster.showInfo('Call in Progress', 'You are already in a call');
      return;
    }

    try {
      const stream = await this.getMediaStream(isVideo);
      this.localStream = stream;

      const call = this.peer.call(calleeId, stream, { metadata: { isVideo } });
      this.currentCall = call;
      this.isInCallBS.next(true);

      call.on('stream', (remoteStream) => {
        this.ngZone.run(() => {
          this.remoteStreamBS.next(remoteStream);
          const route = isVideo ? 'direct-video-chat' : 'direct-voice-chat';
          this.router.navigate([`/${route}/${this.peer.id}/${calleeId}`]);
        });
      });

      call.on('close', () => {
        this.ngZone.run(() => {
          this.endCall();
        });
      });

      // Notify the callee through your signaling server
      this.socket.emit('initiate-call', calleeId, isVideo);
    } catch (error) {
      console.error('Error starting call:', error);
      this.toaster.showError('Call Error', 'Failed to start the call');
      this.isInCallBS.next(false);
    }
  }

  async answerCall(isVideo: boolean): Promise<void> {
    if (!this.currentCall) {
      throw new Error('No incoming call to answer');
    }

    try {
      const stream = await this.getMediaStream(isVideo);
      this.localStream = stream;

      this.currentCall.answer(stream);
      this.isInCallBS.next(true);

      this.currentCall.on('stream', (remoteStream) => {
        this.ngZone.run(() => {
          this.remoteStreamBS.next(remoteStream);
        });
      });

      this.incomingCallBS.next(null);
    } catch (error) {
      console.error('Error accepting call:', error);
      this.toaster.showError('Call Error', 'Failed to accept the call');
      this.isInCallBS.next(false);
    }
  }

  endCall(): void {
    if (this.currentCall) {
      this.currentCall.close();
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    this.currentCall = null;
    this.localStream = null;
    this.remoteStreamBS.next(null);
    this.isInCallBS.next(false);
    // this.router.navigate(['/']); // Navigate back to the main page or wherever appropriate
    // this.location.back()
  }

  private async getMediaStream(isVideo: boolean): Promise<MediaStream> {
    const constraints = {
      audio: true,
      video: isVideo
    };
    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  toggleAudio(mute: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => track.enabled = !mute);
    }
  }

  toggleVideo(turnOff: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => track.enabled = !turnOff);
    }
  }
}