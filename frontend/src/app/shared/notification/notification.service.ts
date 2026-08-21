import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messageService = inject(MessageService);

  showSuccess(summary: string, detail: string = ''): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 5000
    });
  }

  showError(summary: string, detail: string = ''): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 5000
    });
  }

  showInfo(summary: string, detail: string = ''): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life: 5000
    });
  }

  showHttpError(error: HttpErrorResponse, fallbackMessage: string = 'An unexpected error occurred'): void {
    const detail = error.error?.message || error.message || fallbackMessage;
    this.showError('Error', detail);
  }
}
