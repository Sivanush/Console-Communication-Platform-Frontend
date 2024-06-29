import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-friends-header',
  standalone: true,
  imports: [],
  templateUrl: './friends-header.component.html',
  styleUrl: './friends-header.component.scss'
})
export class FriendsHeaderComponent {



  @Input() name!: string



  setupSidebarToggles() {
    throw new Error('Method not implemented.');
  }


  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }


}

