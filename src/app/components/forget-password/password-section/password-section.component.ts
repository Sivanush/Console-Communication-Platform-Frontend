import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../service/toster/toster-service.service';

@Component({
  selector: 'app-password-section',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './password-section.component.html',
  styleUrl: './password-section.component.scss'
})
export class PasswordSectionComponent {
  
  token:string|null = null


  passwordForm: FormGroup

  constructor(private fb: FormBuilder,private userService:UserService,private activatedRoute: ActivatedRoute,private toaster:ToastService) {
    this.passwordForm = fb.group({
      password: ['', [Validators.required, Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/), Validators.minLength(8),]],
      newPassword: ['', [Validators.required]]
    })
  }


  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token')
    
  }


  resetPassword() {
    const newPassword = this.passwordForm.get('password')?.value
    this.userService.resetPassword(this.token,newPassword).subscribe({
      next:(response)=>{
        console.log('Success ',response);
        this.toaster.showSuccess('Success','Password Reset Successfully')
      },
      error:(err)=>{
        console.log('Error ',err);
        this.toaster.showError('Error',err.error.error)
      }
    })
  }
}
