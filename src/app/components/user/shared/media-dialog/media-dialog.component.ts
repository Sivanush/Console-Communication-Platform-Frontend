import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-media-dialog',
  standalone: true,
  imports: [],
  templateUrl: './media-dialog.component.html',
  styleUrl: './media-dialog.component.scss'
})
export class MediaDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { src: string, type: string }) { }
}
