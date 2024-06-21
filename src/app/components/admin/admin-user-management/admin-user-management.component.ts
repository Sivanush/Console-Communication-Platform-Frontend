import { Component } from '@angular/core';
import { SidebarComponent } from "../reuse/sidebar/sidebar.component";
import { HeaderComponent } from "../reuse/header/header.component";

@Component({
    selector: 'app-admin-user-management',
    standalone: true,
    templateUrl: './admin-user-management.component.html',
    styleUrl: './admin-user-management.component.scss',
    imports: [SidebarComponent, HeaderComponent]
})
export class AdminUserManagementComponent {

}
