import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DirectChatComponent } from "./components/user/direct-chat/direct-chat.component";
import { UserService } from './service/user/user.service';
import { ChatServiceService } from './service/direct-chat/chat-service.service';
import { FriendVideoCallService } from './service/friend-video-call/friend-video-call.service';
import { MatDialog } from '@angular/material/dialog';
import { filter, Subscription, take } from 'rxjs';
import { AcceptVideoCallComponent } from './components/user/shared/accept-video-call/accept-video-call.component';
import { ToastService } from './service/toster/toster-service.service';
import { Location } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [],
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule, DirectChatComponent]
})
export class AppComponent {

  userId!: string | null
  private _subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private chatService: ChatServiceService,
    private dialog: MatDialog,
    private friendVideoCallService: FriendVideoCallService,
    private toaster: ToastService,
    private router: Router,
    private location:Location
  ) { }
  async ngOnInit(): Promise<void> {
    this.userId = await this.userService.getUserId();
    if (this.userId) {
      this.chatService.connectUser(this.userId);

      try {
        await this.friendVideoCallService.initializePeer(this.userId);
        this._subscriptions.push(
          this.friendVideoCallService.incomingCallBS.subscribe(callerId => {
            this.handleIncomingCall(callerId)
          }),
          this.friendVideoCallService.callEndedBS.subscribe(() => {
            this.router.navigate(['/']); // Navigate to home or previous page
          })
        );
        console.log('Peer initialized successfully');
      } catch (error) {
        console.error('Failed to initialize peer:', error);
        this.toaster.showError('Initialization Error', 'Failed to initialize video call service');
      } 
    } 
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => sub.unsubscribe());
    this.friendVideoCallService.destroyPeer();
  }

  private handleIncomingCall(callerId: string) {
    
    if(!this.friendVideoCallService.isInCallBS.getValue()){
      const dialogRef = this.dialog.open(AcceptVideoCallComponent, {
        width: '400px',
        data: { callerId: callerId },
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result === true) {
          this.friendVideoCallService.isInCallBS.next(true);
          await this.friendVideoCallService.answerCall();
          
          
          this.router.navigate([`/direct-video-chat/${this.userId}/${callerId}`]);
          console.log('❌❌❌❌❌❌❌❌❌❌❌❌❌❌');
        } else {
          this.friendVideoCallService.endCall();
        }
      });
    }else{
      console.log('⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽');
      
    }

  }
}