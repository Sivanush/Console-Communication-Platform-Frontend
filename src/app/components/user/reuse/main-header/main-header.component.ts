import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss'
})
export class MainHeaderComponent {



  @Input() name!: string



  setupSidebarToggles() {
    throw new Error('Method not implemented.');
  }


  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }


}




