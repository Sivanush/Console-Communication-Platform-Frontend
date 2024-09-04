import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../service/user/user.service';
import { FriendsHeaderComponent } from '../shared/friends-header/friends-header.component';
import { FriendsSidebarComponent } from '../shared/friends-sidebar/friends-sidebar.component';
import { ToggleUserProfileService } from '../../../service/toggleUserProfile/toggle-user-profile.service';
import { Subscription } from 'rxjs';
import { CreateServerComponent } from '../shared/create-server/create-server.component';
import { ToggleCreateServerService } from '../../../service/toggleCreateServer/toggle-create-server.service';
import { ChatServiceService } from '../../../service/direct-chat/chat-service.service';
import { VideoPlayerComponent } from '../shared/video-player/video-player.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FriendsSidebarComponent,FriendsHeaderComponent,CreateServerComponent,RouterLink,VideoPlayerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers:[MessageService]
})
export class HomeComponent {

  profileVisible:boolean = false
  createServerVisible:boolean = false
  private subscription!: Subscription;

  constructor(
    private userService:UserService,
    private router: Router,
    private messageService: MessageService,
    private userProfileService:ToggleUserProfileService,
    private toggleCreateServerService:ToggleCreateServerService,
    private chatServiceService : ChatServiceService
  ) { }


  async ngOnInit(){
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { message: string, type: string };

    if (state) {
      this.showToast(state.message, state.type);
    }

    this.subscription = this.toggleCreateServerService.booleanValue$.subscribe({
      next: (value) => {
        this.createServerVisible = value 
        
      },
      error:(err)=> console.log(err)
    })

    this.subscription = this.userProfileService.booleanValue$.subscribe((data: boolean) => {
      this.profileVisible = data;

      
    });

    const userId = await this.userService.getUserId()
    if (userId) {
      this.chatServiceService.connectUser(userId)
    }
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  setupSidebarToggles(): void {
    const toggleSidebar = document.getElementById('toggle-sidebar');
    
    if (toggleSidebar) {
      toggleSidebar.addEventListener('click', () => {
        const mainSidebar = document.getElementById('main-sidebar');
        mainSidebar?.classList.toggle('translate-x-1');
      });
    }

 
     
        

  }

  showToast(summary: string, severity: string) {
    this.messageService.add({ severity, summary, detail: '' });
  }

  logout(){
    this.userService.logout()
  }































// // Optional: Add JavaScript to handle sidebar toggles
// // For example:
// document.getElementById('toggle-sidebar').addEventListener('click', function () {
//   const mainSidebar = document.getElementById('main-sidebar');
//   mainSidebar.classList.toggle('-translate-x-full');
// });
// document.getElementById('toggle-secondary-sidebar').addEventListener('click', function () {
//   const secondarySidebar = document.getElementById('secondary-sidebar');
//   secondarySidebar.classList.toggle('-translate-x-full');
// });

}