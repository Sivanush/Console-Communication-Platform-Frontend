import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { ToggleUserProfileService } from '../../../../service/toggleUserProfile/toggle-user-profile.service';
import { UserService } from '../../../../service/user/user.service';
import { DialogModule } from 'primeng/dialog';
import { ToggleCreateServerService } from '../../../../service/toggleCreateServer/toggle-create-server.service';
import { ServerService } from '../../../../service/server/server.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,UserProfileComponent,DialogModule],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.scss'
})
export class MainSidebarComponent {
  userProfile:boolean = false
  userImage:string = ''
  createServerVisible:boolean = false
  servers!: any[];

  constructor(
    private userProfileService:ToggleUserProfileService,
    private toggleCreateServerService:ToggleCreateServerService,
    private userService:UserService,
    private serverService:ServerService,
    private cdr: ChangeDetectorRef
  ) {}
  private serverUpdateSubscription!: Subscription;




  ngOnInit(): void {
    this.getUserProfile()
    console.log(this.userImage);
    this.loadAllServers()
    this.serverUpdateSubscription = this.serverService.serverUpdate$.subscribe({
      next: () => this.loadAllServers()
    })
  }


  loadAllServers(){
    this.serverService.getAllServers().subscribe({

      next:(response)=>{
        console.log(response);
        this.servers = response
        // console.log('all servers',this.servers);
        this.cdr.detectChanges();
        
      },
      error:(err)=> console.log('Error loading servers',err)
      
    })
  }

  getUserProfile(){
    this.userService.getUserData().subscribe({
      next:(response)=>{
        this.userImage = response.image
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  toggleUserProfile(){
    this.userProfileService.updateUserProfileValue()
  }

  createServerVisibleToggle(){
    this.toggleCreateServerService.toggleVisible()
  }

  ngOnDestroy(): void {
    if (this.serverUpdateSubscription) {
      this.serverUpdateSubscription.unsubscribe();
    }
  }
}
