import { Injectable } from '@angular/core';
import Peer, { MediaConnection } from 'peerjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToastService } from '../toster/toster-service.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class FriendVoiceCallService {
  private peer!: Peer;
  private currentCall: MediaConnection | null = null;

  localStreamBS = new BehaviorSubject<MediaStream | null>(null);
  remoteStreamBS = new BehaviorSubject<MediaStream | null>(null);
  incomingCallBS = new Subject<string>();
  callEndedBS = new Subject<void>();
  isInCallBS = new BehaviorSubject<boolean>(false);
  private userId: string | null = null;

  constructor(private toaster: ToastService, private userService: UserService) {}

  async initializePeer(userId: string): Promise<void> {
    this.userId = userId;
    await this.createNewPeer();
  }

  private async createNewPeer(): Promise<void> {
    if (this.peer) {
      this.peer.destroy();
    }

    this.userId = await this.userService.getUserId();
    return new Promise((resolve, reject) => {
      this.peer = new Peer(this.userId!, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        }
      });

      this.peer.on('open', () => {
        console.log('Peer initialized with ID:', this.userId);
        resolve();
      });

      this.peer.on('error', (error) => {
        console.error('Peer error:', error);
        if (error.type === 'disconnected') {
          this.handleDisconnection();
        }
        reject(error);
      });

      this.peer.on('call', (call) => {
        this.incomingCallBS.next(call.peer);
        this.currentCall = call;
      });
    });
  }

  private handleDisconnection() {
    console.log('Peer disconnected. Attempting to reconnect...');
    this.toaster.showInfo('Peer disconnected. Attempting to reconnect...');
    setTimeout(() => {
      this.createNewPeer();
    }, 5000);
  }

  async startCall(friendId: string): Promise<void> {
    if (!this.peer || this.peer.disconnected) {
      try {
        await this.createNewPeer();
      } catch (error) {
        console.error('Failed to reinitialize peer:', error);
        this.toaster.showError('Connection Error', 'Failed to establish connection. Please try again.');
        throw error;
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.localStreamBS.next(stream);

      const call = this.peer.call(friendId, stream);
      if (!call) {
        throw new Error('Failed to create call');
      }
      this.handleCall(call);
    } catch (error) {
      console.error('Error starting call:', error);
      this.toaster.showError('Call Error', 'Failed to start the call');
      throw error;
    }
  }

  async answerCall(): Promise<void> {
    if (this.currentCall) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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

    call.on('error', (error) => {
      console.error('Call error:', error);
      this.toaster.showError('Call Error', 'An error occurred during the call');
      this.endCall();
    });
  }

  endCall(): void {
    if (this.currentCall) {
      this.currentCall.close();
      this.currentCall = null;
    }
    this.localStreamBS.value?.getTracks().forEach(track => track.stop());
    this.localStreamBS.next(null);
    this.remoteStreamBS.next(null);
    this.isInCallBS.next(false);
    this.callEndedBS.next();

    this.destroyPeer();
    this.createNewPeer().catch(error => {
      console.error('Failed to reinitialize peer after ending call:', error);
    });
  }

  toggleAudio(mute: boolean): void {
    this.localStreamBS.value?.getAudioTracks().forEach(track => track.enabled = !mute);
  }

  destroyPeer(): void {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null!;
    }
    this.userId = null;
  }
}