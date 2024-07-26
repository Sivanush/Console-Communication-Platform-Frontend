import { Component, Inject } from '@angular/core';
import { ServerService } from '../../../../service/server/server.service';
import { ICategory } from '../../../../interface/server/categories';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../../../service/toster/toster-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss'
})
export class CreateChannelComponent {
  type: 'text' | 'voice'| 'video' = 'text';
  categoryId!: string
  name!: string
  serverId!: string
  categories!: ICategory[]
  constructor(private serverService: ServerService,
    public dialogRef: MatDialogRef<CreateChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { serverId: string },
    private toaster: ToastService,
  ) {
    this.serverId = data.serverId
  }
  ngOnInit(): void {
    this.serverService.getCategoriesUnderServer(this.serverId).subscribe({
      next: (data) => {
        console.log(data.categories)
        this.categories = data.categories
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  createChannel() {
    if (this.name && this.type && this.categoryId) {
      this.serverService.createChannel(this.name, this.type, this.categoryId).subscribe({
        next: (response) => {
          console.log(response);
          this.toaster.showSuccess('Success', 'Channel created Successfully')
          this.dialogRef.close()
        },
        error: (err) => {
          console.log(err);
          this.toaster.showError('Error', 'Something went wrong')

        }
      })

    } else {
      this.toaster.showWarn('Warning', 'Please fill all the fields')
    }
  }
}
