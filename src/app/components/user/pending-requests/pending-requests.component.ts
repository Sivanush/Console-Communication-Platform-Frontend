import { Component } from '@angular/core';

import { MainSidebarComponent } from '../reuse/main-sidebar/main-sidebar.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { User, UserRequestI } from '../../../interface/user/user.model';
import { FriendsHeaderComponent } from '../reuse/friends-header/friends-header.component';
import { FriendsSidebarComponent } from '../reuse/friends-sidebar/friends-sidebar.component';

@Component({
  selector: 'app-pending-requests',
  standalone: true,
  imports: [FriendsHeaderComponent,FriendsSidebarComponent,MainSidebarComponent,FormsModule],
  templateUrl: './pending-requests.component.html',
  styleUrl: './pending-requests.component.scss'
})
export class PendingRequestsComponent {

  query!:string
  users!:UserRequestI[]
  
  constructor(private userService:UserService) {
    
  }

  ngOnInit(): void {

    this.getPendingRequests()
  }

  getPendingRequests(){
    this.userService.listPendingFriendRequest().subscribe({
      next:(response)=>{
        // console.log(response);
        this.users = response.requests
        console.log(this.users);
        
      },
      error:(err)=>{
        console.log(err.message);
        
      }
    })
  }



  acceptFriendRequest(requestId:string){
    this.userService.acceptFriendRequest(requestId).subscribe({
      next:(response)=>{
        console.log(response);
        // this.users = response.requests
        // console.log(this.users);
        
      },
      error:(err)=>{
        console.log(err.message);
        
      }
    })
  }
}
