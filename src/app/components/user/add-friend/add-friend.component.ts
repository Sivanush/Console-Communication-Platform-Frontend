import { Component } from '@angular/core';

// import { MainSidebarComponent } from '../reuse/main-sidebar/main-sidebar.component';
import { UserService } from '../../../service/user/user.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { User } from '../../../interface/user/user.model';

import { ToastService } from '../../../service/toster/toster-service.service';
import { FriendsSidebarComponent } from '../shared/friends-sidebar/friends-sidebar.component';
import { FriendsHeaderComponent } from '../shared/friends-header/friends-header.component';
import { ToggleCreateServerService } from '../../../service/toggleCreateServer/toggle-create-server.service';
import { Subscription } from 'rxjs';
import { ToggleUserProfileService } from '../../../service/toggleUserProfile/toggle-user-profile.service';
import { CreateServerComponent } from "../shared/create-server/create-server.component";
import { UserProfileComponent } from "../user-profile/user-profile.component";

@Component({
    selector: 'app-add-friend',
    standalone: true,
    templateUrl: './add-friend.component.html',
    styleUrl: './add-friend.component.scss',
    imports: [FriendsHeaderComponent, FriendsSidebarComponent, FormsModule, JsonPipe, AsyncPipe, CreateServerComponent, UserProfileComponent]
})
export class AddFriendComponent {

  
  profileVisible:boolean = false
  createServerVisible:boolean = false
  private subscription!: Subscription;

  query!:string
  users!:User[]
  constructor(private userService:UserService,private toaster:ToastService,private toggleCreateServerService:ToggleCreateServerService, private userProfileService:ToggleUserProfileService) {}

  ngOnInit(): void {
    this.subscription = this.toggleCreateServerService.booleanValue$.subscribe({
      next: (value) => {
        this.createServerVisible = value 
        
      },
      error:(err)=> console.log(err)
    })

    this.subscription = this.userProfileService.booleanValue$.subscribe((data: boolean) => {
      this.profileVisible = data;

      
    });
  }
  searchUser() {
    if (this.query) { 
      this.userService.addFriends(this.query).subscribe({
        next: (response) => {
          console.log(response);
          this.users = response.users
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  onQueryChange() {
    this.searchUser();
  }


  sendFriendRequest(userId:string){
    this.userService.sendFriendRequest(userId).subscribe({
      next: (response) => {
        console.log(response);
        this.updateUserStatus(userId,'Sended')
        this.toaster.showSuccess('Success',response.message)
      },
      error:(err)=>{
        console.log(err);
        this.toaster.showError('Error',err.error.error)
      }
    })
  }

  updateUserStatus(userId:string,status:string){
    const userIndex = this.users.findIndex(user => user._doc._id == userId)
    console.log(this.users);
    
    if (userIndex !== -1) {
      this.users[userIndex].friendshipStatus = status
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
