import { Component } from '@angular/core';
import { SidebarComponent } from "../reuse/sidebar/sidebar.component";
import { HeaderComponent } from "../reuse/header/header.component";

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.scss',
    imports: [SidebarComponent, HeaderComponent]
})
export class AdminDashboardComponent {

    name:string = 'Dashboard'
}
