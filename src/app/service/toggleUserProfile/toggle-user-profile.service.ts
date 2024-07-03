import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleUserProfileService {

  constructor() { }

  private userProfileSubjectValue = new BehaviorSubject<boolean>(false)
  booleanValue$ = this.userProfileSubjectValue.asObservable()

  updateUserProfileValue(value:boolean){
    const current = this.userProfileSubjectValue.value
    this.userProfileSubjectValue.next(!current)
  }
}
