import { Component } from '@angular/core';
import { MainSidebarComponent } from '../main-sidebar/main-sidebar.component';

@Component({
  selector: 'app-friends-sidebar',
  standalone: true,
  imports: [MainSidebarComponent],
  templateUrl: './friends-sidebar.component.html',
  styleUrl: './friends-sidebar.component.scss'
})
export class FriendsSidebarComponent {

}
