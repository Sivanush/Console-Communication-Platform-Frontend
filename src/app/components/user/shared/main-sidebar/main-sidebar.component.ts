import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { ToggleUserProfileService } from '../../../../service/toggleUserProfile/toggle-user-profile.service';

@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,UserProfileComponent],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.scss'
})
export class MainSidebarComponent {
  userProfile:boolean = false

  constructor(private userProfileService:ToggleUserProfileService) {
    
  }

  toggleUserProfile(){
    this.userProfileService.updateUserProfileValue(true)
  }
}
