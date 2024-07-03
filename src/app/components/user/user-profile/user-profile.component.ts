import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { TabViewModule } from 'primeng/tabview';
import { UserService } from '../../../service/user/user.service';
import { User } from '../../../interface/user/user.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SidebarModule,TabViewModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  providers: [DatePipe]
})
export class UserProfileComponent {
  sidebarVisible: boolean = true;
  userData:User = {} as User

  constructor(private userService:UserService,private datePipe: DatePipe) {
    
  }
ngOnInit(): void {
  this.getDataForProfile()
}

formatDate(date: Date): string {
  // date.toString()
  return this.datePipe.transform(date, 'MMM d, yyyy') || '';
}


getDataForProfile(){
  this.userService.getUserData().subscribe({
    next:(response)=>{
      this.userData=response
    },
    error:(err)=>{
      console.log(err);
      
    }
  })
}
}
