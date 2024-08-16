import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-media-dialog',
  standalone: true,
  imports: [],
  templateUrl: './media-dialog.component.html',
  styleUrl: './media-dialog.component.scss'
})
export class MediaDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MediaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { src: string, type: string }) { }

    
    // private ignoreInitialClick = true;

    // ngAfterViewInit(): void {
    //   // Allow clicks after a small delay to prevent the dialog from closing immediately on open
    //   setTimeout(() => {
    //     this.ignoreInitialClick = false;
    //   }, 300);
    // }


  closeDialog(): void {
    this.dialogRef.close();
  }

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent): void {
  //   if (this.ignoreInitialClick) {
  //     return;
  //   }
  //   const clickedInside = (event.target as HTMLElement).closest('.dialog-content');
  //   if (!clickedInside) {
  //     this.closeDialog();
  //   }
  // }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}