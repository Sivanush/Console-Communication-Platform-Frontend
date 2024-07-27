import { Injectable } from '@angular/core';
import Peer, { MediaConnection, PeerJSOption } from 'peerjs';
import { ToastService } from '../toster/toster-service.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerVideoCallService {
  constructor(private toaster: ToastService) { }

  private _peer!: Peer;
  private _roomId!: string;
  private _isHost: boolean = false;

  localStreamBs: BehaviorSubject<MediaStream | null> = new BehaviorSubject<MediaStream | null>(null);
  remoteStreamsBs: BehaviorSubject<MediaStream[]> = new BehaviorSubject<MediaStream[]>([]);

  private _isCallStartedBs = new Subject<boolean>();
  public isCallStarted$ = this._isCallStartedBs.asObservable();

  async initPeer(channelId: string): Promise<void> {
    this._roomId = `video-room-${channelId}`;
    const peerJsOptions: PeerJSOption = {
      debug: 3,
      config: {
        iceServers: [
          {
            urls: [
              'stun:stun1.l.google.com:19302',
              'stun:stun2.l.google.com:19302',
            ]
          }
        ]
      }
    };

    return new Promise((resolve, reject) => {
      this._peer = new Peer(this._roomId, peerJsOptions);

      this._peer.on('open', (id) => {
        console.log('My peer ID is:', id);
        this._isHost = true;  // First to connect becomes host
        resolve();
      });

      this._peer.on('error', (error: any) => {
        if (error.type === 'unavailable-id') {
          // ID is taken, so we're not the host. Create a new peer with a unique ID
          this._peer = new Peer(peerJsOptions);
          this._peer.on('open', (id) => {
            console.log('My peer ID is:', id);
            resolve();
          });
        } else {
          console.error('PeerJS error:', error);
          this.toaster.showError('PeerJS Error', error.toString());
          reject(error);
        }
      });
    });
  }

  async joinRoom(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localStreamBs.next(stream);

      if (this._isHost) {
        this.waitForPeers();
      } else {
        await this.connectToHost();
      }

    } catch (error) {
      console.error('Error accessing media devices:', error);
      this.toaster.showError('Media Error', 'Failed to access camera or microphone');
    }
  }

  private waitForPeers(): void {
    console.log('Waiting for peers to connect...');
    this._peer.on('call', (call) => {
      call.answer(this.localStreamBs.value!);
      this.handleIncomingStream(call);
    });
  }

  private async connectToHost(): Promise<void> {
    return new Promise((resolve, reject) => {
      const call = this._peer.call(this._roomId, this.localStreamBs.value!);
      this.handleIncomingStream(call);
      resolve();
    });
  }

  private handleIncomingStream(call: MediaConnection): void {
    call.on('stream', (remoteStream) => {
      console.log('Received remote stream');
      this.addRemoteStream(remoteStream);
    });

    call.on('error', (error) => {
      console.error('Call error:', error);
      this.toaster.showError('Call Error', error.toString());
    });
  }

  private addRemoteStream(remoteStream: MediaStream): void {
    const currentStreams = this.remoteStreamsBs.value;
    if (!currentStreams.find(stream => stream.id === remoteStream.id)) {
      this.remoteStreamsBs.next([...currentStreams, remoteStream]);
    }
    this._isCallStartedBs.next(true);
  }

  closeMediaCall() {
    this._peer?.disconnect();
    this._peer?.destroy();
    this.onCallClose();
  }

  private onCallClose(): void {
    this.remoteStreamsBs.value.forEach(stream => {
      stream.getTracks().forEach(track => track.stop());
    });
    this.localStreamBs.value?.getTracks().forEach(track => track.stop());
    this.remoteStreamsBs.next([]);
    this.localStreamBs.next(null);
    this._isCallStartedBs.next(false);
    this.toaster.showSuccess('Call Ended', 'The call has been ended');
  }

  destroyPeer() {
    this.closeMediaCall();
  }
}
