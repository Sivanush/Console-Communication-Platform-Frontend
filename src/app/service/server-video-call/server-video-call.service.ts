// import { Injectable } from '@angular/core';
// import Peer, { MediaConnection, PeerJSOption } from 'peerjs';
// import { ToastService } from '../toster/toster-service.service';
// import { BehaviorSubject, Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ServerVideoCallService {
//   constructor(private toaster: ToastService) { }

//   private _peer!: Peer;
//   private _roomId!: string;
//   private _isHost: boolean = false;
//   private _connections: MediaConnection[] = [];
//   private _peers: Set<string> = new Set(); 

//   localStreamBs: BehaviorSubject<MediaStream | null> = new BehaviorSubject<MediaStream | null>(null);
//   remoteStreamsBs: BehaviorSubject<MediaStream[]> = new BehaviorSubject<MediaStream[]>([]);



//   private _isCallStartedBs = new Subject<boolean>();
//   public isCallStarted$ = this._isCallStartedBs.asObservable();

//   async initPeer(channelId: string): Promise<void> {
//     this._roomId = `video-room-${channelId}`;
//     const peerJsOptions: PeerJSOption = {
//       debug: 3,
//       config: {
//         iceServers: [
//           {
//             urls: [
//               'stun:stun1.l.google.com:19302',
//               'stun:stun2.l.google.com:19302',
//             ]
//           }
//         ]
//       }
//     };

//     return new Promise((resolve, reject) => {
//       this._peer = new Peer(this._roomId, peerJsOptions);

//       this._peer.on('open', (id) => {
//         console.log('My peer ID is:', id);
//         // this._isHost = true;  // First to connect becomes host
//         this._isHost = id === this._roomId;
//         resolve();
//       });

//       this._peer.on('error', (error: any) => {
//         if (error.type === 'unavailable-id') {
//           // ID is taken, so we're not the host. Create a new peer with a unique ID
//           this._peer = new Peer(peerJsOptions);
//           this._peer.on('open', (id) => {
//             console.log('My peer ID is:', id);
//             resolve();
//           });
//         } else {
//           console.error('PeerJS error:', error);
//           this.toaster.showError('PeerJS Error', error.toString());
//           reject(error);
//         }
//       });
//     });
//   }

//   async joinRoom(): Promise<void> {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       this.localStreamBs.next(stream);

//       if (this._isHost) {
//         this.waitForPeers();
//       } else {
//         await this.connectToHost();
//       }

//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//       this.toaster.showError('Media Error', 'Failed to access camera or microphone');
//     }
//   }

//   private waitForPeers(): void {
//     console.log('Waiting for peers to connect...');
//     this._peer.on('call', (call) => {
//       call.answer(this.localStreamBs.value!);
//       this.handleIncomingStream(call);
//     });
//   }

//   private async connectToHost(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       const call = this._peer.call(this._roomId, this.localStreamBs.value!);
//       this.handleIncomingStream(call);
//       resolve();
//     });
//   }

//   private handleIncomingStream(call: MediaConnection): void {
//     call.on('stream', (remoteStream) => {
//       console.log('Received remote stream');
//       this.addRemoteStream(remoteStream);
//     });

//     call.on('error', (error) => {
//       console.error('Call error:', error);
//       this.toaster.showError('Call Error', error.toString());
//     });
//   }

//   private addRemoteStream(remoteStream: MediaStream): void {
//     const currentStreams = this.remoteStreamsBs.value;
//     if (!currentStreams.find(stream => stream.id === remoteStream.id)) {
//       this.remoteStreamsBs.next([...currentStreams, remoteStream]);
//     }
//     this._isCallStartedBs.next(true);
//   }

//   closeMediaCall() {
//     this._peer?.disconnect();
//     this._peer?.destroy();
//     this.onCallClose();
//   }

//   private onCallClose(): void {
//     this.remoteStreamsBs.value.forEach(stream => {
//       stream.getTracks().forEach(track => track.stop());
//     });
//     this.localStreamBs.value?.getTracks().forEach(track => track.stop());
//     this.remoteStreamsBs.next([]);
//     this.localStreamBs.next(null);
//     this._isCallStartedBs.next(false);
//     this.toaster.showSuccess('Call Ended', 'The call has been ended');
//   }

//   destroyPeer() {
//     this.closeMediaCall();
//   }
// }

















