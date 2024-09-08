import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-server-header',
  standalone: true,
  imports: [],
  templateUrl: './server-header.component.html',
  styleUrl: './server-header.component.scss'
})
export class ServerHeaderComponent {
leaveServer() {
throw new Error('Method not implemented.');
}
viewMembers() {
throw new Error('Method not implemented.');
}

@Input()channelType!: string;
@Input()channelName!: string;

ngOnInit(): void {
  console.log(this.channelName);
  
}

  addMembers() {
    
  }

}
