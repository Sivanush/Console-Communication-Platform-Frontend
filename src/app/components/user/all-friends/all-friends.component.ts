import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { User } from '../../../interface/user/user.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FriendsSidebarComponent } from '../shared/friends-sidebar/friends-sidebar.component';
import { FriendsHeaderComponent } from '../shared/friends-header/friends-header.component';
import { DialogModule } from 'primeng/dialog';
import { Observable, Subscription } from 'rxjs';
 
import { CreateServerComponent } from "../shared/create-server/create-server.component";
import { ToggleUserProfileService } from '../../../service/toggleUserProfile/toggle-user-profile.service';
import { ToggleCreateServerService } from '../../../service/toggleCreateServer/toggle-create-server.service';
import { ChatServiceService } from '../../../service/direct-chat/chat-service.service';
import { CommonModule, DatePipe } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { SidebarModule } from 'primeng/sidebar';
import { LoadingService } from '../../../service/loading/loading.service';

@Component({
    selector: 'app-all-friends',
    standalone: true,
    templateUrl: './all-friends.component.html',
    styleUrl: './all-friends.component.scss',
    imports: [FriendsHeaderComponent, FriendsSidebarComponent, FormsModule, RouterLink, RouterLinkActive, DialogModule, CreateServerComponent,SidebarModule, TabViewModule, CommonModule],
    providers:[DatePipe]
})
export class AllFriendsComponent {
  users: User[] = [];
  viewedUser: User = {} as User;
  friendProfileVisible: boolean = false;
  userOnline$!: Observable<boolean>;
  userId!:string | null

  profileVisible:boolean = false
  createServerVisible:boolean = false
  private subscription!: Subscription;

  constructor(
    private userService: UserService,
    private chatService: ChatServiceService,
    private datePipe: DatePipe,
    private toggleCreateServerService:ToggleCreateServerService,
    private userProfileService:ToggleUserProfileService,
    // private loadingService:LoadingService
  ) {}

  async ngOnInit() {
    this.userId = await this.userService.getUserId()
    this.loadFriends();

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

  loadFriends() {
    this.userService.getAllFriends().subscribe({
      next: (friends) => {
        this.users = friends.friends
        // this.loadingService.hide()
      },
      error: (error) => {
        console.error('Error loading friends:', error);
      }
    });
  }

  toggleProfile(userId: string) {
    this.userService.getUserDataForFriend(userId).subscribe({
      next: (user) => {
        this.viewedUser = user;
        this.friendProfileVisible = true;
        this.userOnline$ = this.chatService.isUserOnline(userId);
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      }
    });
  }

  getStatusClass(): string {
    switch (this.viewedUser.status) {
      case 'online': return 'bg-green-500 border-2 border-[#2f3136]';
      case 'idle': return 'bg-yellow-500 border-2 border-[#2f3136]';
      case 'dnd': return 'bg-red-500 border-2 border-[#2f3136]';
      case 'invisible': return 'bg-gray-500 border-2 border-[#2f3136]';
      default: return 'bg-gray-500 border-2 border-[#2f3136]';
    }
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'MMM d, yyyy') || '';
  }

  close() {
    this.friendProfileVisible = false;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}