import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule, InputOtpModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent {
  value: any;
}
