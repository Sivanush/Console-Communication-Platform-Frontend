import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ToastModule,ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers:[]
})
export class AppComponent {
  title = 'Frontend';
}
