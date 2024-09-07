import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendSidebarToggleService {

  constructor(private router: Router) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        // Close sidebar on page change
        this.closeSidebar();
      });
   }


  private sidebarState = new BehaviorSubject<boolean>(false);
  sidebarState$ = this.sidebarState.asObservable();

  toggleSidebar() {
    this.sidebarState.next(!this.sidebarState.value);
    console.log('❌❌❌❌❌❌❌❌')
  }

  closeSidebar() {
    this.sidebarState.next(false);
    console.log('heyyyyyyyyyyyyyyyyyy');
    
  }


}
