import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers:[MessageService]
})
export class HomeComponent {
  constructor(private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { message: string, type: string };

    if (state) {
      this.showToast(state.message, state.type);
    }
  }

  showToast(summary: string, severity: string) {
    this.messageService.add({ severity, summary, detail: '' });
  }
}