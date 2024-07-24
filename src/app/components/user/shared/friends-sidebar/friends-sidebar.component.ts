import { ChangeDetectorRef, Component } from '@angular/core';
import { MainSidebarComponent } from '../main-sidebar/main-sidebar.component';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../service/user/user.service';
import { User } from '../../../../interface/user/user.model';
import { ProgressSpinner, ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { ChatServiceService } from '../../../../service/direct-chat/chat-service.service';
import { filter, Subscription } from 'rxjs';
@Component({
  selector: 'app-friends-sidebar',
  standalone: true,
  imports: [MainSidebarComponent,RouterLink,RouterLinkActive,FormsModule,ProgressSpinnerModule,BadgeModule],
  templateUrl: './friends-sidebar.component.html',
  styleUrl: './friends-sidebar.component.scss'
})
export class FriendsSidebarComponent {
  unreadCounts: {[userId: string]: number} = {};
  users!:User[]
  userId!:string|null
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router,private userService:UserService,private chatService: ChatServiceService,  private cdr: ChangeDetectorRef) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event)=>{
      const navEnd = event as NavigationEnd;
  const match = navEnd.url.match(/\/direct-chat\/(.+)\/(.+)/);
       if (match && match[1] === this.userId) {
        const friendId = match[2];
        this.chatService.markMessagesAsRead(this.userId as string, friendId);
      }
    })
   }

  async ngOnInit() {
    this.userId = await this.userService.getUserId()
    if (this.userId) {
      this.getallFriendsInSidebar()
      this.subscribeToUnreadCounts()
      this.subscribeToNewMessages()
    }

   
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeToUnreadCounts(){
    this.subscriptions.add(
      this.chatService.getUnreadCounts().subscribe(count =>{
        this.unreadCounts = { ...this.unreadCounts, ...count };
        this.cdr.detectChanges();
      })
    )
  }

  private subscribeToNewMessages(){
    this.subscriptions.add(
      this.chatService.getLastMessage().subscribe(message=>{
        if (message && message.receiverId && message.receiverId._id === this.userId) {
          const senderId = message.senderId._id;
          if (senderId === this.chatService.getCurrentChatPartner()) {
            this.unreadCounts[senderId] = 0;
          } else {
            this.unreadCounts[senderId] = (this.unreadCounts[senderId] || 0) + 1;
          }
          this.cdr.detectChanges();
          // this.chatService.getUnreadMessageCount(this.userId as string, message.senderId._id);
        }
      })
    )
  }

  getallFriendsInSidebar(){
    this.userService.getAllFriends().subscribe({
      next:(response)=>{
        console.log(response);
        this.users = response.friends
        response.friends.forEach(user=>{
          this.chatService.getUnreadMessageCount(this.userId as string,user._id)
        })
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }
}

