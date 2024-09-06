import { ChangeDetectorRef, Component, ElementRef, HostListener } from '@angular/core';
import { ServerSidebarComponent } from "../shared/server-sidebar/server-sidebar.component";
import { FriendsHeaderComponent } from "../shared/friends-header/friends-header.component";
import { UserService } from '../../../service/user/user.service';
import { ServerService } from '../../../service/server/server.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastService } from '../../../service/toster/toster-service.service';
import { User } from '../../../interface/user/user.model';
import { CommonModule } from '@angular/common';
import { response } from 'express';

@Component({
  selector: 'app-view-members',
  standalone: true,
  imports: [ServerSidebarComponent, FriendsHeaderComponent, CommonModule],
  templateUrl: './view-members.component.html',
  styleUrl: './view-members.component.scss'
})
export class ViewMembersComponent {
  isChat!: boolean;
  isVideo!: boolean;

  members!: User[]

  private subscriptions: Subscription[] = [];
  showMemberOptions: boolean = false;
  serverId!: string
  selectedMember: User | null = null;
  userId!: string | null
  isAdmin!: boolean 

  constructor(
    private cdr: ChangeDetectorRef,
    private serverService: ServerService,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private elementRef: ElementRef,
    private toaster:ToastService
  ) { }

  // toggleMemberOptions(member?: { name: string; avatarUrl: string; status: string }): void {
  //   alert(member)

  //   if (member) {
  //     this.selectedMember = member;
  //     this.showMemberOptions = !this.showMemberOptions;
  //   }
  // }


  toggleMemberOptions(member?: User): void {
    if (member) {
      this.selectedMember = this.selectedMember === member ? null : member;
    } else {
      this.showMemberOptions = !this.showMemberOptions;
    }
    this.cdr.detectChanges();
  }


  async ngOnInit(): Promise<void> {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.serverId = params['serverId'];
        if (this.serverId) {
          this.isUserAdmin()
          this.getAllMembers()
        }
      })
    )
    this.userId = await this.userService.getUserId()
    this.isUserAdmin()
  }

  isChatToggle(value: boolean) {
    this.isChat = value;
    this.cdr.detectChanges();
  }

  isVideoToggle(value: boolean) {
    this.isVideo = value;
    this.cdr.detectChanges();
  }

  getAllMembers() {
    this.serverService.getAllUserForServer(this.serverId).subscribe({
      next: (data) => {
        this.members = data
        console.log(this.members);


      },
      error: (err) => {
        console.log(err)
        this.toastService.showError(err.error.error)
      }
    })
  }



  isUserAdmin() {
    if (this.userId && this.serverId) {
      this.serverService.findAdminForServer(this.userId, this.serverId).subscribe({
        next:(response)=>{
          this.isAdmin = response as boolean
          console.log(this.isAdmin);
          
        },
        error:(err)=>{
          this.toaster.showError(err.error.error)
        }
      })
    }
  }



  kickUser(userId:string){
    this.serverService.kickUserById(userId,this.serverId).subscribe({
      next:(response)=>{
        this.members = this.members.filter(member => member._id !== userId);
        console.log(response);
        this.toastService.showSuccess('User Kicked');
      },
      error:(err)=>{
        console.log(err);
        this.toastService.showError(err.error.error);
      }
    })
  }








  // @HostListener('document:click', ['$event'])
  // onClickOutside(event: Event) {
  //   const targetElement = event.target as HTMLElement;
  //   console.log(this.showMemberOptions);

  //   // Only proceed if the member options are currently displayed
  //   if (this.showMemberOptions) {
  //     // Check if the click happened outside the component
  //     // if (!this.elementRef.nativeElement.contains(targetElement)) {
  //       this.showMemberOptions = false;
  //       this.selectedMember = null;
  //       this.cdr.detectChanges();
  //     // }
  //   }
  // }



  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}