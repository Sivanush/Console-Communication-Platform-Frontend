import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserRequestI } from '../../../../interface/user/user.model';
import { UserService } from '../../../../service/user/user.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FriendSidebarToggleService } from '../../../../service/friend-sidebar-toggle/friend-sidebar-toggle.service';

@Component({
  selector: 'app-friends-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,AsyncPipe,CommonModule],
  templateUrl: './friends-header.component.html',
  styleUrl: './friends-header.component.scss'
})
export class FriendsHeaderComponent {


  visible: boolean = false;
  @Input() name!: string
  users:UserRequestI[] = []
  private subscription!: Subscription;
  hasPendingRequests: boolean = false;
  sidebarOpen:boolean = false

  constructor(private userService:UserService,private sidebarToggleService: FriendSidebarToggleService) {
  
  }

  setupSidebarToggles() {
    this.sidebarToggleService.toggleSidebar();
  }
  

  showDialog() {
    this.visible = true;
  }


  ngOnInit(): void {

    
    this.subscription = this.sidebarToggleService.sidebarState$.subscribe((state) => {
      this.sidebarOpen = state;
    });

    
    this.getPendingRequests()
    
    this.subscription = this.userService.getPendingRequestsStatus()
      .subscribe(value => {
        this.hasPendingRequests = value;
      });
  }



  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.users = []
    }
  }


  getPendingRequests(){
    this.subscription = this.userService.listPendingFriendRequest().subscribe({
      next:(response)=>{
        this.users = response.requests
        this.updatePendingRequestsStatus();
      },
      error:(err)=>{
        console.log(err.message);
      }
    })
  }


  private updatePendingRequestsStatus() {
    const hasPendingRequests = this.users.length > 0;
    this.userService.updatePendingRequestsStatus(hasPendingRequests);
  }
}

