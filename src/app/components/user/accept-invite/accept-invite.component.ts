import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../../service/server/server.service';
import { UserService } from '../../../service/user/user.service';
import { ToastService } from '../../../service/toster/toster-service.service';

@Component({
  selector: 'app-accept-invite',
  standalone: true,
  imports: [],
  templateUrl: './accept-invite.component.html',
  styleUrl: './accept-invite.component.scss'
})  
export class AcceptInviteComponent {
  inviteCode!: string | null
  serverName: string = '';
  serverIcon: string = '';
  memberCount: number = 0;
  isLoading: boolean = true;
  error: string | null = null;
  userId!: string | null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serverService: ServerService,
    private userService: UserService,
    private toaster: ToastService
  ) { }

  async ngOnInit(): Promise<void> {
    this.userId = await this.userService.getUserId()
    this.inviteCode = this.route.snapshot.paramMap.get('inviteCode')
    this.loadInviteDetail()
  }


  loadInviteDetail() {
    this.serverService.getInviteDetails(this.inviteCode as string).subscribe({
      next: (response) => {
        console.log(response);

        this.serverName = response.serverDetail.serverId.name
        this.serverIcon = response.serverDetail.serverId.image
        this.memberCount = response.memberCount
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Invalid invite or server not found.';
        this.isLoading = false;
        console.log(err);

      }
    })
  }

  acceptInvite() {

    if(!this.userId){
      this.toaster.showInfo('Info', 'Please create or login to your account')
      this.router.navigate([`/login`])
    }

    if (this.inviteCode && this.userId) {
      this.serverService.joinServer(this.inviteCode, this.userId).subscribe({
        next: (response) => {
          console.log(response);
          this.toaster.showSuccess('Success', 'Joined The Server')
          this.router.navigate([`/server/${response.serverData}`])
        },
        error: (err) => {
          console.log(err);
          this.toaster.showError('Error', err.error.error)
        }
      })
    }
  }

}
