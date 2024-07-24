import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ToastService } from '../../../../service/toster/toster-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-invite-user-modal',
  standalone: true,
  imports: [DatePipe,MatButtonModule,SkeletonModule],
  templateUrl: './invite-user-modal.component.html',
  styleUrl: './invite-user-modal.component.scss'
  
})
export class InviteUserModalComponent {
  @Input() inviteLink: string = '';
  @Input() expiresAt: Date | null = null;
  @Output() closeModal = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<InviteUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { inviteLink: string; expiresAt: Date | null },
    private toaster: ToastService
  ) {
    this.inviteLink = data.inviteLink
  }
  copyToClipboard() {
    if (!this.inviteLink) {
      console.error('Invite link is not available');
      return;
    }
  
    navigator.clipboard.writeText(this.inviteLink).then(() => {
      console.log('Invite link copied to clipboard');
      this.toaster.showSuccess('Success', 'Invite link copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy text to clipboard', err);
      this.toaster.showError('Error', 'Failed to copy invite link to clipboard');
    });
  }
  
  close() {
    this.dialogRef.close()
  }
}
