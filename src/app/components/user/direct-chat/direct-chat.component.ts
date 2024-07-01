import { Component } from '@angular/core';
import { FriendsSidebarComponent } from '../reuse/friends-sidebar/friends-sidebar.component';
import { FriendsHeaderComponent } from '../reuse/friends-header/friends-header.component';

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [FriendsSidebarComponent,FriendsHeaderComponent],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
})
export class DirectChatComponent {

}
