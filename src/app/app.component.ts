import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DirectChatComponent } from "./components/user/direct-chat/direct-chat.component";
import { UserService } from './service/user/user.service';
import { ChatServiceService } from './service/direct-chat/chat-service.service';
import { MatDialog } from '@angular/material/dialog';
import { filter, Observable, Subscription, take } from 'rxjs';
import { AcceptVideoCallComponent } from './components/user/shared/accept-video-call/accept-video-call.component';
import { ToastService } from './service/toster/toster-service.service';
import { AsyncPipe, Location } from '@angular/common';
import { LoadingService } from './service/loading/loading.service';
import { DirectCallService } from './service/direct-call/direct-call.service';
import { TabGuardService } from './service/tab-guard/tab-guard.service';




@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [],
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule, DirectChatComponent,AsyncPipe]
})
export class AppComponent {

  userId!: string | null
  private _subscriptions: Subscription[] = [];
  isLoading$: boolean = true

  constructor(
    private userService: UserService,
    private chatService: ChatServiceService,
    private dialog: MatDialog,
    private directCallService: DirectCallService,
    private toaster: ToastService,
    private router: Router,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    private tabGuardService: TabGuardService
  ) {
    
   }
  async ngOnInit(): Promise<void> {



    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading$ = loading;
      this.cdr.detectChanges();
    });


    this.loadingService.show();

    this.userId = await this.userService.getUserId();
    if (this.userId) {
      this.chatService.connectUser(this.userId);

      try {
        await this.initializePeer();
        console.log('Peer initialized successfully');
      } catch (error) {
        console.error('Failed to initialize peer:', error);
        this.toaster.showError('Initialization Error', 'Failed to initialize video call service');
      } 
    } 


    // setTimeout(() => {
    //   // this.isLoading = false
    //   const loadingOverlay = document.getElementById('loading-overlay') as HTMLElement;
    //   loadingOverlay.classList.add('hidden');
    // }, 500);

    // setTimeout(() => {
    //   this.loadingService.hide(); // Hide loading after a delay
    //   this.cdr.detectChanges();
    // }, 500);
  }


  private async   initializePeer() {
    await this.directCallService.initializePeer(this.userId!);
    this._subscriptions.push(
      this.directCallService.incomingCallBS.subscribe(({ callerId, isVideo }) => {
        this.handleIncomingCall(callerId, isVideo);
      }),
      this.directCallService.callEndedBS.subscribe(() => {
        this.router.navigate(['/']);
        this.initializePeer().catch(error => {
          console.error('Failed to reinitialize peer after call ended:', error);
        });
      })
    );
  }



  
  ngOnDestroy() {
    this._subscriptions.forEach(sub => sub.unsubscribe());
    this.directCallService.destroyPeer();
  }

  private handleIncomingCall(callerId: string, isVideo: boolean) {
    if (!this.directCallService.isInCallBS.getValue()) {
      const dialogRef = this.dialog.open(AcceptVideoCallComponent, {
        width: '400px',
        data: { callerId: callerId, isVideo: isVideo },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result === true) {
          this.directCallService.isInCallBS.next(true);
          await this.directCallService.answerCall(isVideo);
          
          const route = isVideo ? 'direct-video-chat' : 'direct-voice-chat';
          this.router.navigate([`/${route}/${this.userId}/${callerId}`]);
        } else {
          this.directCallService.endCall();
        }
      });
    } else {
      console.log('Already in a call');
    }
  }
}