import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { ToggleUserProfileService } from '../../../../service/toggleUserProfile/toggle-user-profile.service';
import { UserService } from '../../../../service/user/user.service';

@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,UserProfileComponent],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.scss'
})
export class MainSidebarComponent {
  userProfile:boolean = false
  userImage:string = ''
  constructor(
    private userProfileService:ToggleUserProfileService,
    private userService:UserService
  ) {}


  ngOnInit(): void {
    this.getUserProfile()
    console.log(this.userImage);
    
  }

  getUserProfile(){
    this.userService.getUserData().subscribe({
      next:(response)=>{
        console.log(response);
        this.userImage = response.image
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  toggleUserProfile(){
    this.userProfileService.updateUserProfileValue(true)
  }
}
