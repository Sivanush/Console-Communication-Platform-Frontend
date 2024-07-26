import { Component, Input } from '@angular/core';
import { FriendsSidebarComponent } from "../shared/friends-sidebar/friends-sidebar.component";
import { FriendsHeaderComponent } from "../shared/friends-header/friends-header.component";
import { ServerSidebarComponent } from "../shared/server-sidebar/server-sidebar.component";
import { CommunityChatComponent } from "../shared/community-chat/community-chat.component";
import { UserProfileComponent } from "../user-profile/user-profile.component";
import { CreateServerComponent } from "../shared/create-server/create-server.component";
import { ToggleUserProfileService } from '../../../service/toggleUserProfile/toggle-user-profile.service';
import { ToggleCreateServerService } from '../../../service/toggleCreateServer/toggle-create-server.service';
import { Subscription } from 'rxjs';
import { CommunityVideoChatComponent } from "../shared/community-video-chat/community-video-chat.component";

@Component({
    selector: 'app-server-details',
    standalone: true,
    templateUrl: './server-details.component.html',
    styleUrl: './server-details.component.scss',
    imports: [FriendsSidebarComponent, FriendsHeaderComponent, ServerSidebarComponent, CommunityChatComponent, UserProfileComponent, CreateServerComponent, CommunityVideoChatComponent]
})
export class ServerDetailsComponent {
    isChat!:boolean
    isVideo!:boolean
    profileVisible:boolean = false
    createServerVisible:boolean = false
    private subscription!: Subscription;


    constructor(    
        private userProfileService:ToggleUserProfileService,
        private toggleCreateServerService:ToggleCreateServerService) {

        
    }

    isChatToggle(value:boolean){
        this.isChat = value
    }

    isVideoToggle(value:boolean){
      this.isVideo = value
  }

    ngOnInit(): void {
        this.subscription = this.toggleCreateServerService.booleanValue$.subscribe({
            next: (value) => {
              this.createServerVisible = value 
              
            },
            error:(err)=> console.log(err)
          })
      
          this.subscription = this.userProfileService.booleanValue$.subscribe((data: boolean) => {
            this.profileVisible = data;
            // console.log('Data Updated ',this.profileVisible);
            
          });
    }

    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
      }
}
