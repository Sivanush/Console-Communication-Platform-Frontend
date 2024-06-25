import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { ToastService } from '../../../service/toster/toster-service.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-email-section',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule,ProgressSpinnerModule],
  templateUrl: './email-section.component.html',
  styleUrl: './email-section.component.scss'
})
export class EmailSectionComponent {

  emailForm: FormGroup
  loading: boolean = false;

  constructor(private location: Location, private fb: FormBuilder, private userService: UserService, private toaster: ToastService) {
    this.emailForm = fb.group({
      email: ['', [Validators.email, Validators.required]]
    })
  }


  goBack(): void {
    this.location.back();
  }


  forgetPassword() {
    this.loading = true
    this.userService.forgetPassword(this.emailForm.value).subscribe({
      next: (response) => {
        this.loading = false
        console.log('Success', response)
        this.toaster.showSuccess('Success', response.message)
      },
      error: (err) => {
        console.log('Error', err)
        this.toaster.showError('Error', err.error.error)
      }
    })
  }




}
