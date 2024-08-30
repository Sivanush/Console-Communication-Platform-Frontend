import { Component, Input } from '@angular/core';


import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { User, UserRequestI } from '../../../interface/user/user.model';
import { ToastService } from '../../../service/toster/toster-service.service';
import { FriendsSidebarComponent } from '../shared/friends-sidebar/friends-sidebar.component';
import { MainSidebarComponent } from '../shared/main-sidebar/main-sidebar.component';
import { FriendsHeaderComponent } from '../shared/friends-header/friends-header.component';
import { CreateServerComponent } from "../shared/create-server/create-server.component";
 
import { Subscription } from 'rxjs';
import { ToggleCreateServerService } from '../../../service/toggleCreateServer/toggle-create-server.service';
import { ToggleUserProfileService } from '../../../service/toggleUserProfile/toggle-user-profile.service';
import { LoadingService } from '../../../service/loading/loading.service';

@Component({
    selector: 'app-pending-requests',
    standalone: true,
    templateUrl: './pending-requests.component.html',
    styleUrl: './pending-requests.component.scss',
    imports: [FriendsHeaderComponent, FriendsSidebarComponent, MainSidebarComponent, FormsModule, CreateServerComponent, ]
})
export class PendingRequestsComponent {

  profileVisible:boolean = false
  createServerVisible:boolean = false
  private subscription!: Subscription;

  query!:string
  users!:UserRequestI[]
  
  constructor(
    private userService:UserService,
    private toaster:ToastService,
    private userProfileService:ToggleUserProfileService,
    private toggleCreateServerService:ToggleCreateServerService,
    private loadingService:LoadingService
  ) {
    
  }

  ngOnInit(): void {
    this.loadingService.show()
    this.getPendingRequests()



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

  getPendingRequests(){
    this.userService.listPendingFriendRequest().subscribe({
      next:(response)=>{
        this.users = response.requests
        this.loadingService.hide()
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
