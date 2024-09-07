import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../../../service/user/user.service';
import { FriendSidebarToggleService } from '../../../../service/friend-sidebar-toggle/friend-sidebar-toggle.service';

@Component({
  selector: 'app-direct-chat-header',
  standalone: true,
  imports: [RouterLinkActive,RouterLink,AsyncPipe,RouterLink],
  templateUrl: './direct-chat-header.component.html',
  styleUrl: './direct-chat-header.component.scss'
})
export class DirectChatHeaderComponent {

  @Input() name:string = ''
  @Input() userImage:string|null = null
  @Input() isFriendOnline:Observable<boolean> | undefined 
  @Input() friendId:string = ''
  userId!:string|null

  constructor(private userService:UserService,private sidebarToggleService: FriendSidebarToggleService) {
    
  }

  async ngOnInit() {
    this.userId = await this.userService.getUserId()
  }


  setupSidebarToggles() {
    this.sidebarToggleService.toggleSidebar();
  }
}
