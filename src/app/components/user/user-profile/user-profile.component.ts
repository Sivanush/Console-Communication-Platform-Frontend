import { Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { TabViewModule } from 'primeng/tabview';
import { UserService } from '../../../service/user/user.service';
import { User } from '../../../interface/user/user.model';
import { CommonModule, DatePipe } from '@angular/common';
import { ToggleUserProfileService } from '../../../service/toggleUserProfile/toggle-user-profile.service';
import { ChatServiceService } from '../../../service/direct-chat/chat-service.service';
import { FormsModule } from '@angular/forms';
import { RouterLink  } from '@angular/router';
import { response } from 'express';

interface Server {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SidebarModule, TabViewModule, FormsModule,CommonModule,RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  providers: [DatePipe]
})
export class UserProfileComponent implements OnInit {
  sidebarVisible: boolean = true;
  userData: User = {} as User;
  userId!: string | null;
  userStatus!: string
  customStatus!: string 
  joinedServers: Server[] = [];

  constructor(
    private userService: UserService,
    private datePipe: DatePipe,
    private toggleUserProfileService: ToggleUserProfileService,
    private chatService: ChatServiceService
  ) {}

  async ngOnInit(): Promise<void> {
    this.getDataForProfile();
    this.userId = await this.userService.getUserId();
    if (this.userId) {
      this.chatService.isUserOnline(this.userId).subscribe({
        next: (response) => {
          this.userStatus = response ? 'online' : 'offline';
        }
      });
    }
    this.getJoinedServers();
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'MMM d, yyyy') || '';
  }

  close() {
    this.toggleUserProfileService.updateUserProfileValue();
  }

  getStatusClass(): string {
    switch (this.userData.status) {
      case 'online': return 'bg-green-500 border-2 border-[#2f3136]';
      case 'idle': return 'bg-yellow-500 border-2 border-[#2f3136]';
      case 'dnd': return 'bg-red-500 border-2 border-[#2f3136]';
      case 'invisible': return 'bg-gray-500 border-2 border-[#2f3136]';
      default: return 'bg-gray-500 border-2 border-[#2f3136]';
    }
  }

  updateStatus() {
    this.userService.updateStatus(this.userData.status,this.userData.customStatus).subscribe({
      next:(response)=>{
        console.log(response);
      }
    })
  }

  updateBio() {
    this.userService.updateBio(this.userData.bio).subscribe({
      next:(response)=>{
        console.log(response);
      }
    })
  }


  getDataForProfile() {
    this.userService.getUserData().subscribe({
      next: (response) => {
        this.userData = response;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getJoinedServers() {
    // Implement logic to fetch joined servers
    // This is a mock implementation
    this.joinedServers = [
      { id: '1', name: 'Server 1', icon: 'path/to/icon1.png' },
      { id: '2', name: 'Server 2', icon: 'path/to/icon2.png' },
    ];
  }
}