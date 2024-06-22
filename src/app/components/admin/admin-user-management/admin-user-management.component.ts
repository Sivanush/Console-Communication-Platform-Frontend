import { Component } from '@angular/core';
import { SidebarComponent } from "../reuse/sidebar/sidebar.component";
import { HeaderComponent } from "../reuse/header/header.component";
import { Observable, map } from 'rxjs';
import { User } from '../../../interface/user/user.model';
import { Store, select } from '@ngrx/store';
import { selectAllUsers, selectUsersError, selectUsersLoading } from '../../../store/user-listing/user.selector';
import { loadUser } from '../../../store/user-listing/user.action';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AsyncPipe, JsonPipe } from '@angular/common';


@Component({
    selector: 'app-admin-user-management',
    standalone: true,
    templateUrl: './admin-user-management.component.html',
    styleUrl: './admin-user-management.component.scss',
    imports: [SidebarComponent, HeaderComponent,ProgressSpinnerModule,AsyncPipe,JsonPipe]
})
export class AdminUserManagementComponent {


    user$:Observable<User[]>
    loading$:Observable<boolean>
    error$:Observable<unknown>

    constructor(private store:Store) {

        this.user$ = this.store.pipe(select(selectAllUsers));
        this.loading$ = this.store.pipe(select(selectUsersLoading)),
        this.error$ = this.store.pipe(select(selectUsersError))
    }

    ngOnInit(): void {
        this.store.dispatch(loadUser())
        this.user$.subscribe(user => {
          console.log(user)
        });

    }
}
