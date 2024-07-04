import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { User } from '../../../interface/user/user.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FriendsSidebarComponent } from '../shared/friends-sidebar/friends-sidebar.component';
import { FriendsHeaderComponent } from '../shared/friends-header/friends-header.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-all-friends',
  standalone: true,
  imports: [FriendsHeaderComponent  ,FriendsSidebarComponent,FormsModule,RouterLink,RouterLinkActive,DialogModule],
  templateUrl: './all-friends.component.html',
  styleUrl: './all-friends.component.scss'
})
export class AllFriendsComponent {

  profileVisible:boolean = false
  query!:string
  users!:User[] 
  userId!:string|null 
  viewedUser: User  = {} as User

  constructor(private userService:UserService) {
    
  }

  async ngOnInit() {
    this.getAllFriends()

    this.userId = await this.userService.getUserId()
    if (this.userId) {
      this.getAllFriends()
    }
  }

  getAllFriends(){
    this.userService.getAllFriends().subscribe({
      next: (response) => {
        console.log(response.friends)
        this.users = response.friends
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }



  toggleProfile(userId:string){

    this.userService.getUserDataForFriend(userId).subscribe({
      next:(response)=>{
        console.log('data: ',response)
        this.viewedUser = response;
        this.profileVisible = true;
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }
}
