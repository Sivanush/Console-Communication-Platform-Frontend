import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-community-chat',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './community-chat.component.html',
  styleUrl: './community-chat.component.scss'
})
export class CommunityChatComponent {
message: any;
sendMessage() {
throw new Error('Method not implemented.');
}
formatTime(arg0: any) {
throw new Error('Method not implemented.');
}
msg: any;
userId: any;

}
