import { Component } from '@angular/core';
import { MainHeaderComponent } from '../reuse/main-header/main-header.component';
import { MainSidebarComponent } from '../reuse/main-sidebar/main-sidebar.component';
import { UserService } from '../../../service/user/user.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { User } from '../../../interface/user/user.model';

@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [MainHeaderComponent,MainSidebarComponent,FormsModule,JsonPipe,AsyncPipe],
  templateUrl: './add-friend.component.html',
  styleUrl: './add-friend.component.scss'
})
export class AddFriendComponent {
showDialog() {
throw new Error('Method not implemented.');
}

  query!:string
  users!:User[]
  constructor(private userService:UserService) {}


  searchUser() {
    if (this.query) { 
      this.userService.addFriends(this.query).subscribe({
        next: (response) => {
          console.log(response);
          this.users = response.users
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  onQueryChange() {
    this.searchUser();
  }


  sendFriendRequest(userId:string){
    this.userService.sendFriendRequest(userId).subscribe({
      next: (response) => {
        console.log(response);
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }

}
