import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabGuardService {

  private storageKey = 'myAppIsActive';

  constructor() {
    console.log('hi from guard');
    
    this.init();
  }

  private init() {
    window.addEventListener('storage', this.onStorageChange.bind(this));
    window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));

    if (localStorage.getItem(this.storageKey) === 'true') {
      this.preventMultipleTabs();
    } else {
      localStorage.setItem(this.storageKey, 'true');
    }
  }

  private onStorageChange(event: StorageEvent) {
    if (event.key === this.storageKey && event.newValue === 'true') {
      this.preventMultipleTabs();
    }
  }

  private onBeforeUnload() {
    localStorage.removeItem(this.storageKey);
  }

  private preventMultipleTabs() {
    // const userConfirmed = confirm('Only one tab of this website can be open at a time. Click "OK" to close this tab.');
    // if (userConfirmed) {
    //   window.close();
    // }
    alert('Only one tab of this website can be open at a time. This tab will now be disabled.');
    document.body.innerHTML = '<h1>Only one tab of this website can be open at a time. This tab will now be disabled. Please close it.</h1>';
    document.body.style.pointerEvents = 'none'; // Disable any further interaction
    window.close();
  }
}