import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { TabViewModule } from 'primeng/tabview';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SidebarModule,TabViewModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  sidebarVisible: boolean = true;
}
