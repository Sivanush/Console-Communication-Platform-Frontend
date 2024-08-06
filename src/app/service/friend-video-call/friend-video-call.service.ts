  // import { Injectable } from '@angular/core';
  // import { ToastService } from '../toster/toster-service.service';
  // import Peer, { MediaConnection, PeerJSOption } from 'peerjs';
  // import { BehaviorSubject, Subject } from 'rxjs';
  // import { Location } from '@angular/common';

  // @Injectable({
  //   providedIn: 'root'
  // })
  // export class FriendVideoCallService {
  //   private peer!: Peer;
  //   private currentCall: MediaConnection | null = null;
  //   private localStream: MediaStream | null = null;


  //   public localStreamBS = new BehaviorSubject<MediaStream | null>(null);
  //   public remoteStreamBS = new BehaviorSubject<MediaStream | null>(null);
  //   public incomingCallBS = new Subject<string>();
  //   public callEndedBS = new Subject<void>();
  //   public isInCallBS = new BehaviorSubject<boolean>(false);


  //   public isCallInProgress = new BehaviorSubject<boolean>(false);


  //   constructor(
  //     private toaster: ToastService,
  //     private location:Location
  //   ) {}

  //   async initializePeer(userId: string): Promise<void> {
  //     if (this.peer) {
  //       this.peer.destroy();
  //     }

  //     return new Promise((resolve, reject) => {
  //       this.peer = new Peer(userId, {
  //         config: {
  //           iceServers: [{ urls: 'stun:stun.l.google.com:19302' },{ urls: 'stun:stun1.l.google.com:19302' }]
  //         }
  //       });

  //       this.peer.on('open', () => {
  //         console.log('Peer initialized with ID:', userId);
  //         resolve();
  //       });

  //       this.peer.on('error', (error) => {
  //         console.error('Peer error:', error);
  //         reject(error);
  //       });

  //       this.peer.on('connection', (conn) => {
  //         conn.on('data', (data:any) => {
  //           if (data.type === 'call-rejected') {
  //             this.handleCallRejected();
  //           }
  //         });
  //       });
        

  //       this.peer.on('call', (call) => {
  //          if (!this.isCallInProgress.getValue()) {
  //         this.incomingCallBS.next(call.peer);
  //         this.currentCall = call;
  //       } else {
  //         call.close()
  //       }
  //       });
  //     });
  //   }

  //   private handleCallRejected(): void {
  //     this.toaster.showError('Call Rejected', 'The user rejected your call.');
  //     this.endCall(); // End any ongoing call
  //     // this.location.back() 
  //   }
    

    

  //   async startCall(friendId: string): Promise<void> {
  //     try {
  //       this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //       this.localStreamBS.next(this.localStream);

  //       this.currentCall?.on('close', () => this.handleCallEnded());

  //       const call = this.peer.call(friendId, this.localStream);
  //       this.handleCall(call);
  //     } catch (error) {
  //       console.error('Error starting call:', error);
  //       this.toaster.showError('Call Error', 'Failed to start the call');
  //     }
  //   }

  //   async answerCall(): Promise<void> {
  //     if (this.currentCall) {
  //       try {
  //         this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //         this.localStreamBS.next(this.localStream);
  //         this.currentCall.answer(this.localStream);
  //         this.currentCall.on('close', () => this.handleCallEnded());
  //         this.handleCall(this.currentCall);
  //       } catch (error) {
  //         console.error('Error answering call:', error);
  //         this.toaster.showError('Call Error', 'Failed to answer the call');
  //       }
  //     }
  //   }

  //   sendCallRejection(callerId: string): void {
  //     const conn = this.peer.connect(callerId);
  //     conn.on('open', () => {
  //       conn.send({ type: 'call-rejected' });
  //       conn.close();
  //     });
  //   }
    



    

  //   private handleCall(call: MediaConnection): void {
  //     this.currentCall = call;
  //     this.isInCallBS.next(true);
  //     this.isCallInProgress.next(true);

  //     call.on('stream', (remoteStream: MediaStream) => {
  //       this.remoteStreamBS.next(remoteStream);
  //     });

  //     call.on('close', () => {
  //       this.endCall();
  //     });
  //   }

  //   endCall(): void {
  //     if (this.currentCall) {
  //       this.currentCall.close();
  //       this.currentCall = null;
  //     }
    
  //     if (this.localStream) {
  //       this.localStream.getTracks().forEach(track => track.stop());
  //       this.localStream = null;
  //     }
    
  //     this.localStreamBS.next(null);
  //     this.remoteStreamBS.next(null);
  //     this.isInCallBS.next(false);
  //     this.isCallInProgress.next(false);
  //     this.callEndedBS.next();
  //   }
    
    



  //   private handleCallEnded(): void {
  //     // this.location.back()
  //     this.endCall(); // This will ensure everything is properly cleaned up.
  //     this.callEndedBS.next(); // Notify that the call has ended
  //   }
    

  //   rejectCall(): void {
  //     if (this.currentCall) {
  //       this.sendCallRejection(this.currentCall.peer);
  //       this.currentCall.close();
  //     }
  //     this.currentCall = null;
  //   }

  //   toggleAudio(mute: boolean): void {
  //     if (this.localStream) {
  //       this.localStream.getAudioTracks().forEach(track => track.enabled = !mute);
  //     }
  //   }

  //   toggleVideo(turnOff: boolean): void {
  //     if (this.localStream) {
  //       this.localStream.getVideoTracks().forEach(track => track.enabled = !turnOff);
  //     }
  //   }

  //   destroyPeer(): void {
  //     this.endCall();
  //     if (this.peer) {
  //       this.peer.destroy();
  //     }
  //   }
  // }





















































  import { Injectable } from '@angular/core';
  import Peer, { MediaConnection } from 'peerjs';
  import { BehaviorSubject, Subject } from 'rxjs';
  import { ToastService } from '../toster/toster-service.service';

  @Injectable({
    providedIn: 'root'
  })
  export class FriendVideoCallService {
    private peer!: Peer;
    private currentCall: MediaConnection | null = null;

    localStreamBS = new BehaviorSubject<MediaStream | null>(null);
    remoteStreamBS = new BehaviorSubject<MediaStream | null>(null);
    incomingCallBS = new Subject<string>();
    callEndedBS = new Subject<void>();
    isInCallBS = new BehaviorSubject<boolean>(false);

    constructor(private toaster: ToastService) {}

    async initializePeer(userId: string): Promise<void> {
      if (this.peer) {
        this.peer.destroy();
      }

      return new Promise((resolve, reject) => {
        this.peer = new Peer(userId, {
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' }
            ]
          }
        });

        this.peer.on('open', () => {
          console.log('Peer initialized with ID:', userId);
          resolve();
        });

        this.peer.on('error', (error) => {
          console.error('Peer error:', error);
          reject(error);
        });

        this.peer.on('call', (call) => {
          this.incomingCallBS.next(call.peer);
          this.currentCall = call;
        });
      });
    }

    async startCall(friendId: string): Promise<void> {
      try {
        
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        this.localStreamBS.next(stream);

        const call = this.peer.call(friendId, stream);
        this.handleCall(call);
        
      } catch (error) {
        console.error('Error starting call:', error);
        this.toaster.showError('Call Error', 'Failed to start the call');
      }
    }

    async answerCall(): Promise<void> {
      if (this.currentCall) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          this.localStreamBS.next(stream);
          this.currentCall.answer(stream);
          this.handleCall(this.currentCall);
        } catch (error) {
          console.error('Error answering call:', error);
          this.toaster.showError('Call Error', 'Failed to answer the call');
        }
      }
    }

    private handleCall(call: MediaConnection): void {
      this.currentCall = call;
      this.isInCallBS.next(true);

      call.on('stream', (remoteStream: MediaStream) => {
        this.remoteStreamBS.next(remoteStream);
      });

      call.on('close', () => {
        this.endCall();
      });
    }

    endCall(): void {
      if (this.currentCall) {
        this.currentCall.close();
      }
      this.localStreamBS.value?.getTracks().forEach(track => track.stop());
      this.localStreamBS.next(null);
      this.remoteStreamBS.next(null);
      this.isInCallBS.next(false);
      this.callEndedBS.next();
    }

    toggleAudio(mute: boolean): void {
      this.localStreamBS.value?.getAudioTracks().forEach(track => track.enabled = !mute);
    }

    toggleVideo(turnOff: boolean): void {
      this.localStreamBS.value?.getVideoTracks().forEach(track => track.enabled = !turnOff);
    }

    destroyPeer(): void {
      this.endCall();
      if (this.peer) {
        this.peer.destroy();
      }
    }
  }