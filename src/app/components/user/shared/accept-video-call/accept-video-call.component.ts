import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../service/user/user.service';
@Component({
  selector: 'app-accept-video-call',
  standalone: true,
  imports: [],
  templateUrl: './accept-video-call.component.html',
  styleUrl: './accept-video-call.component.scss'
})


export class AcceptVideoCallComponent implements OnInit, OnDestroy {
  username = '';
  userProfileImage = '';
  private audio: HTMLAudioElement | null = null;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<AcceptVideoCallComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { callerId: string, isVideo: boolean }
  ) {}

  ngOnInit(): void {
    this.userService.getUserDataForFriend(this.data.callerId).subscribe(data => {
      this.username = data.username;
      this.userProfileImage = data.image;
    });

    this.audio = new Audio('assets/music/notification.mp3');
    this.playNotificationSound();
  }

  ngOnDestroy(): void {
    this.stopNotificationSound();
  }

  playNotificationSound() {
    if (this.audio) {
      this.audio.volume = 0.5;
      this.audio.loop = true;
      this.audio.play().catch(error => console.error('Error playing notification sound:', error));
    }
  }

  stopNotificationSound() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  onAccept(): void {
    this.stopNotificationSound();
    this.dialogRef.close(true);
  }

  onReject(): void {
    this.stopNotificationSound();
    this.dialogRef.close(false);
  }
}