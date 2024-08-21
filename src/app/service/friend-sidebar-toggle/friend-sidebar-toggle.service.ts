import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendSidebarToggleService {

  constructor() { }


  private sidebarState = new BehaviorSubject<boolean>(false);
  sidebarState$ = this.sidebarState.asObservable();

  toggleSidebar() {
    this.sidebarState.next(!this.sidebarState.value);
  }

  closeSidebar() {
    this.sidebarState.next(false);
  }


}
