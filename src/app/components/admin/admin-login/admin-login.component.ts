import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../service/toster/toster-service.service';
import { AdminService } from '../../../service/admin/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {

  adminForm: FormGroup

  constructor(private fb: FormBuilder, private adminService:AdminService,private toster:ToastService) {
    this.adminForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }
   


  login() {
    if (this.adminForm.valid) {
      let data = this.adminForm.value
      this.adminService.login(data).subscribe({
        next:(response)=>{
          console.log('Success',response);
          localStorage.setItem('adminToken',response.result)
          this.toster.showSuccess('Success',response.message)
        },
        error:(err)=>{
          console.log('Error ',err.error.error);
          
          this.toster.showError('Error',err.error.error)
        }

      })
    } else {
      this.toster.showError("Login Failed","Please check your credentials and try again.")
    }
  }


}
