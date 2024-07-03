import { Component } from '@angular/core';
import { MainSidebarComponent } from '../main-sidebar/main-sidebar.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../service/user/user.service';
import { User } from '../../../../interface/user/user.model';
import { ProgressSpinner, ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-friends-sidebar',
  standalone: true,
  imports: [MainSidebarComponent,RouterLink,RouterLinkActive,FormsModule,ProgressSpinnerModule],
  templateUrl: './friends-sidebar.component.html',
  styleUrl: './friends-sidebar.component.scss'
})
export class FriendsSidebarComponent {

  users!:User[]
  userId!:string|null

  constructor(private router: Router,private userService:UserService) { }




  async ngOnInit() {
    this.userId = await this.userService.getUserId()
    if (this.userId) {
      this.getallFriendsInSidebar()
    }
  }





  getallFriendsInSidebar(){
    this.userService.getAllFriends().subscribe({
      next:(response)=>{
        console.log(response);
        this.users = response.friends
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }
  
}

