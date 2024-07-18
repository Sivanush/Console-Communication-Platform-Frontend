import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { User } from '../../../interface/user/user.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FriendsSidebarComponent } from '../shared/friends-sidebar/friends-sidebar.component';
import { FriendsHeaderComponent } from '../shared/friends-header/friends-header.component';
import { DialogModule } from 'primeng/dialog';
import { Subscription } from 'rxjs';
import { UserProfileComponent } from "../user-profile/user-profile.component";
import { CreateServerComponent } from "../shared/create-server/create-server.component";
import { ToggleUserProfileService } from '../../../service/toggleUserProfile/toggle-user-profile.service';
import { ToggleCreateServerService } from '../../../service/toggleCreateServer/toggle-create-server.service';

@Component({
    selector: 'app-all-friends',
    standalone: true,
    templateUrl: './all-friends.component.html',
    styleUrl: './all-friends.component.scss',
    imports: [FriendsHeaderComponent, FriendsSidebarComponent, FormsModule, RouterLink, RouterLinkActive, DialogModule, UserProfileComponent, CreateServerComponent]
})
export class AllFriendsComponent {
  profileVisible:boolean = false
  createServerVisible:boolean = false
  private subscription!: Subscription;

  friendProfileVisible:boolean = false
  query!:string
  users!:User[] 
  userId!:string|null 
  viewedUser: User  = {} as User
  private subscriptions: Subscription = new Subscription();

  constructor(private userService:UserService, private userProfileService:ToggleUserProfileService, private toggleCreateServerService:ToggleCreateServerService) {
    
  }

  async ngOnInit() {
    this.getAllFriends()

    this.userId = await this.userService.getUserId()
    if (this.userId) {
      this.getAllFriends()
    }

    this.subscription = this.toggleCreateServerService.booleanValue$.subscribe({
      next: (value) => {
        this.createServerVisible = value 
        
      },
      error:(err)=> console.log(err)
    })

    this.subscription = this.userProfileService.booleanValue$.subscribe((data: boolean) => {
      this.profileVisible = data;
      console.log('Data Updated ',this.profileVisible);
      
    });


  }

  getAllFriends(){
    const friendsSubscription = this.userService.getAllFriends().subscribe({
      next: (response) => {
        console.log(response.friends)
        this.users = response.friends
      },
      error:(err)=>{
        console.log(err)
      }
    })
    this.subscriptions.add(friendsSubscription);
  }



  toggleProfile(userId:string){

    const profileSubscription = this.userService.getUserDataForFriend(userId).subscribe({
      next:(response)=>{
        console.log('data: ',response)
        this.viewedUser = response;
        this.friendProfileVisible = true;
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
    this.subscriptions.add(profileSubscription);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscriptions.unsubscribe();
  }

 
}
