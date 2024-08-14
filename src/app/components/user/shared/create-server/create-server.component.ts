import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Observable, Subscription } from 'rxjs';
import { ToggleCreateServerService } from '../../../../service/toggleCreateServer/toggle-create-server.service';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServerService } from '../../../../service/server/server.service';
import { ToastService } from '../../../../service/toster/toster-service.service';
import { MainSidebarComponent } from '../main-sidebar/main-sidebar.component';

@Component({
  selector: 'app-create-server',
  standalone: true,
  imports: [DialogModule, AsyncPipe, FormsModule],
  templateUrl: './create-server.component.html',
  styleUrl: './create-server.component.scss',
  providers: [MainSidebarComponent]
})
export class CreateServerComponent {


  isLoading: boolean = false
  serverName: string | null = null
  imagePreview: string | ArrayBuffer | null | undefined = null; // Updated type
  serverImage: File | null = null;

  onFileSelected(event: Event) {
    // const file = event?.target.files[0] as File
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0] ?? null;
    if (file) {
      this.serverImage = file
      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePreview = e.target?.result
      }
      reader.readAsDataURL(file)
    }
  }
  createServerVisible$: boolean = false
  private subscription!: Subscription

  constructor(
    private mainSidebar: MainSidebarComponent,
    private toggleCreateServerService: ToggleCreateServerService,
    private serverService: ServerService,
    private toaster: ToastService,

  ) {
  }

  ngOnInit(): void {
    this.subscription = this.toggleCreateServerService.booleanValue$.subscribe({
      next: (value) => this.createServerVisible$ = value
    })


  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  close() {
    this.toggleCreateServerService.toggleVisible()
  }


  createServer() {
    if (this.serverName) {
      this.isLoading = true;
      this.serverService.createServer(this.serverName, this.serverImage).subscribe({
        next: (response) => {
          console.log(response);
          this.isLoading = false;
          this.toaster.showSuccess('Success', response.message)
          this.createServerVisible$ = false
          this.serverService.triggerServerUpdate()
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
          
          this.toaster.showError('Error', err.error.error)
        }
      })
    }else{
      this.toaster.showInfo('Warning', 'Please enter your server name')
    }
  }

}
