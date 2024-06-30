import { Component } from '@angular/core';
import { FriendsHeaderComponent } from '../reuse/friends-header/friends-header.component';
import { FriendsSidebarComponent } from '../reuse/friends-sidebar/friends-sidebar.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { User } from '../../../interface/user/user.model';

@Component({
  selector: 'app-all-friends',
  standalone: true,
  imports: [FriendsHeaderComponent,FriendsSidebarComponent,FormsModule,],
  templateUrl: './all-friends.component.html',
  styleUrl: './all-friends.component.scss'
})
export class AllFriendsComponent {

  query!:string
  users!:User[]  
  constructor(private userService:UserService) {
    
  }

  ngOnInit(): void {
    this.getAllFriends()
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
}
