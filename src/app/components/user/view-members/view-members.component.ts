import { ChangeDetectorRef, Component } from '@angular/core';
import { ServerSidebarComponent } from "../shared/server-sidebar/server-sidebar.component";
import { FriendsHeaderComponent } from "../shared/friends-header/friends-header.component";

@Component({
  selector: 'app-view-members',
  standalone: true,
  imports: [ServerSidebarComponent, FriendsHeaderComponent],
  templateUrl: './view-members.component.html',
  styleUrl: './view-members.component.scss'
})
export class ViewMembersComponent {
  isChat!: boolean;
  isVideo!: boolean;

  // members: anything[] = [
  //   { name: 'Member 1', avatarUrl: 'member-avatar.png', status: 'Online' },
  //   { name: 'Member 2', avatarUrl: 'member-avatar.png', status: 'Online' },
  //   { name: 'Member 3', avatarUrl: 'member-avatar.png', status: 'Offline' },
  //   // Add more members here
  // ];

  selectedMember: { name: string; avatarUrl: string; status: string } | null = null;
  showMemberOptions: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  toggleMemberOptions(member?: { name: string; avatarUrl: string; status: string }): void {
    alert(member)
    
   if (member) {
    this.selectedMember = member;
    this.showMemberOptions = !this.showMemberOptions;
   }
  }

  isChatToggle(value: boolean) {
    this.isChat = value;
    this.cdr.detectChanges(); 
  }

  isVideoToggle(value: boolean) {
    this.isVideo = value;
    this.cdr.detectChanges(); 
  }
}