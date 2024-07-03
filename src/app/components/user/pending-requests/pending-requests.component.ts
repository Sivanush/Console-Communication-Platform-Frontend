import { Component } from '@angular/core';


import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { User, UserRequestI } from '../../../interface/user/user.model';
import { ToastService } from '../../../service/toster/toster-service.service';
import { FriendsSidebarComponent } from '../shared/friends-sidebar/friends-sidebar.component';
import { MainSidebarComponent } from '../shared/main-sidebar/main-sidebar.component';
import { FriendsHeaderComponent } from '../shared/friends-header/friends-header.component';

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
  
  constructor(private userService:UserService,private toaster:ToastService) {
    
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
        this.ngOnInit()
        this.toaster.showSuccess('Success',response.message)
        
      },
      error:(err)=>{
        console.log(err.message);
        
      }
    })
  }


  rejectFriendRequest(requestId:string){
    this.userService.rejectFriendRequest(requestId).subscribe({
      next:(response)=>{
        this.ngOnInit()
        console.log(response);
        this.toaster.showSuccess('Success',response.message)

        // this.users = response.requests
        // console.log(this.users);
        
      },
      error:(err)=>{
        console.log(err.message);
        
      }
    })
  }
}
