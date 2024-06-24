import { Component } from '@angular/core';
import { SidebarComponent } from "../reuse/sidebar/sidebar.component";
import { HeaderComponent } from "../reuse/header/header.component";
import { Observable } from 'rxjs';
import { User } from '../../../interface/user/user.model';
import { Store, select } from '@ngrx/store';
import { selectAllUsers, selectUsersError, selectUsersLoading } from '../../../store/user-listing/user.selector';
import { loadUser } from '../../../store/user-listing/user.action';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AsyncPipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AdminService } from '../../../service/admin/admin.service';
import { ToastService } from '../../../service/toster/toster-service.service';


@Component({
    selector: 'app-admin-user-management',
    standalone: true,
    templateUrl: './admin-user-management.component.html',
    styleUrl: './admin-user-management.component.scss',
    imports: [SidebarComponent, HeaderComponent,ProgressSpinnerModule,AsyncPipe,TagModule,MenuModule]
})
export class AdminUserManagementComponent {

    isDropDownVisible :boolean = false
    user$:Observable<User[]>
    loading$:Observable<boolean>
    error$:Observable<unknown>
    items: MenuItem[] | undefined;


    constructor(private store:Store,private adminService:AdminService,private toaster:ToastService) {

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

    
    getMenuItems(userId: string): MenuItem[] {
        return [
            {
                label: 'Options',
                items: [
                    {
                        label: 'Block/Unblock',
                        command: () => {
                            this.toggleUserStatus(userId);
                        }
                    }
                ]
            }
        ];
    }


    toggleDropDown(){
        this.isDropDownVisible = !this.isDropDownVisible
    }

    toggleUserStatus(userId:string){
        console.log('function Invoked of user status change' );
        
        this.adminService.toggleUserBlock(userId).subscribe({
            next:(response)=>{
                console.log('success👍👍👍',response);
                this.toaster.showSuccess('Success','Successfully Changed User Status')
                this.ngOnInit()
            },
            error:(err)=>{
                console.log(err);
                this.toaster.showError('Error',err.error.error)
                
            }
        })
    }

}
