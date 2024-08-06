import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { InviteUserModalComponent } from '../invite-user-modal/invite-user-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../service/user/user.service';
import { ServerService } from '../../../../service/server/server.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../service/toster/toster-service.service';
import { ICategory } from '../../../../interface/server/categories';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.scss'
})
export class CreateCategoryComponent {

  serverId!:string 
  @Output() categoryCreated = new EventEmitter<ICategory>() 
  name!:string
  constructor(public dialogRef: MatDialogRef<CreateCategoryComponent>,private serverService:ServerService,
    private toaster:ToastService,
    @Inject(MAT_DIALOG_DATA) public data: { serverId: string }
  ) {
    this.serverId = data.serverId
  }

  close() {
    this.dialogRef.close()
  }

    createCategory(){
    this.serverService.createCategory(this.serverId,this.name).subscribe({
      next:(response)=>{
        console.log(response);
        this.toaster.showSuccess('Success','Category created Successfully')
        this.categoryCreated.emit(response.category)
        this.dialogRef.close()
      },
      error:(error)=>{
        console.log(error);
        this.toaster.showError('Error','Something went wrong')
      }
    })
  }
}
