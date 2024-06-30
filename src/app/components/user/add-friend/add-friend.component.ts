import { Component } from '@angular/core';

// import { MainSidebarComponent } from '../reuse/main-sidebar/main-sidebar.component';
import { UserService } from '../../../service/user/user.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { User } from '../../../interface/user/user.model';
import { FriendsHeaderComponent } from '../reuse/friends-header/friends-header.component';
import { FriendsSidebarComponent } from '../reuse/friends-sidebar/friends-sidebar.component';
import { ToastService } from '../../../service/toster/toster-service.service';

@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [FriendsHeaderComponent,FriendsSidebarComponent,FormsModule,JsonPipe,AsyncPipe],
  templateUrl: './add-friend.component.html',
  styleUrl: './add-friend.component.scss'
})
export class AddFriendComponent {


  query!:string
  users!:User[]
  constructor(private userService:UserService,private toaster:ToastService) {}


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

}
