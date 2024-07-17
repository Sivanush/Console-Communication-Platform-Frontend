import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DirectChatComponent } from "./components/user/direct-chat/direct-chat.component";
// import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
}
