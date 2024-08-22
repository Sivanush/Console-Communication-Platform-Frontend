import { ChangeDetectorRef, Component, ElementRef, HostListener } from '@angular/core';
import { MainSidebarComponent } from '../main-sidebar/main-sidebar.component';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../service/user/user.service';
import { User } from '../../../../interface/user/user.model';
import { ProgressSpinner, ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { ChatServiceService } from '../../../../service/direct-chat/chat-service.service';
import { BehaviorSubject, filter, interval, map, Observable, Subscription, switchMap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FriendSidebarToggleService } from '../../../../service/friend-sidebar-toggle/friend-sidebar-toggle.service';
@Component({
  selector: 'app-friends-sidebar',
  standalone: true,
  imports: [MainSidebarComponent,RouterLink,RouterLinkActive,FormsModule,ProgressSpinnerModule,BadgeModule,CommonModule, AsyncPipe],
  templateUrl: './friends-sidebar.component.html',
  styleUrl: './friends-sidebar.component.scss',
})
export class FriendsSidebarComponent {
  unreadCounts: {[userId: string]: number} = {};
  users!:User[]
  userId!:string|null
  private subscriptions: Subscription = new Subscription();

  private statusPollingSubscription!: Subscription;
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();
  sidebarOpen = false;

  constructor(
    private router: Router,
    private userService:UserService,
    private chatService: ChatServiceService,
    private cdr: ChangeDetectorRef,
    private sidebarToggleService: FriendSidebarToggleService,
    private eRef: ElementRef
  ) {

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

   @HostListener('document:click', ['$event'])
   onClickOutside(event: MouseEvent) {
     const clickedInside = (event.target as HTMLElement).closest('.sidebar, #toggle-icon');
     if (!clickedInside && this.sidebarOpen) {
       this.sidebarOpen = false; 
       this.sidebarToggleService.closeSidebar()
     }
   }

  @HostListener('window:popstate', ['$event'])
  onBackButtonEvent() {
    if (this.sidebarOpen) {
      this.closeSidebar();
    }
  }



  async ngOnInit() {

    this.subscriptions = this.sidebarToggleService.sidebarState$.subscribe((state) => {
      this.sidebarOpen = state;
    });

    this.userId = await this.userService.getUserId()
    if (this.userId) {
      this.getallFriendsInSidebar()
      this.subscribeToUnreadCounts()
      this.subscribeToNewMessages()
      // this.setupStatusPolling()
    }

   
  }


  closeSidebar() {
    this.sidebarToggleService.closeSidebar();
  }

  getStatusClass(status:string): string {
    switch (status) {
      case 'online': return 'bg-green-500 border-2 border-[#2f3136]';
      case 'idle': return 'bg-yellow-500 border-2 border-[#2f3136]';
      case 'dnd': return 'bg-red-500 border-2 border-[#2f3136]';
      case 'invisible': return 'bg-gray-500 border-2 border-[#2f3136]';
      default: return 'bg-gray-500 border-2 border-[#2f3136]';
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    if (this.statusPollingSubscription) {
      this.statusPollingSubscription.unsubscribe()
    }
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
        this.users = response.friends
        this.usersSubject.next(response.friends);
          this.cdr.detectChanges();
        response.friends.forEach(user=>{
          this.chatService.getUnreadMessageCount(this.userId as string,user._id)
        })
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }


  private setupStatusPolling() {
    if (this.userId) {
      setTimeout(() => {
        this.statusPollingSubscription = interval(3000)
          .pipe(
            switchMap(() => this.chatService.getFriendsStatus(this.userId as string))
          )
          .subscribe({
            next: (updatedFriends) => {
              // Assuming updatedFriends is an array of FriendsStatus
              const allFriends = updatedFriends.map(friendStatus => friendStatus);
              // Flatten the array if each FriendsStatus has an array of friends
              const flattenedFriends = allFriends.flat();

              this.usersSubject.next(flattenedFriends);

              flattenedFriends.forEach(user => {
                this.chatService.getUnreadMessageCount(this.userId as string, user._id);
              });
              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error('Error polling friends status:', error);
            }
          });
      }, 3000);
    }
  }

}














