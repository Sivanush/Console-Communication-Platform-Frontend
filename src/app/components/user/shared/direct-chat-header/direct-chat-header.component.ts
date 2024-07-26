import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-direct-chat-header',
  standalone: true,
  imports: [RouterLinkActive,RouterLink,AsyncPipe],
  templateUrl: './direct-chat-header.component.html',
  styleUrl: './direct-chat-header.component.scss'
})
export class DirectChatHeaderComponent {
  @Input() name:string = ''
  @Input() userImage:string = ''
  @Input() isFriendOnline:Observable<boolean> | undefined 
  
}
