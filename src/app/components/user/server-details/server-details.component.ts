import { ChangeDetectorRef, Component, Input } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../../../service/server/server.service';
import { CommunityAudioChatComponent } from "../shared/community-audio-chat/community-audio-chat.component";


@Component({
  selector: 'app-server-details',
  standalone: true,
  templateUrl: './server-details.component.html',
  styleUrl: './server-details.component.scss',
  imports: [FriendsSidebarComponent, FriendsHeaderComponent, ServerSidebarComponent, CommunityChatComponent, UserProfileComponent, CreateServerComponent, CommunityVideoChatComponent, CommunityAudioChatComponent]
})
export class ServerDetailsComponent {
  isChat!: boolean
  isVideo!: boolean
  isAudio!: boolean
  profileVisible: boolean = false
  createServerVisible: boolean = false
  private subscription!: Subscription;
  private routeSubscription!: Subscription;


  constructor(
    private userProfileService: ToggleUserProfileService,
    private toggleCreateServerService: ToggleCreateServerService,
    private route: ActivatedRoute,
    private serverService:ServerService,
    private cdr: ChangeDetectorRef,
  ) {


  }

  isChatToggle(value: boolean) {
    this.isChat = value
    this.cdr.detectChanges(); 

  }

  isVideoToggle(value: boolean) {
    this.isVideo = value
    this.cdr.detectChanges(); 
  }

  isAudioToggle(value:boolean){
    this.isAudio = value
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.subscription = this.toggleCreateServerService.booleanValue$.subscribe({
      next: (value) => {
        this.createServerVisible = value

      },
      error: (err) => console.log(err)
    })

    this.subscription = this.userProfileService.booleanValue$.subscribe((data: boolean) => {
      this.profileVisible = data;
      // console.log('Data Updated ',this.profileVisible);

    });


    this.subscription = this.route.params.subscribe(params=>{
      const channelId = params['channelId']
      if (channelId) {
        this.loadChannelDetails(channelId);
      }
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadChannelDetails(channelId: string) {
    this.serverService.getChannelDetail(channelId).subscribe(channelDetails => {
      if (channelDetails.channelDetail.type === 'text') {
        this.isChat = true;
        this.isVideo = false;
      } else if (channelDetails.channelDetail.type === 'video') {
        this.isChat = false;
        this.isVideo = true;
      } else {
        this.isChat = false;
        this.isVideo = false;
      }
    });
  }
}
