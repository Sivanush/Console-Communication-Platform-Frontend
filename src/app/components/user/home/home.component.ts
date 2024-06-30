import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../service/user/user.service';
import { FriendsSidebarComponent } from '../reuse/friends-sidebar/friends-sidebar.component';
import { FriendsHeaderComponent } from '../reuse/friends-header/friends-header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FriendsSidebarComponent,FriendsHeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers:[MessageService]
})
export class HomeComponent {
  constructor(private userService:UserService, private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { message: string, type: string };

    if (state) {
      this.showToast(state.message, state.type);
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