import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import Peer, { MediaConnection } from 'peerjs';
import { ToastService } from '../toster/toster-service.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ServerVideoCallService {
    private peer!: Peer;
    private roomId!: string;
    private connections: Map<string, MediaConnection> = new Map();

    localStreamBs = new BehaviorSubject<MediaStream | null>(null);
    remoteStreamsBs = new BehaviorSubject<Map<string, MediaStream>>(new Map());
    isCallStartedBs = new BehaviorSubject<boolean>(false);

    constructor(
        private socket: Socket,
        private toaster: ToastService
    ) {
        this.setupSocketListeners();
    }

    private setupSocketListeners() {
        // this.socket.fromEvent<string>('user-joined').subscribe(peerId => {
        //   if (this.peer && this.localStreamBs.value) {
        //     this.callPeer(peerId, this.localStreamBs.value);
        //   }
        // });

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

        // this.socket.fromEvent<string[]>('existing-peers').subscribe(peerIds => {
        //   peerIds.forEach(peerId => {
        //     if (this.peer && this.localStreamBs.value) {
        //       this.callPeer(peerId, this.localStreamBs.value);
        //     }
        //   });
        // });


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

    // async initializePeerConnection(channelId: string): Promise<void> {
    //     this.roomId = `video-room-${channelId}`;
    //     this.peer = new Peer('', {
    //         debug: 3,
    //         config: {
    //             iceServers: [
    //                 { urls: 'stun:stun.l.google.com:19302' },
    //                 { urls: 'stun:stun1.l.google.com:19302' },
    //                 { urls: 'stun:stun2.l.google.com:19302' },
    //                 { urls: 'stun:stun3.l.google.com:19302' },
    //                 { urls: 'stun:stun4.l.google.com:19302' }
    //             ]
    //         }
    //     });

    //     return new Promise((resolve, reject) => {
    //         this.peer.on('open', (id) => {
    //             console.log('My peer ID is:', id);
    //             this.socket.emit('join-room', this.roomId, id);
    //             resolve();
    //         });

    //         this.peer.on('error', (error) => {
    //             console.error('PeerJS error:', error);
    //             this.toaster.showError('Connection Error', error.toString());
    //             reject(error);
    //         });
    //     });
    // }

    // async joinRoom(): Promise<void> {
    //     try {
    //         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    //         this.localStreamBs.next(stream);

    //         this.peer.on('call', (call) => {
    //             call.answer(stream);
    //             this.handleIncomingCall(call);
    //         });

    //         this.isCallStartedBs.next(true);
    //     } catch (error) {
    //         console.error('Error accessing media devices:', error);
    //         this.toaster.showError('Media Error', 'Failed to access camera or microphone');
    //     }
    // }

    // private callPeer(peerId: string, stream: MediaStream): void {
    //     const call = this.peer.call(peerId, stream);
    //     this.handleIncomingCall(call);
    // }

    // private handleIncomingCall(call: MediaConnection): void {
    //     call.on('stream', (remoteStream) => {
    //         console.log('Received remote stream from:', call.peer);
    //         const remoteStreams = this.remoteStreamsBs.value;
    //         remoteStreams.set(call.peer, remoteStream);
    //         this.remoteStreamsBs.next(remoteStreams);
    //     });







    async initializePeerConnection(channelId: string): Promise<void> {
        this.roomId = `video-room-${channelId}`;
        console.log('Initializing peer connection for room:', this.roomId);
        this.peer = new Peer('', {
          debug: 3, // Enable debug logs
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
            console.log('Emitting join-room event to server');
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
    
      async joinRoom(): Promise<void> {
        try {
          console.log('Attempting to join room and get user media');
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          console.log('Got user media stream');
          this.localStreamBs.next(stream);
    
          this.peer.on('call', (call) => {
            console.log('PeerJS: Receiving call from:', call.peer);
            call.answer(stream);
            this.handleIncomingCall(call);
          });
    
          this.isCallStartedBs.next(true);
        } catch (error) {
          console.error('Error accessing media devices:', error);
          this.toaster.showError('Media Error', 'Failed to access camera or microphone');
        }
      }
    
      private callPeer(peerId: string, stream: MediaStream): void {
        console.log('PeerJS: Calling peer:', peerId);
        const call = this.peer.call(peerId, stream);
        this.handleIncomingCall(call);
      }
    
      private handleIncomingCall(call: MediaConnection): void {
        call.on('stream', (remoteStream) => {
          console.log('PeerJS: Received remote stream from:', call.peer);
          const remoteStreams = this.remoteStreamsBs.value;
          remoteStreams.set(call.peer, remoteStream);
          this.remoteStreamsBs.next(remoteStreams);
        });


        call.on('close', () => {
            console.log('Call closed with:', call.peer);
            const remoteStreams = this.remoteStreamsBs.value;
            remoteStreams.delete(call.peer);
            this.remoteStreamsBs.next(remoteStreams);
        });

        this.connections.set(call.peer, call);
    }

    leaveRoom(): void {
        this.localStreamBs.value?.getTracks().forEach(track => track.stop());
        this.connections.forEach(connection => connection.close());
        this.connections.clear();
        this.remoteStreamsBs.next(new Map());
        this.localStreamBs.next(null);
        this.isCallStartedBs.next(false);
        this.peer.disconnect();
        this.socket.emit('leave-room', this.roomId, this.peer.id);
        this.toaster.showSuccess('Call Ended', 'You have left the video call');
    }
}
