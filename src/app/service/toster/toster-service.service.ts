
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public messageService: MessageService , public hotToastService:HotToastService) { }

  // showSuccess(summary: string, detail?: string) {
  //   this.messageService.add({ severity: 'success', summary: summary, detail: detail });
  // }

  // showError(summary: string, detail?: string) {
    
  //   this.messageService.add({ severity: 'error',  summary: summary, detail: detail });
  // }

  // showInfo(summary: string, detail?: string) {
  //   this.messageService.add({ severity: 'info',  summary: summary, detail: detail });
  // }

  // showWarn(summary: string, detail?: string) {
  //   this.messageService.add({ severity: 'warn',  summary: summary, detail: detail });
  // }

  // showContrast(summary: string, detail?: string) {
  //   this.messageService.add({ severity: 'contrast',  summary: summary, detail: detail });
  // }

  // showSecondary(summary: string, detail?: string) {
  //   this.messageService.add({ severity: 'secondary',  summary: summary, detail: detail });
  // }



  showSuccess(summary: string, detail?: string) {
    this.hotToastService.success(this.formatMessage(summary, detail));
  }

  showError(summary: string, detail?: string) {
    this.hotToastService.error(this.formatMessage(summary, detail));
  }

  showInfo(summary: string, detail?: string) {
    this.hotToastService.info(this.formatMessage(summary, detail),{ id: detail });
  }

  showWarn(summary: string, detail?: string) {
    this.hotToastService.warning(this.formatMessage(summary, detail));
  }

  showContrast(summary: string, detail?: string) {
   
    this.hotToastService.show(this.formatMessage(summary, detail), {
      style: {
        border: '1px solid #000',
        padding: '16px',
        color: '#000',
        background: '#fff'
      }
    });
  }

  showSecondary(summary: string, detail?: string) {
  
    this.hotToastService.show(this.formatMessage(summary, detail), {
    
      style: {
        border: '1px solid #6c757d',
        padding: '16px',
        color: '#fff',
        background: '#6c757d'
      }
    });
  }

  private formatMessage(summary: string, detail?: string): string {
    return detail ? `${summary}: ${detail}` : summary;
  }
}
