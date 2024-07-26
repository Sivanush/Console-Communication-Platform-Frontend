import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DirectChatComponent } from "./components/user/direct-chat/direct-chat.component";
import { UserService } from './service/user/user.service';
import { ChatServiceService } from './service/direct-chat/chat-service.service';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [],
    imports: [RouterOutlet, ToastModule, ConfirmDialogModule, DirectChatComponent]
})
export class AppComponent {
  title = 'Frontend';
  userId!:string | null

  constructor(private userService:UserService,private chatService:ChatServiceService ) {
  }

  async ngOnInit(): Promise<void> {
    this.userId = await this.userService.getUserId()
    if (this.userId) {      
      this.chatService.connectUser(this.userId)
    }
  }
}
