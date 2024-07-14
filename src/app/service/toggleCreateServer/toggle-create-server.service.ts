import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleCreateServerService {

  constructor() { }

  private createServerVisibility= new BehaviorSubject<boolean>(false)
  booleanValue$ = this.createServerVisibility.asObservable()

  toggleVisible(){
    console.log(!this.createServerVisibility);
    
    this.createServerVisibility.next(!this.createServerVisibility.getValue())
  }
}
